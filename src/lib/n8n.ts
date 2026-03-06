import type { Form, Submission } from "@/types/database";

interface N8NWebhookPayload {
  formId: string;
  formName: string;
  submission: Record<string, string>;
  notificationChannels: Form["notification_channels"];
  submittedAt: string;
}

// WHY fire-and-forget with catch: N8N webhook failures should NOT fail
// the form submission. User's data is already saved in Supabase.
// We log the error but don't propagate it.
export async function triggerN8NWebhook(
  form: Pick<Form, "id" | "name" | "fields" | "notification_channels">,
  submission: Pick<Submission, "data" | "created_at">
): Promise<void> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    // N8N not configured — skip silently in dev
    if (process.env.NODE_ENV === "development") {
      console.warn("[N8N] N8N_WEBHOOK_URL not set, skipping notification");
    }
    return;
  }

  // Map field IDs to human-readable labels for the notification
  const labeledSubmission: Record<string, string> = {};
  for (const field of form.fields) {
    const value = submission.data[field.id];
    if (value !== undefined) {
      labeledSubmission[field.label] = Array.isArray(value) ? value.join(", ") : value;
    }
  }

  const payload: N8NWebhookPayload = {
    formId: form.id,
    formName: form.name,
    submission: labeledSubmission,
    notificationChannels: form.notification_channels,
    submittedAt: submission.created_at,
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // 5 second timeout — don't block the submission response
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error(`[N8N] Webhook failed: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error("[N8N] Webhook error:", error);
    // Intentionally not re-throwing — submission already saved
  }
}
