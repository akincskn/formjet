// TypeScript types matching the Supabase PostgreSQL schema.
// These are hand-written to match the schema exactly — no codegen needed at this stage.
// WHY: Codegen requires a running Supabase instance. Hand-written types give us
// compile-time safety while keeping setup simple.

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "number"
  | "url"
  | "file";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // Only for select/radio/checkbox
}

export interface FormSettings {
  theme: "light" | "dark" | "custom";
  primaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  buttonText: string;
  successMessage: string;
  showBranding: boolean;
}

export interface NotificationChannel {
  type: "email" | "telegram" | "webhook";
  to?: string;       // email address
  chatId?: string;   // telegram chat id
  url?: string;      // webhook url
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  notification_email: string | null;
  telegram_chat_id: string | null;
  created_at: string;
}

export interface Form {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description: string | null;
  fields: FormField[];
  settings: FormSettings;
  notification_channels: NotificationChannel[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  form_id: string;
  data: Record<string, string | string[]>;
  metadata: {
    ip?: string;
    userAgent?: string;
    referrer?: string;
  };
  is_read: boolean;
  created_at: string;
}

// Derived types for UI convenience
export type FormWithStats = Form & {
  submission_count: number;
  last_submission_at: string | null;
};

export type SubmissionWithForm = Submission & {
  form: Pick<Form, "id" | "name" | "fields">;
};

// Default values — single source of truth for new forms
export const DEFAULT_FORM_SETTINGS: FormSettings = {
  theme: "light",
  primaryColor: "#3b82f6",
  backgroundColor: "#ffffff",
  fontFamily: "Inter",
  buttonText: "Submit",
  successMessage: "Thank you! We'll get back to you shortly.",
  showBranding: true,
};
