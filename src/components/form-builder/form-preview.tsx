"use client";

import type { FormField, FormSettings } from "@/types/database";

interface FormPreviewProps {
  fields: FormField[];
  settings: FormSettings;
  formName: string;
}

// WHY inline styles (not Tailwind) for dynamic user colors:
// Tailwind purges classes not present at build time. User-chosen colors
// are dynamic runtime values — CSS custom properties via style prop is
// the correct approach here.
export function FormPreview({ fields, settings, formName }: FormPreviewProps) {
  const style = {
    "--preview-primary": settings.primaryColor,
    "--preview-bg": settings.backgroundColor,
    fontFamily: settings.fontFamily,
  } as React.CSSProperties;

  return (
    <div
      className="rounded-xl border shadow-sm overflow-hidden"
      style={{ backgroundColor: settings.backgroundColor, ...style }}
    >
      <div className="p-6">
        <h2 className="text-xl font-bold mb-1" style={{ color: "#111" }}>
          {formName || "Form Preview"}
        </h2>
        {fields.length === 0 && (
          <p className="text-sm" style={{ color: "#888" }}>
            Add fields on the left to see a preview here
          </p>
        )}

        <div className="mt-4 space-y-4">
          {fields.map((field) => (
            <PreviewField key={field.id} field={field} primaryColor={settings.primaryColor} />
          ))}
        </div>

        {fields.length > 0 && (
          <button
            type="button"
            className="mt-6 w-full rounded-md py-2.5 px-4 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: settings.primaryColor }}
          >
            {settings.buttonText}
          </button>
        )}
      </div>

      {settings.showBranding && (
        <div className="border-t px-6 py-2 text-center">
          <a
            href="https://formjet.app"
            className="text-xs text-gray-400 hover:text-gray-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by FormJet
          </a>
        </div>
      )}
    </div>
  );
}

function PreviewField({ field, primaryColor }: { field: FormField; primaryColor: string }) {
  const inputClass =
    "w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-current";

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium" style={{ color: "#374151" }}>
        {field.label || "Unlabeled field"}
        {field.required && <span style={{ color: primaryColor }}> *</span>}
      </label>

      {field.type === "textarea" && (
        <textarea
          className={inputClass}
          placeholder={field.placeholder}
          rows={3}
          disabled
          style={{ outline: "none" }}
        />
      )}

      {["text", "email", "tel", "number", "url", "date", "file"].includes(field.type) && (
        <input
          type={field.type}
          className={inputClass}
          placeholder={field.placeholder}
          disabled
        />
      )}

      {field.type === "select" && (
        <select className={inputClass} disabled>
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
          {(field.options ?? ["Option 1", "Option 2"]).map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                disabled
                style={{ accentColor: primaryColor }}
              />
              {opt}
            </label>
          ))}
        </div>
      )}

      {field.type === "checkbox" && (
        <div className="space-y-2">
          {(field.options ?? ["Option 1", "Option 2"]).map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                disabled
                style={{ accentColor: primaryColor }}
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
