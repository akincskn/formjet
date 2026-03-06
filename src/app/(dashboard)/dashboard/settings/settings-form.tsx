"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { updateProfileSchema } from "@/lib/validators";
import type { Profile } from "@/types/database";
import { saveProfile } from "./settings-actions";

interface SettingsFormProps {
  profile: Profile | null;
  userId: string;
}

export function SettingsForm({ profile }: SettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [name, setName] = useState(profile?.name ?? "");
  const [notificationEmail, setNotificationEmail] = useState(
    profile?.notification_email ?? ""
  );
  const [telegramChatId, setTelegramChatId] = useState(
    profile?.telegram_chat_id ?? ""
  );

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const result = updateProfileSchema.safeParse({
      name,
      notification_email: notificationEmail,
      telegram_chat_id: telegramChatId,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSaving(true);
    try {
      await saveProfile({
        name: result.data.name,
        notification_email: result.data.notification_email || null,
        telegram_chat_id: result.data.telegram_chat_id || null,
      });
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Profile */}
      <div className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold">Profile</h2>
        <div className="space-y-1.5">
          <Label>Full name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold">Default notification settings</h2>
        <p className="text-sm text-muted-foreground">
          These are your default values when creating new forms. You can override them per-form.
        </p>

        <div className="space-y-1.5">
          <Label>Notification email</Label>
          <Input
            type="email"
            value={notificationEmail}
            onChange={(e) => setNotificationEmail(e.target.value)}
            placeholder="you@example.com"
          />
          {errors.notification_email && (
            <p className="text-xs text-destructive">{errors.notification_email}</p>
          )}
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Telegram Chat ID</Label>
            <Input
              value={telegramChatId}
              onChange={(e) => setTelegramChatId(e.target.value)}
              placeholder="e.g. 123456789"
            />
          </div>

          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <p className="text-sm font-medium">How to get your Telegram Chat ID:</p>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Open Telegram and search for <strong>@userinfobot</strong></li>
              <li>Start a chat and send <code>/start</code></li>
              <li>Copy the number from the <strong>Id</strong> field</li>
              <li>Paste it above</li>
            </ol>
            <a
              href="https://t.me/userinfobot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Open @userinfobot <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isSaving}>
        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save changes
      </Button>
    </form>
  );
}
