import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, FileText, BarChart3, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch forms with submission counts via aggregation
  const { data: forms } = await supabase
    .from("forms")
    .select(`
      id, name, slug, is_active, created_at, updated_at,
      submissions(count)
    `)
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  // Quick stats
  const totalForms = forms?.length ?? 0;
  const totalResponses = forms?.reduce(
    (sum, f) => sum + ((f.submissions as unknown as { count: number }[])?.[0]?.count ?? 0),
    0
  ) ?? 0;

  // Today's submissions count
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { count: todayCount } = await supabase
    .from("submissions")
    .select("id", { count: "exact", head: true })
    .in("form_id", forms?.map((f) => f.id) ?? [])
    .gte("created_at", today.toISOString());

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total forms", value: totalForms, icon: FileText, limit: "/ 5" },
          { label: "Total responses", value: totalResponses, icon: BarChart3, limit: "" },
          { label: "Today", value: todayCount ?? 0, icon: Clock, limit: "responses" },
        ].map(({ label, value, icon: Icon, limit }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {value}
                {limit && <span className="ml-1 text-sm font-normal text-muted-foreground">{limit}</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Forms list */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your forms</h2>
          <Button asChild size="sm">
            <Link href="/dashboard/forms/new">
              <Plus className="mr-2 h-4 w-4" />
              New form
            </Link>
          </Button>
        </div>

        {!forms || forms.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-card p-16 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
            <h3 className="mb-2 font-semibold">No forms yet</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Create your first form and start collecting responses
            </p>
            <Button asChild>
              <Link href="/dashboard/forms/new">
                <Plus className="mr-2 h-4 w-4" />
                Create your first form
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {forms.map((form) => {
              const responseCount =
                (form.submissions as unknown as { count: number }[])?.[0]?.count ?? 0;
              return (
                <Link key={form.id} href={`/dashboard/forms/${form.id}`}>
                  <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base leading-tight">{form.name}</CardTitle>
                        <Badge variant={form.is_active ? "success" : "secondary"} className="shrink-0">
                          {form.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BarChart3 className="h-3.5 w-3.5" />
                          {responseCount} response{responseCount !== 1 ? "s" : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatRelativeTime(form.updated_at)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
