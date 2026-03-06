"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, Circle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { Submission, FormField } from "@/types/database";

interface SubmissionsTableProps {
  formId: string;
  initialSubmissions: Submission[];
  fields: FormField[];
}

// WHY client component with realtime: Supabase Realtime subscriptions require
// a persistent WebSocket connection — only possible in the browser.
// We initialize with server-fetched data (no loading state on first paint)
// and patch in new rows as they arrive.
export function SubmissionsTable({ formId, initialSubmissions, fields }: SubmissionsTableProps) {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`submissions:${formId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "submissions",
          filter: `form_id=eq.${formId}`,
        },
        (payload) => {
          const newSub = payload.new as Submission;
          setSubmissions((prev) => [newSub, ...prev]);
          toast.success("New response received!", { duration: 3000 });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [formId]);

  async function markAsRead(submissionId: string) {
    const supabase = createClient();
    await supabase
      .from("submissions")
      .update({ is_read: true })
      .eq("id", submissionId);
    setSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, is_read: true } : s))
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-16 text-center">
        <p className="text-muted-foreground">No responses yet. Share your form to start collecting!</p>
      </div>
    );
  }

  const unreadCount = submissions.filter((s) => !s.is_read).length;

  return (
    <>
      {unreadCount > 0 && (
        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Circle className="h-2 w-2 fill-primary text-primary" />
          {unreadCount} unread response{unreadCount !== 1 ? "s" : ""}
        </div>
      )}

      <div className="rounded-lg border overflow-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground w-8" />
              {fields.slice(0, 4).map((field) => (
                <th key={field.id} className="px-4 py-3 text-left font-medium text-muted-foreground">
                  {field.label}
                </th>
              ))}
              {fields.length > 4 && (
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  +{fields.length - 4} more
                </th>
              )}
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Submitted</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground w-10" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {submissions.map((submission) => (
              <tr
                key={submission.id}
                className="hover:bg-muted/30 cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedSubmission(submission);
                  if (!submission.is_read) markAsRead(submission.id);
                }}
              >
                <td className="px-4 py-3">
                  {!submission.is_read && (
                    <Circle className="h-2 w-2 fill-primary text-primary" />
                  )}
                </td>
                {fields.slice(0, 4).map((field) => {
                  const value = submission.data[field.id];
                  const display = Array.isArray(value) ? value.join(", ") : (value ?? "—");
                  return (
                    <td key={field.id} className="px-4 py-3 max-w-[200px] truncate">
                      {display}
                    </td>
                  );
                })}
                {fields.length > 4 && <td className="px-4 py-3 text-muted-foreground">…</td>}
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {formatDate(submission.created_at)}
                </td>
                <td className="px-4 py-3">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      <Dialog
        open={!!selectedSubmission}
        onOpenChange={(open) => !open && setSelectedSubmission(null)}
      >
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Response details</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Submitted {formatDate(selectedSubmission.created_at)}</span>
                <Badge variant={selectedSubmission.is_read ? "secondary" : "default"}>
                  {selectedSubmission.is_read ? "Read" : "New"}
                </Badge>
              </div>
              <div className="space-y-3">
                {fields.map((field) => {
                  const value = selectedSubmission.data[field.id];
                  const display = Array.isArray(value) ? value.join(", ") : (value ?? "—");
                  return (
                    <div key={field.id} className="rounded-lg bg-muted/40 p-3">
                      <p className="text-xs font-medium text-muted-foreground mb-1">{field.label}</p>
                      <p className="text-sm whitespace-pre-wrap">{display}</p>
                    </div>
                  );
                })}
              </div>
              {selectedSubmission.metadata?.ip && (
                <p className="text-xs text-muted-foreground">
                  IP: {selectedSubmission.metadata.ip}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
