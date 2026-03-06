import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { buildSubmissionSchema } from "@/lib/validators";
import { checkRateLimit } from "@/lib/rate-limit";
import { triggerN8NWebhook } from "@/lib/n8n";
import type { Form } from "@/types/database";

// WHY service role: form submissions come from unauthenticated users.
// RLS would block INSERT from anon users without a policy.
// Service role bypasses RLS — we do our own authorization (check form exists, is_active).
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // Rate limit by IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const { allowed, remaining } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before submitting again." },
      {
        status: 429,
        headers: { "Retry-After": "60", "X-RateLimit-Remaining": "0" },
      }
    );
  }

  // Parse body
  let body: { data: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Fetch form — verify it exists and is active
  const { data: form, error: formError } = await supabase
    .from("forms")
    .select("id, name, fields, settings, notification_channels, is_active, user_id")
    .eq("slug", params.slug)
    .single();

  if (formError || !form) {
    if (formError) console.error("[submit] Form fetch error:", formError.message, formError.code);
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  if (!form.is_active) {
    return NextResponse.json({ error: "This form is no longer accepting responses" }, { status: 403 });
  }

  // Validate submission against form fields
  const typedForm = form as unknown as Form;
  const submissionSchema = buildSubmissionSchema(typedForm.fields);
  const parsed = submissionSchema.safeParse(body.data ?? {});

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as string;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json({ error: "Validation failed", fieldErrors }, { status: 422 });
  }

  // Collect metadata — don't store full user agent for privacy
  const metadata = {
    ip,
    userAgent: request.headers.get("user-agent")?.slice(0, 200) ?? null,
    referrer: request.headers.get("referer") ?? null,
  };

  // Save submission
  const { data: submission, error: insertError } = await supabase
    .from("submissions")
    .insert({
      form_id: form.id,
      data: parsed.data,
      metadata,
      is_read: false,
    })
    .select("id, data, created_at")
    .single();

  if (insertError) {
    console.error("[submit] Insert error:", {
      message: insertError.message,
      code: insertError.code,
      details: insertError.details,
      hint: insertError.hint,
    });
    return NextResponse.json(
      { error: "Failed to save submission", detail: insertError.message },
      { status: 500 }
    );
  }

  // Trigger N8N notification (fire and forget)
  triggerN8NWebhook(
    {
      id: typedForm.id,
      name: typedForm.name,
      fields: typedForm.fields,
      notification_channels: typedForm.notification_channels,
    },
    {
      data: submission.data,
      created_at: submission.created_at,
    }
  );

  return NextResponse.json(
    { success: true, submissionId: submission.id },
    {
      status: 201,
      headers: { "X-RateLimit-Remaining": String(remaining) },
    }
  );
}
