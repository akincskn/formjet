"use client";

import { useState } from "react";
import { Trash2, GripVertical, ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FIELD_TYPE_DEFINITIONS } from "./field-types";
import type { FormField } from "@/types/database";
import { cn } from "@/lib/utils";

interface FieldEditorProps {
  field: FormField;
  index: number;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  onChange: (updated: FormField) => void;
  onDelete: () => void;
}

export function FieldEditor({ field, index, dragHandleProps, onChange, onDelete }: FieldEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  function updateField(partial: Partial<FormField>) {
    onChange({ ...field, ...partial });
  }

  function addOption() {
    const options = [...(field.options ?? []), `Option ${(field.options?.length ?? 0) + 1}`];
    updateField({ options });
  }

  function updateOption(i: number, value: string) {
    const options = [...(field.options ?? [])];
    options[i] = value;
    updateField({ options });
  }

  function removeOption(i: number) {
    const options = (field.options ?? []).filter((_, idx) => idx !== i);
    updateField({ options });
  }

  const hasOptions = ["select", "radio", "checkbox"].includes(field.type);

  return (
    <div className={cn("rounded-lg border bg-background shadow-sm", isExpanded && "shadow-md")}>
      {/* Header row */}
      <div className="flex items-center gap-2 p-3">
        <div
          {...dragHandleProps}
          className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </div>
        <span className="flex-1 text-sm font-medium truncate">
          {field.label || `Field ${index + 1}`}
          <span className="ml-2 text-xs text-muted-foreground font-normal">{field.type}</span>
        </span>
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          className="rounded p-1 hover:bg-muted text-muted-foreground"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Expanded editor */}
      {isExpanded && (
        <div className="border-t px-4 pb-4 pt-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Field type</Label>
              <Select
                value={field.type}
                onValueChange={(v) =>
                  updateField({ type: v as FormField["type"], options: [] })
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPE_DEFINITIONS.map((def) => (
                    <SelectItem key={def.type} value={def.type}>
                      <span className="mr-2">{def.icon}</span>
                      {def.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Label *</Label>
              <Input
                className="h-9"
                value={field.label}
                onChange={(e) => updateField({ label: e.target.value })}
                placeholder="Field label"
              />
            </div>
          </div>

          {!hasOptions && (
            <div className="space-y-1.5">
              <Label className="text-xs">Placeholder</Label>
              <Input
                className="h-9"
                value={field.placeholder ?? ""}
                onChange={(e) => updateField({ placeholder: e.target.value })}
                placeholder="Hint text shown in the field"
              />
            </div>
          )}

          {hasOptions && (
            <div className="space-y-2">
              <Label className="text-xs">Options</Label>
              {(field.options ?? []).map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    className="h-8 flex-1"
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(i)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={addOption}
              >
                <Plus className="mr-1 h-3 w-3" />
                Add option
              </Button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Switch
              id={`required-${field.id}`}
              checked={field.required}
              onCheckedChange={(checked) => updateField({ required: checked })}
            />
            <Label htmlFor={`required-${field.id}`} className="text-xs cursor-pointer">
              Required field
            </Label>
          </div>
        </div>
      )}
    </div>
  );
}
