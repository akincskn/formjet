"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { FormSettings } from "@/types/database";

interface DesignSettingsProps {
  settings: FormSettings;
  onChange: (updated: FormSettings) => void;
}

export function DesignSettings({ settings, onChange }: DesignSettingsProps) {
  function update(partial: Partial<FormSettings>) {
    onChange({ ...settings, ...partial });
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-sm font-semibold">Colors</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Primary color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => update({ primaryColor: e.target.value })}
                className="h-10 w-10 cursor-pointer rounded border p-1"
              />
              <Input
                className="h-10 font-mono text-xs"
                value={settings.primaryColor}
                onChange={(e) => update({ primaryColor: e.target.value })}
                placeholder="#3b82f6"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Background color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.backgroundColor}
                onChange={(e) => update({ backgroundColor: e.target.value })}
                className="h-10 w-10 cursor-pointer rounded border p-1"
              />
              <Input
                className="h-10 font-mono text-xs"
                value={settings.backgroundColor}
                onChange={(e) => update({ backgroundColor: e.target.value })}
                placeholder="#ffffff"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold">Text</h3>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Submit button text</Label>
            <Input
              value={settings.buttonText}
              onChange={(e) => update({ buttonText: e.target.value })}
              placeholder="Submit"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Success message</Label>
            <Textarea
              value={settings.successMessage}
              onChange={(e) => update({ successMessage: e.target.value })}
              placeholder="Thank you for your response!"
              rows={2}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <p className="text-sm font-medium">Show FormJet branding</p>
          <p className="text-xs text-muted-foreground">
            &ldquo;Powered by FormJet&rdquo; link at the bottom
          </p>
        </div>
        <Switch
          checked={settings.showBranding}
          onCheckedChange={(v) => update({ showBranding: v })}
        />
      </div>
    </div>
  );
}
