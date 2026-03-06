import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Form, Submission } from "@/types/database";

// WHY server route for CSV: we build the CSV on the server where we have
// auth context and can query Supabase. The browser just downloads the response.
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify ownership
  const { data: form, error: formError } = await supabase
    .from("forms")
    .select("id, name, fields")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (formError || !form) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  const typedForm = form as unknown as Form;

  const { data: submissions, error: subError } = await supabase
    .from("submissions")
    .select("id, data, is_read, created_at, metadata")
    .eq("form_id", params.id)
    .order("created_at", { ascending: false });

  if (subError) {
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }

  const rows = (submissions ?? []) as Submission[];

  // Build CSV
  const headers = [
    "ID",
    "Submitted At",
    "Read",
    ...typedForm.fields.map((f) => f.label),
    "IP",
  ];

  function escapeCsvCell(val: unknown): string {
    const str = Array.isArray(val) ? val.join("; ") : String(val ?? "");
    // Wrap in quotes if it contains comma, newline, or quote
    if (str.includes(",") || str.includes("\n") || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  const csvRows = [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((row) =>
      [
        row.id,
        row.created_at,
        row.is_read ? "Yes" : "No",
        ...typedForm.fields.map((f) => row.data[f.id] ?? ""),
        row.metadata?.ip ?? "",
      ]
        .map(escapeCsvCell)
        .join(",")
    ),
  ];

  // Prepend UTF-8 BOM so Excel and other apps correctly decode non-ASCII characters
  const csv = "\uFEFF" + csvRows.join("\r\n");
  const filename = `${typedForm.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-responses-${Date.now()}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      // Prevent caching so downloads always have fresh data
      "Cache-Control": "no-store",
    },
  });
}
