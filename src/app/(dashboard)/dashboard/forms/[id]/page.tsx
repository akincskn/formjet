import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Edit, Download, BarChart3, Clock, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubmissionsTable } from "@/components/dashboard/submissions-table";
import { FormSharePanel } from "@/components/dashboard/form-share-panel";
import { FormDeleteButton } from "@/components/dashboard/form-delete-button";
import { formatDate } from "@/lib/utils";
import type { Submission } from "@/types/database";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = await createClient();
  const { data } = await supabase.from("forms").select("name").eq("id", params.id).single();
  return { title: data?.name ?? "Form" };
}

export default async function FormDetailPage({ params }: { params: { id: string } }) {
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

  const { data: submissions } = await supabase
    .from("submissions")
    .select("*")
    .eq("form_id", params.id)
    .order("created_at", { ascending: false });

  // Stats
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - now.getDay());
  thisWeekStart.setHours(0, 0, 0, 0);

  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const allSubs = submissions ?? [];
  const todayCount = allSubs.filter((s) => new Date(s.created_at) >= today).length;
  const weekCount = allSubs.filter((s) => new Date(s.created_at) >= thisWeekStart).length;
  const monthCount = allSubs.filter((s) => new Date(s.created_at) >= thisMonthStart).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{form.name}</h1>
            <Badge variant={form.is_active ? "success" : "secondary"}>
              {form.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
          {form.description && (
            <p className="mt-1 text-muted-foreground">{form.description}</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            Created {formatDate(form.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" asChild>
            <a href={`/api/forms/${params.id}/export`} download>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/forms/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <FormDeleteButton formId={params.id} formName={form.name} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total", value: allSubs.length, icon: BarChart3 },
          { label: "Today", value: todayCount, icon: Clock },
          { label: "This week", value: weekCount, icon: Calendar },
          { label: "This month", value: monthCount, icon: Calendar },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="responses">
        <TabsList>
          <TabsTrigger value="responses">
            Responses ({allSubs.length})
          </TabsTrigger>
          <TabsTrigger value="share">Share & Embed</TabsTrigger>
        </TabsList>

        <TabsContent value="responses" className="mt-4">
          <SubmissionsTable
            formId={params.id}
            initialSubmissions={allSubs as Submission[]}
            fields={form.fields}
          />
        </TabsContent>

        <TabsContent value="share" className="mt-4">
          <div className="max-w-xl">
            <FormSharePanel slug={form.slug} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
