import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { NewFormWizard } from "@/components/form-builder/new-form-wizard";

export const metadata: Metadata = { title: "New Form" };

export default async function NewFormPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, notification_email")
    .eq("id", user.id)
    .single();

  // Check free tier limit
  const { count } = await supabase
    .from("forms")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if ((count ?? 0) >= 5) {
    redirect("/dashboard?limit=forms");
  }

  return (
    <NewFormWizard
      userEmail={profile?.notification_email ?? profile?.email ?? user.email ?? ""}
    />
  );
}
