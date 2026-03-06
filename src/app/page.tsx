import Link from "next/link";
import {
  Zap,
  Bell,
  Share2,
  BarChart3,
  Mail,
  MessageCircle,
  Webhook,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Shield,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="py-24 md:py-36">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1">
            <Sparkles className="h-3.5 w-3.5" />
            Free to start — no credit card required
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Build forms.{" "}
            <span className="text-primary">Collect responses.</span>
            <br />
            Get notified instantly.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Create beautiful forms in minutes, share them anywhere, and receive
            real-time notifications via email, Telegram, or webhooks.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" className="h-11 px-7" asChild>
              <Link href="/register">
                Start for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-11 px-7" asChild>
              <Link href="#how-it-works">How it works</Link>
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            5 free forms · 100 responses/month · No credit card needed
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t py-20 bg-muted/30">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold sm:text-3xl">Get started in 3 steps</h2>
            <p className="mt-3 text-muted-foreground">
              From zero to live form in under 5 minutes
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                icon: Sparkles,
                title: "Build your form",
                description:
                  "Drag and drop fields to create your form. Customize design, colors, and success message.",
              },
              {
                step: "2",
                icon: Share2,
                title: "Share anywhere",
                description:
                  "Get a unique link or embed code. Share on social media, email, or add to your website.",
              },
              {
                step: "3",
                icon: Bell,
                title: "Get notified",
                description:
                  "Receive instant notifications via email, Telegram, or webhooks when someone submits.",
              },
            ].map(({ step, icon: Icon, title, description }) => (
              <div key={step} className="rounded-xl border bg-background p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {step}
                  </div>
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-1.5">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold sm:text-3xl">Everything you need</h2>
            <p className="mt-3 text-muted-foreground">
              Powerful features without the complexity
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "10+ field types",
                description: "Text, email, phone, dropdowns, checkboxes, date pickers, and more.",
              },
              {
                icon: Bell,
                title: "Multi-channel notifications",
                description: "Email, Telegram bot, and custom webhooks — all from one form.",
              },
              {
                icon: BarChart3,
                title: "Response dashboard",
                description: "View all responses in a clean table. Filter, sort, and export to CSV.",
              },
              {
                icon: Globe,
                title: "Embeddable",
                description: "One line of code to embed your form on any website.",
              },
              {
                icon: Shield,
                title: "Secure by default",
                description: "Row-level security, rate limiting, and XSS protection built in.",
              },
              {
                icon: Sparkles,
                title: "Custom branding",
                description: "Match your brand with custom colors and success messages.",
              },
            ].map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-xl border bg-card p-5">
                <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="mb-1 text-sm font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notification channels */}
      <section className="border-t py-20 bg-muted/30">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">
                Never miss a response
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Connect multiple notification channels per form. FormJet routes
                each submission to the right place automatically.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  { icon: Mail, title: "Email notifications", description: "Instant email to any address you choose" },
                  { icon: MessageCircle, title: "Telegram bot", description: "Get a Telegram message the second someone submits" },
                  { icon: Webhook, title: "Custom webhooks", description: "POST to your own endpoint for full automation" },
                ].map(({ icon: Icon, title, description }) => (
                  <li key={title} className="flex gap-3">
                    <div className="flex-shrink-0 rounded-lg bg-primary/10 p-2 h-fit">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{title}</p>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
              <div className="flex items-center gap-1.5 border-b bg-muted/50 px-4 py-2.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">webhook payload</span>
              </div>
              <pre className="p-5 text-xs leading-relaxed overflow-auto">
                <code className="text-foreground">{`{
  "formName": "Contact Us",
  "submission": {
    "Full Name": "Alex Johnson",
    "Email": "alex@example.com",
    "Message": "Hi, I'd like to..."
  },
  "channels": [
    { "type": "email" },
    { "type": "telegram" }
  ],
  "submittedAt": "2026-03-04T12:00:00Z"
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold sm:text-3xl">Simple, free to start</h2>
            <p className="mt-3 text-muted-foreground">
              No hidden fees. Upgrade when you need more.
            </p>
          </div>

          <div className="mx-auto max-w-xs">
            <div className="rounded-xl border-2 border-primary bg-background p-7 shadow-sm">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Free forever
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
              <ul className="mt-6 space-y-2.5">
                {[
                  "5 forms",
                  "100 responses / month / form",
                  "Email notifications",
                  "Telegram notifications",
                  "CSV export",
                  "Embeddable forms",
                  "Custom branding",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="mt-7 w-full" asChild>
                <Link href="/register">Get started free</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t py-20 bg-muted/30">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to build your first form?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join hundreds of teams using FormJet to collect and act on responses — for free.
          </p>
          <Button size="lg" className="mt-8 h-11 px-7" asChild>
            <Link href="/register">
              Create your free account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="container mx-auto max-w-5xl px-4 flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <Zap className="h-3 w-3 text-white" />
            </div>
            FormJet
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FormJet. Built with Next.js &amp; Supabase.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
