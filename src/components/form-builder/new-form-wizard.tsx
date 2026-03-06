"use client";

import { useState } from "react";
import { TemplateSelector } from "./template-selector";
import { FormBuilder } from "./form-builder";
import { getTemplateFields } from "./form-templates";
import type { FormField } from "@/types/database";

interface NewFormWizardProps {
  userEmail: string;
}

type WizardState =
  | { step: "select" }
  | { step: "build"; name: string; fields: FormField[] };

export function NewFormWizard({ userEmail }: NewFormWizardProps) {
  const [state, setState] = useState<WizardState>({ step: "select" });

  function handleTemplateSelect(templateId: string) {
    const { name, fields } = getTemplateFields(templateId);
    setState({ step: "build", name, fields });
  }

  if (state.step === "select") {
    return <TemplateSelector onSelect={handleTemplateSelect} />;
  }

  return (
    <div className="h-full">
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setState({ step: "select" })}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Şablonlar
        </button>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-xl font-semibold">Yeni form</h1>
      </div>
      <FormBuilder
        mode="create"
        userEmail={userEmail}
        initialName={state.name}
        initialFields={state.fields}
      />
    </div>
  );
}
