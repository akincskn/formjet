"use client";

import { FORM_TEMPLATES, type FormTemplate } from "./form-templates";

interface TemplateSelectorProps {
  onSelect: (templateId: string) => void;
}

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Şablon seçin</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Hazır bir şablonla hızlı başlayın ya da sıfırdan oluşturun
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {FORM_TEMPLATES.map((tpl) => (
          <TemplateCard key={tpl.id} template={tpl} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  onSelect,
}: {
  template: FormTemplate;
  onSelect: (id: string) => void;
}) {
  const isBlank = template.id === "blank";

  return (
    <button
      type="button"
      onClick={() => onSelect(template.id)}
      className={`group flex flex-col gap-3 rounded-xl border p-4 text-left transition-all hover:border-primary hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        isBlank ? "border-dashed" : "border-border"
      }`}
    >
      <span className="text-2xl">{template.icon}</span>

      <div>
        <p className="text-sm font-semibold group-hover:text-primary transition-colors">
          {template.name}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{template.description}</p>
      </div>

      {!isBlank && (
        <p className="text-xs text-muted-foreground">
          {template.fields.length} alan
        </p>
      )}
    </button>
  );
}
