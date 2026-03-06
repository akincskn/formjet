"use client";

import { Mail, MessageCircle, Webhook } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { NotificationChannel } from "@/types/database";

interface NotificationSettingsProps {
  channels: NotificationChannel[];
  defaultEmail: string;
  onChange: (channels: NotificationChannel[]) => void;
}

export function NotificationSettings({
  channels,
  defaultEmail,
  onChange,
}: NotificationSettingsProps) {
  const emailChannel = channels.find((c) => c.type === "email") as
    | (NotificationChannel & { type: "email" })
    | undefined;
  const telegramChannel = channels.find((c) => c.type === "telegram") as
    | (NotificationChannel & { type: "telegram" })
    | undefined;
  const webhookChannel = channels.find((c) => c.type === "webhook") as
    | (NotificationChannel & { type: "webhook" })
    | undefined;

  function toggleChannel(type: NotificationChannel["type"], enabled: boolean) {
    if (enabled) {
      const defaults: Record<string, NotificationChannel> = {
        email: { type: "email", to: defaultEmail },
        telegram: { type: "telegram", chatId: "" },
        webhook: { type: "webhook", url: "" },
      };
      onChange([...channels, defaults[type]]);
    } else {
      onChange(channels.filter((c) => c.type !== type));
    }
  }

  function updateChannel(updated: NotificationChannel) {
    onChange(channels.map((c) => (c.type === updated.type ? updated : c)));
  }

  return (
    <div className="space-y-4">
      {/* Email */}
      <div className="rounded-lg border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Mail className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Email notification</p>
              <p className="text-xs text-muted-foreground">Receive an email on each submission</p>
            </div>
          </div>
          <Switch
            checked={!!emailChannel}
            onCheckedChange={(v) => toggleChannel("email", v)}
          />
        </div>
        {emailChannel && (
          <div className="space-y-1.5">
            <Label className="text-xs">Send to email</Label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={emailChannel.to ?? ""}
              onChange={(e) =>
                updateChannel({ type: "email", to: e.target.value })
              }
            />
          </div>
        )}
      </div>

      {/* Telegram */}
      <div className="rounded-lg border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-sky-100 p-2">
              <MessageCircle className="h-4 w-4 text-sky-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Telegram notification</p>
              <p className="text-xs text-muted-foreground">Get a Telegram message instantly</p>
            </div>
          </div>
          <Switch
            checked={!!telegramChannel}
            onCheckedChange={(v) => toggleChannel("telegram", v)}
          />
        </div>
        {telegramChannel && (
          <div className="space-y-1.5">
            <Label className="text-xs">Telegram Chat ID</Label>
            <Input
              placeholder="e.g. 123456789"
              value={telegramChannel.chatId ?? ""}
              onChange={(e) =>
                updateChannel({ type: "telegram", chatId: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground">
              Message @userinfobot on Telegram to get your Chat ID
            </p>
          </div>
        )}
      </div>

      {/* Webhook */}
      <div className="rounded-lg border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2">
              <Webhook className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Webhook</p>
              <p className="text-xs text-muted-foreground">POST submission data to your URL</p>
            </div>
          </div>
          <Switch
            checked={!!webhookChannel}
            onCheckedChange={(v) => toggleChannel("webhook", v)}
          />
        </div>
        {webhookChannel && (
          <div className="space-y-1.5">
            <Label className="text-xs">Webhook URL</Label>
            <Input
              type="url"
              placeholder="https://your-server.com/webhook"
              value={webhookChannel.url ?? ""}
              onChange={(e) =>
                updateChannel({ type: "webhook", url: e.target.value })
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
