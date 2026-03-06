"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Loader2, Eye, EyeOff } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { nanoid } from "nanoid";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";

import { FieldEditor } from "./field-editor";
import { FormPreview } from "./form-preview";
import { DesignSettings } from "./design-settings";
import { NotificationSettings } from "./notification-settings";
import { FIELD_TYPE_DEFINITIONS } from "./field-types";

import type { FormField, FormSettings, NotificationChannel, Form } from "@/types/database";
import { DEFAULT_FORM_SETTINGS } from "@/types/database";
import { slugify } from "@/lib/utils";

interface FormBuilderProps {
  mode: "create" | "edit";
  existingForm?: Form;
  userEmail: string;
  initialName?: string;
  initialFields?: FormField[];
}

// Wrapper for dnd-kit sortable — each field needs this
function SortableFieldEditor({
  field,
  index,
  onChange,
  onDelete,
}: {
  field: FormField;
  index: number;
  onChange: (updated: FormField) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <FieldEditor
        field={field}
        index={index}
        dragHandleProps={{ ...attributes, ...listeners }}
        onChange={onChange}
        onDelete={onDelete}
      />
    </div>
  );
}

export function FormBuilder({ mode, existingForm, userEmail, initialName, initialFields }: FormBuilderProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const [name, setName] = useState(existingForm?.name ?? initialName ?? "");
  const [description, setDescription] = useState(existingForm?.description ?? "");
  const [fields, setFields] = useState<FormField[]>(existingForm?.fields ?? initialFields ?? []);
  const [settings, setSettings] = useState<FormSettings>(
    existingForm?.settings ?? DEFAULT_FORM_SETTINGS
  );
  const [channels, setChannels] = useState<NotificationChannel[]>(
    existingForm?.notification_channels ?? [{ type: "email", to: userEmail }]
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFields((prev) => {
        const oldIndex = prev.findIndex((f) => f.id === active.id);
        const newIndex = prev.findIndex((f) => f.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }

  function addField(type: FormField["type"]) {
    const def = FIELD_TYPE_DEFINITIONS.find((d) => d.type === type)!;
    const newField: FormField = {
      id: `field_${nanoid(8)}`,
      type,
      label: def.label,
      placeholder: def.defaultPlaceholder,
      required: false,
      options: def.hasOptions ? ["Option 1", "Option 2"] : undefined,
    };
    setFields((prev) => [...prev, newField]);
  }

  const updateField = useCallback((id: string, updated: FormField) => {
    setFields((prev) => prev.map((f) => (f.id === id ? updated : f)));
  }, []);

  const deleteField = useCallback((id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  }, []);

  async function handleSave() {
    if (!name.trim()) {
      toast.error("Form name is required");
      return;
    }
    if (fields.length === 0) {
      toast.error("Add at least one field");
      return;
    }

    setIsSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Not authenticated");
      setIsSaving(false);
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      fields,
      settings,
      notification_channels: channels,
      updated_at: new Date().toISOString(),
    };

    if (mode === "create") {
      const slug = `${slugify(name)}-${nanoid(6)}`;
      const { data, error } = await supabase
        .from("forms")
        .insert({ ...payload, user_id: user.id, slug, is_active: true })
        .select("id")
        .single();

      if (error) {
        toast.error("Failed to create form");
        console.error(error);
        setIsSaving(false);
        return;
      }
      toast.success("Form created!");
      router.push(`/dashboard/forms/${data.id}`);
    } else {
      const { error } = await supabase
        .from("forms")
        .update(payload)
        .eq("id", existingForm!.id)
        .eq("user_id", user.id);

      if (error) {
        toast.error("Failed to save changes");
        console.error(error);
        setIsSaving(false);
        return;
      }
      toast.success("Changes saved");
      router.refresh();
    }

    setIsSaving(false);
  }

  return (
    <div className="flex h-full flex-col">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-sm space-y-1">
          <Label>Form name *</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Contact Us"
            className="font-medium"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowPreview((v) => !v)}
          >
            {showPreview ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {showPreview ? "Hide preview" : "Show preview"}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Create form" : "Save changes"}
          </Button>
        </div>
      </div>

      <div className={`grid flex-1 gap-6 ${showPreview ? "lg:grid-cols-2" : ""}`}>
        {/* Left: editor */}
        <div className="space-y-6 overflow-y-auto">
          <div className="space-y-1.5">
            <Label>Description (optional)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this form for?"
              rows={2}
            />
          </div>

          <Tabs defaultValue="fields">
            <TabsList className="w-full">
              <TabsTrigger value="fields" className="flex-1">Fields</TabsTrigger>
              <TabsTrigger value="design" className="flex-1">Design</TabsTrigger>
              <TabsTrigger value="notifications" className="flex-1">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="fields" className="mt-4 space-y-4">
              {/* Field type picker */}
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">ADD FIELD</p>
                <div className="flex flex-wrap gap-2">
                  {FIELD_TYPE_DEFINITIONS.map((def) => (
                    <button
                      key={def.type}
                      type="button"
                      onClick={() => addField(def.type)}
                      className="flex items-center gap-1.5 rounded-md border bg-background px-2.5 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
                    >
                      <span>{def.icon}</span>
                      {def.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sortable field list */}
              {fields.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Click a field type above to add your first field
                  </p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={fields.map((f) => f.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {fields.map((field, i) => (
                        <SortableFieldEditor
                          key={field.id}
                          field={field}
                          index={i}
                          onChange={(updated) => updateField(field.id, updated)}
                          onDelete={() => deleteField(field.id)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}

              {fields.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => addField("text")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add field
                </Button>
              )}
            </TabsContent>

            <TabsContent value="design" className="mt-4">
              <DesignSettings settings={settings} onChange={setSettings} />
            </TabsContent>

            <TabsContent value="notifications" className="mt-4">
              <NotificationSettings
                channels={channels}
                defaultEmail={userEmail}
                onChange={setChannels}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: preview */}
        {showPreview && (
          <div className="hidden lg:block overflow-y-auto">
            <p className="mb-3 text-xs font-medium text-muted-foreground">LIVE PREVIEW</p>
            <FormPreview fields={fields} settings={settings} formName={name} />
          </div>
        )}
      </div>
    </div>
  );
}
