import type { FieldType } from "@/types/database";

export interface FieldTypeDefinition {
  type: FieldType;
  label: string;
  icon: string; // emoji used in the type picker
  hasOptions: boolean; // select/radio/checkbox have options
  defaultPlaceholder: string;
}

// Single source of truth for all supported field types.
// WHY co-locate: changing a type affects picker, renderer, validator — all in one place.
export const FIELD_TYPE_DEFINITIONS: FieldTypeDefinition[] = [
  { type: "text", label: "Short text", icon: "T", hasOptions: false, defaultPlaceholder: "Enter text..." },
  { type: "email", label: "Email", icon: "@", hasOptions: false, defaultPlaceholder: "you@example.com" },
  { type: "tel", label: "Phone", icon: "📞", hasOptions: false, defaultPlaceholder: "+1 (555) 000-0000" },
  { type: "number", label: "Number", icon: "#", hasOptions: false, defaultPlaceholder: "0" },
  { type: "url", label: "URL", icon: "🔗", hasOptions: false, defaultPlaceholder: "https://example.com" },
  { type: "textarea", label: "Long text", icon: "¶", hasOptions: false, defaultPlaceholder: "Enter your message..." },
  { type: "select", label: "Dropdown", icon: "▾", hasOptions: true, defaultPlaceholder: "Select an option" },
  { type: "radio", label: "Multiple choice", icon: "◉", hasOptions: true, defaultPlaceholder: "" },
  { type: "checkbox", label: "Checkboxes", icon: "☑", hasOptions: true, defaultPlaceholder: "" },
  { type: "date", label: "Date", icon: "📅", hasOptions: false, defaultPlaceholder: "" },
  { type: "file", label: "File upload", icon: "📎", hasOptions: false, defaultPlaceholder: "" },
];

export function getFieldDef(type: FieldType): FieldTypeDefinition {
  return FIELD_TYPE_DEFINITIONS.find((d) => d.type === type) ?? FIELD_TYPE_DEFINITIONS[0];
}
