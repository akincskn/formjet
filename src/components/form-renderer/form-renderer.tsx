"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import type { FormField, FormSettings } from "@/types/database";

interface FormRendererProps {
  formId: string;
  slug: string;
  name: string;
  description: string | null;
  fields: FormField[];
  settings: FormSettings;
}

// WHY inline styles for colors: same reasoning as FormPreview —
// user-defined colors are runtime values Tailwind can't purge-safelist.
export function FormRenderer({
  slug,
  name,
  description,
  fields,
  settings,
}: FormRendererProps) {
  const [values, setValues] = useState<Record<string, string | string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function updateValue(fieldId: string, value: string | string[]) {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  }

  function toggleCheckboxValue(fieldId: string, option: string, checked: boolean) {
    const current = (values[fieldId] as string[] | undefined) ?? [];
    const next = checked ? [...current, option] : current.filter((v) => v !== option);
    updateValue(fieldId, next);
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    for (const field of fields) {
      if (!field.required) continue;
      const val = values[field.id];
      if (field.type === "checkbox") {
        if (!val || (val as string[]).length === 0) {
          newErrors[field.id] = `${field.label} is required`;
        }
      } else {
        if (!val || (val as string).trim() === "") {
          newErrors[field.id] = `${field.label} is required`;
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/submit/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: values }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (res.status === 429) {
          toast.error("Too many submissions. Please wait a moment.");
        } else {
          toast.error(body.error ?? "Submission failed. Please try again.");
        }
        return;
      }

      setSubmitted(true);
    } catch {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const containerStyle: React.CSSProperties = {
    backgroundColor: settings.backgroundColor,
    fontFamily: settings.fontFamily,
    minHeight: "100vh",
  };

  if (submitted) {
    return (
      <div style={containerStyle} className="flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <CheckCircle2
            className="mx-auto mb-4 h-16 w-16"
            style={{ color: settings.primaryColor }}
          />
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#111" }}>
            Thank you!
          </h2>
          <p className="text-gray-500">{settings.successMessage}</p>
          {settings.showBranding && (
            <a
              href="https://formjet.app"
              className="mt-8 inline-block text-xs text-gray-300 hover:text-gray-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by FormJet
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle} className="py-12 px-4">
      <div className="mx-auto max-w-lg">
        <div className="rounded-2xl border bg-white shadow-sm p-8">
          <h1 className="text-2xl font-bold mb-1" style={{ color: "#111" }}>
            {name}
          </h1>
          {description && <p className="text-gray-500 mb-6">{description}</p>}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {fields.map((field) => (
              <FormField
                key={field.id}
                field={field}
                value={values[field.id]}
                error={errors[field.id]}
                primaryColor={settings.primaryColor}
                onChange={(v) => updateValue(field.id, v)}
                onCheckboxChange={(opt, checked) =>
                  toggleCheckboxValue(field.id, opt, checked)
                }
              />
            ))}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg py-3 px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ backgroundColor: settings.primaryColor }}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {settings.buttonText}
            </button>
          </form>
        </div>

        {settings.showBranding && (
          <p className="mt-4 text-center">
            <a
              href="https://formjet.app"
              className="text-xs text-gray-300 hover:text-gray-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by FormJet
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

// Individual field renderer
function FormField({
  field,
  value,
  error,
  primaryColor,
  onChange,
  onCheckboxChange,
}: {
  field: FormField;
  value: string | string[] | undefined;
  error: string | undefined;
  primaryColor: string;
  onChange: (v: string) => void;
  onCheckboxChange: (option: string, checked: boolean) => void;
}) {
  const inputClass =
    "w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors";
  const errorClass = "border-red-400 bg-red-50";
  const normalClass = "border-gray-200 bg-white focus:border-blue-400";

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium" style={{ color: "#374151" }}>
        {field.label}
        {field.required && (
          <span className="ml-0.5" style={{ color: primaryColor }}>
            {" "}*
          </span>
        )}
      </label>

      {field.type === "textarea" && (
        <textarea
          className={`${inputClass} ${error ? errorClass : normalClass} resize-none`}
          placeholder={field.placeholder}
          rows={4}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {["text", "email", "tel", "number", "url", "date"].includes(field.type) && (
        <input
          type={field.type}
          className={`${inputClass} ${error ? errorClass : normalClass}`}
          placeholder={field.placeholder}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === "file" && (
        <input
          type="file"
          className={`${inputClass} ${error ? errorClass : normalClass} file:mr-3 file:rounded file:border-0 file:bg-gray-100 file:px-3 file:py-1 file:text-sm`}
          onChange={(e) => onChange(e.target.files?.[0]?.name ?? "")}
        />
      )}

      {field.type === "select" && (
        <select
          className={`${inputClass} ${error ? errorClass : normalClass}`}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{field.placeholder || "Select an option"}</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}

      {field.type === "radio" && (
        <div className="space-y-2">
          {field.options?.map((opt) => (
            <label key={opt} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="radio"
                name={field.id}
                value={opt}
                checked={(value as string) === opt}
                onChange={() => onChange(opt)}
                style={{ accentColor: primaryColor }}
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
      )}

      {field.type === "checkbox" && (
        <div className="space-y-2">
          {field.options?.map((opt) => (
            <label key={opt} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                value={opt}
                checked={((value as string[]) ?? []).includes(opt)}
                onChange={(e) => onCheckboxChange(opt, e.target.checked)}
                style={{ accentColor: primaryColor }}
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
