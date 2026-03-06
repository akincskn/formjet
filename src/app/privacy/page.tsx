import Link from "next/link";
import { Zap } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — FormJet",
  description: "How FormJet collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Simple header */}
      <header className="border-b">
        <div className="container mx-auto max-w-6xl px-4 py-4 flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-semibold hover:opacity-80 transition-opacity">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <Zap className="h-3 w-3 text-white" />
            </div>
            FormJet
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-16">
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-2">Last updated: March 2026</p>
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="mt-4 text-muted-foreground">
            This document is for informational purposes only.
          </p>
        </div>

        <div className="prose prose-neutral max-w-none space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              FormJet (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you use our form-building service at formjet.app (the &quot;Service&quot;).
              Please read this policy carefully. If you disagree with its terms, please discontinue use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">We collect information in the following ways:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">Account information:</strong> When you register, we collect your
                email address and a hashed password. We do not store plain-text passwords.
              </li>
              <li>
                <strong className="text-foreground">Form data:</strong> We store the forms you create, including
                field definitions, design settings, and notification preferences.
              </li>
              <li>
                <strong className="text-foreground">Submission data:</strong> When someone submits your form,
                we store the submitted data along with a timestamp and the submitter&apos;s IP address for
                rate-limiting and spam prevention purposes.
              </li>
              <li>
                <strong className="text-foreground">Usage data:</strong> We may collect non-personally-identifiable
                information such as browser type, referring URLs, and pages visited to improve the Service.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>To provide, operate, and maintain the Service</li>
              <li>To send you notifications you have configured (email, Telegram, webhooks)</li>
              <li>To prevent fraud, spam, and abuse through rate limiting</li>
              <li>To improve and personalize your experience</li>
              <li>To respond to your support requests</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Data Sharing and Disclosure</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We do not sell, trade, or rent your personal information to third parties. We may share data with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">Service providers:</strong> Supabase (database and authentication),
                Vercel (hosting). These providers process data only as necessary to provide the Service
                and are bound by confidentiality obligations.
              </li>
              <li>
                <strong className="text-foreground">Notification services:</strong> If you configure Telegram notifications
                or custom webhooks, submission data will be sent to those third-party endpoints you specify.
              </li>
              <li>
                <strong className="text-foreground">Legal requirements:</strong> We may disclose data if required by law,
                regulation, or valid legal process.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your account data for as long as your account is active. Submission data is retained
              until you delete it or delete the associated form. You may delete your account at any time,
              which will result in the deletion of all your forms and submissions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">6. Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures including TLS encryption for data in transit,
              row-level security policies in our database, and rate limiting on public endpoints. However,
              no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">7. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies solely for session management and authentication. We do not use cookies for
              advertising or tracking purposes. By using the Service, you consent to the use of these
              essential cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">8. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Depending on your jurisdiction, you may have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict processing of your data</li>
              <li>Data portability (export your submissions via CSV)</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              To exercise these rights, please contact us at the address below.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">9. Children&apos;s Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Service is not directed to individuals under the age of 13. We do not knowingly collect
              personal information from children under 13. If you become aware that a child has provided us
              with personal information, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">10. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any significant
              changes by posting the new policy on this page with an updated date. Your continued use of
              the Service after any changes constitutes your acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">11. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at:{" "}
              <span className="font-medium text-foreground">privacy@formjet.app</span>
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t py-8 mt-8">
        <div className="container mx-auto max-w-6xl px-4 flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to FormJet
          </Link>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="text-foreground font-medium">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
