import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { FormRenderer } from "@/components/form-renderer/form-renderer";
import type { Form } from "@/types/database";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("forms")
    .select("name, description")
    .eq("slug", params.slug)
    .eq("is_active", true)
    .single();

  if (!data) return { title: "Form not found" };

  return {
    title: data.name,
    description: data.description ?? `Fill out the ${data.name} form`,
    // Prevent search engine indexing of user forms
    robots: { index: false },
  };
}

// WHY no auth: public form pages are accessible to anyone.
// We use the Supabase server client with the anon key, RLS handles security.
export default async function PublicFormPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();

  const { data: form } = await supabase
    .from("forms")
    .select("id, name, description, slug, fields, settings, is_active")
    .eq("slug", params.slug)
    .single();

  if (!form || !form.is_active) {
    notFound();
  }

  return (
    <FormRenderer
      formId={form.id}
      slug={form.slug}
      name={form.name}
      description={form.description}
      fields={(form as Form).fields}
      settings={(form as Form).settings}
    />
  );
}
