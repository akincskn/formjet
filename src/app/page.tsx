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
  Layout,
  Code2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pb-24 pt-20 md:pb-36 md:pt-32">
        {/* Background glows */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[700px] w-[700px] rounded-full bg-blue-500/8 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-purple-500/6 blur-3xl" />
          <div className="absolute left-0 bottom-0 h-[300px] w-[300px] rounded-full bg-indigo-500/5 blur-3xl" />
        </div>

        <div className="container mx-auto max-w-6xl px-4 text-center">
          <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1.5 text-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Free to start — no credit card required
          </Badge>

          <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05]">
            Build forms.{" "}
            <span className="animate-gradient-text">Collect responses.</span>{" "}
            <br className="hidden sm:block" />
            Get notified instantly.
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
            FormJet lets you create beautiful forms in minutes, share them anywhere,
            and receive real-time notifications via email, Telegram, or custom webhooks.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="h-12 px-8 text-base group" asChild>
              <Link href="/register">
                Start for free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            5 free forms · 100 responses/month · No credit card needed
          </p>

          {/* Hero mockup */}
          <div className="mx-auto mt-20 max-w-4xl">
            <div className="rounded-2xl border bg-card shadow-2xl overflow-hidden ring-1 ring-border/50">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="mx-auto flex items-center gap-2 rounded-md bg-background border px-3 py-1 text-xs text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                  formjet.app/f/contact-us
                </div>
              </div>
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                {/* Form preview */}
                <div className="p-8">
                  <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Full Name *</label>
                      <div className="h-10 rounded-md border bg-background px-3 flex items-center text-sm text-muted-foreground">
                        Your name
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Email *</label>
                      <div className="h-10 rounded-md border bg-background px-3 flex items-center text-sm text-muted-foreground">
                        your@email.com
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Message *</label>
                      <div className="h-20 rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
                        Write your message...
                      </div>
                    </div>
                    <div className="h-10 w-full rounded-md bg-primary flex items-center justify-center text-sm font-medium text-primary-foreground">
                      Send Message
                    </div>
                  </div>
                </div>
                {/* Notification preview */}
                <div className="p-8 bg-muted/20">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">Live notifications</h3>
                  <div className="space-y-3">
                    {[
                      { icon: Mail, label: "Email sent", sub: "to you@company.com", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950" },
                      { icon: MessageCircle, label: "Telegram sent", sub: "to your channel", color: "text-green-500", bg: "bg-green-50 dark:bg-green-950" },
                    ].map(({ icon: Icon, label, sub, color, bg }) => (
                      <div key={label} className="flex items-center gap-3 rounded-xl border bg-background p-3 shadow-sm">
                        <div className={`rounded-lg p-2 ${bg}`}>
                          <Icon className={`h-4 w-4 ${color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{label}</p>
                          <p className="text-xs text-muted-foreground truncate">{sub}</p>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                      </div>
                    ))}
                    <div className="rounded-xl border border-dashed bg-primary/3 p-3 text-center">
                      <p className="text-xs text-muted-foreground">
                        New submission from <span className="font-semibold text-foreground">Alex Johnson</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y bg-muted/30 py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "1,000+", label: "Forms created" },
              { value: "50K+", label: "Responses collected" },
              { value: "99.9%", label: "Uptime" },
              { value: "< 5 min", label: "To go live" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold md:text-4xl">{value}</div>
                <div className="mt-1.5 text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">How it works</Badge>
            <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">Get started in 3 steps</h2>
            <p className="mt-4 text-muted-foreground text-lg">
              From zero to live form in under 5 minutes
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: Layout,
                title: "Build your form",
                description:
                  "Drag and drop fields to create your form. Customize the design, colors, and success message.",
              },
              {
                step: "02",
                icon: Share2,
                title: "Share anywhere",
                description:
                  "Get a unique link or embed code. Share on social media, email, or add to your website.",
              },
              {
                step: "03",
                icon: Bell,
                title: "Get notified",
                description:
                  "Receive instant notifications via email, Telegram, or webhooks when someone submits.",
              },
            ].map(({ step, icon: Icon, title, description }) => (
              <div key={step} className="relative rounded-2xl border bg-background p-8 shadow-sm hover:shadow-md transition-all">
                <div className="absolute right-6 top-6 text-7xl font-black text-muted-foreground/8 leading-none select-none">
                  {step}
                </div>
                <div className="mb-5 inline-flex rounded-xl bg-primary/10 p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">Everything you need</h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Powerful features without the complexity
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                description: "View all responses in a clean table. Filter, sort, export to CSV.",
              },
              {
                icon: Globe,
                title: "Embeddable",
                description: "One line of code to embed your form on any website. Shadow DOM isolated.",
              },
              {
                icon: Shield,
                title: "Secure by default",
                description: "Row-level security, rate limiting, and XSS protection built in.",
              },
              {
                icon: Sparkles,
                title: "Custom branding",
                description: "Match your brand with custom colors, fonts, and success messages.",
              },
              {
                icon: Code2,
                title: "Developer friendly",
                description: "Full webhook API — POST submission data to your own endpoints.",
              },
              {
                icon: Users,
                title: "Built for teams",
                description: "Share form management with your team. Export and analyze together.",
              },
              {
                icon: CheckCircle2,
                title: "Validation built in",
                description: "Required fields, email/URL/phone formats validated automatically.",
              },
            ].map(({ icon: Icon, title, description }) => (
              <div key={title} className="group rounded-xl border bg-card p-6 hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2.5 transition-colors group-hover:bg-primary/15">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-1.5 font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notification channels */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-16 md:grid-cols-2 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">Notifications</Badge>
              <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
                Never miss a response
              </h2>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Connect multiple notification channels per form. FormJet routes
                each submission to the right place automatically.
              </p>
              <ul className="mt-8 space-y-5">
                {[
                  { icon: Mail, title: "Email notifications", description: "Instant email to any address you choose" },
                  { icon: MessageCircle, title: "Telegram bot", description: "Get a Telegram message the second someone submits" },
                  { icon: Webhook, title: "Custom webhooks", description: "POST to your own endpoint for full automation" },
                ].map(({ icon: Icon, title, description }) => (
                  <li key={title} className="flex gap-4">
                    <div className="flex-shrink-0 rounded-xl bg-primary/10 p-2.5 h-fit">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border bg-card shadow-xl overflow-hidden">
              <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <span className="ml-2 text-xs text-muted-foreground font-mono">webhook payload</span>
              </div>
              <pre className="p-6 text-sm overflow-auto leading-relaxed">
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
      <section id="pricing" className="py-24 bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">Simple, free to start</h2>
            <p className="mt-4 text-muted-foreground text-lg">
              No hidden fees. Upgrade when you need more.
            </p>
          </div>
          <div className="mx-auto max-w-sm">
            <div className="rounded-2xl border-2 border-primary bg-background p-8 shadow-2xl ring-4 ring-primary/10">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                Free forever
              </div>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-6xl font-black">$0</span>
                <span className="text-muted-foreground text-lg">/month</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Everything you need to get started</p>
              <ul className="mt-8 space-y-3.5">
                {[
                  "5 forms",
                  "100 responses / month / form",
                  "Email notifications",
                  "Telegram notifications",
                  "CSV export",
                  "Embeddable forms",
                  "Custom branding",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="mt-8 w-full h-11 text-sm font-semibold" size="lg" asChild>
                <Link href="/register">Get started free</Link>
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">No credit card required</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-blue-600 to-indigo-700 px-8 py-16 text-center shadow-2xl md:px-16">
            {/* Decorative blobs */}
            <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/5 blur-2xl" />

            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                Ready to build your first form?
              </h2>
              <p className="mt-4 text-lg text-white/75 max-w-xl mx-auto">
                Join hundreds of teams using FormJet to collect and act on responses — for free.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button
                  size="lg"
                  className="h-12 px-8 text-base bg-white text-primary hover:bg-white/90 font-semibold group"
                  asChild
                >
                  <Link href="/register">
                    Create your free account
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base border-white/30 text-white bg-white/10 hover:bg-white/20 hover:text-white"
                  asChild
                >
                  <Link href="/login">Sign in</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <div className="flex items-center gap-2 font-semibold text-lg">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-4 w-4 text-white" />
              </div>
              FormJet
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FormJet. Built with Next.js &amp; Supabase.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
