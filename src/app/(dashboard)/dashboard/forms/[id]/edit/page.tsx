import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { FormBuilder } from "@/components/form-builder/form-builder";
import type { Form } from "@/types/database";

export const metadata: Metadata = { title: "Edit Form" };

export default async function EditFormPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: form } = await supabase
    .from("forms")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!form) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, notification_email")
    .eq("id", user.id)
    .single();

  return (
    <div className="h-full">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Edit form</h1>
        <p className="text-sm text-muted-foreground">{form.name}</p>
      </div>
      <FormBuilder
        mode="edit"
        existingForm={form as Form}
        userEmail={profile?.notification_email ?? profile?.email ?? user.email ?? ""}
      />
    </div>
  );
}
