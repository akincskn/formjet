import { z } from "zod";

// WHY Zod: runtime validation with TypeScript inference.
// Single source of truth — same schema validates both API and UI.

export const formFieldSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["text", "email", "tel", "textarea", "select", "radio", "checkbox", "date", "number", "url", "file"]),
  label: z.string().min(1, "Label is required"),
  placeholder: z.string().optional(),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
});

export const formSettingsSchema = z.object({
  theme: z.enum(["light", "dark", "custom"]),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
  fontFamily: z.string(),
  buttonText: z.string().min(1),
  successMessage: z.string().min(1),
  showBranding: z.boolean(),
});

export const notificationChannelSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("email"), to: z.string().email() }),
  z.object({ type: z.literal("telegram"), chatId: z.string().min(1) }),
  z.object({ type: z.literal("webhook"), url: z.string().url() }),
]);

export const createFormSchema = z.object({
  name: z.string().min(1, "Form name is required").max(100),
  description: z.string().max(500).optional(),
  fields: z.array(formFieldSchema).min(1, "Add at least one field"),
  settings: formSettingsSchema,
  notification_channels: z.array(notificationChannelSchema),
});

export const updateFormSchema = createFormSchema.partial();

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  notification_email: z.string().email("Invalid email").or(z.literal("")),
  telegram_chat_id: z.string().optional(),
});

// Submission validation — dynamic, built from form fields at runtime
export function buildSubmissionSchema(fields: z.infer<typeof formFieldSchema>[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case "email":
        fieldSchema = z.string().email("Invalid email address");
        break;
      case "url":
        fieldSchema = z.string().url("Invalid URL");
        break;
      case "number":
        fieldSchema = z.string().regex(/^\d+(\.\d+)?$/, "Must be a number");
        break;
      case "tel":
        fieldSchema = z.string().regex(/^[\d\s\-\+\(\)]+$/, "Invalid phone number");
        break;
      case "checkbox":
        fieldSchema = z.array(z.string());
        break;
      default:
        fieldSchema = z.string();
    }

    if (field.required) {
      if (field.type === "checkbox") {
        shape[field.id] = z.array(z.string()).min(1, `${field.label} is required`);
      } else {
        shape[field.id] = fieldSchema.refine(
          (v) => typeof v === "string" && v.length > 0,
          `${field.label} is required`
        );
      }
    } else {
      shape[field.id] = fieldSchema.optional();
    }
  }

  return z.object(shape);
}

export type CreateFormInput = z.infer<typeof createFormSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
