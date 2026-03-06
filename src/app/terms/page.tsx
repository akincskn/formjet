import Link from "next/link";
import { Zap } from "lucide-react";

export const metadata = {
  title: "Terms of Service — FormJet",
  description: "Terms and conditions for using the FormJet service.",
};

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="mt-4 text-muted-foreground">
            This document is for informational purposes only.
          </p>
        </div>

        <div className="prose prose-neutral max-w-none space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using FormJet (&quot;the Service&quot;) at formjet.app, you agree to be bound
              by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you may not
              use the Service. We reserve the right to update these Terms at any time, and your continued
              use of the Service constitutes acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              FormJet is a web-based form-building platform that allows users to create, publish, and manage
              online forms, collect submissions, and receive notifications through various channels (email,
              Telegram, and webhooks). The Service is provided &quot;as is&quot; and we reserve the right
              to modify, suspend, or discontinue any part of it at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Account Registration</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>You must provide a valid email address and maintain accurate account information.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You are responsible for all activity that occurs under your account.</li>
              <li>You must be at least 13 years of age to create an account.</li>
              <li>Each person may maintain only one account unless explicitly authorized otherwise.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Acceptable Use</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              You agree to use the Service only for lawful purposes. You must not use FormJet to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Collect sensitive personal information (e.g., payment card details, passwords, government IDs) without appropriate security measures and legal basis</li>
              <li>Send spam, phishing messages, or unsolicited communications</li>
              <li>Distribute malware, viruses, or any malicious code</li>
              <li>Violate any applicable local, national, or international law or regulation</li>
              <li>Infringe upon the intellectual property rights of others</li>
              <li>Harass, abuse, or harm any person</li>
              <li>Attempt to gain unauthorized access to any part of the Service or its infrastructure</li>
              <li>Conduct automated attacks, scrapers, or bots against the Service</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              We reserve the right to suspend or terminate accounts that violate these policies without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Data Ownership</h2>
            <p className="text-muted-foreground leading-relaxed">
              You retain full ownership of all data you submit to the Service, including form definitions
              and submission data collected through your forms. By using the Service, you grant FormJet
              a limited, non-exclusive license to store and process this data solely for the purpose of
              providing the Service to you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">6. Free Plan Limitations</h2>
            <p className="text-muted-foreground leading-relaxed">
              The current free plan includes up to 5 active forms and 100 submissions per month per form.
              We reserve the right to modify these limits, introduce paid plans, or retire the free tier
              with reasonable advance notice. We will make reasonable efforts to notify active users
              of any significant changes to plan availability.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">7. Service Availability</h2>
            <p className="text-muted-foreground leading-relaxed">
              We strive to maintain high availability but do not guarantee uninterrupted access to the Service.
              Scheduled maintenance, technical issues, or circumstances beyond our control may cause
              temporary unavailability. We are not liable for any damages or losses resulting from
              Service downtime or interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">8. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              The FormJet name, logo, and all related software, designs, and documentation are the
              intellectual property of FormJet. You may not copy, modify, distribute, or create
              derivative works of our intellectual property without express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">9. Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Service integrates with third-party services (e.g., Telegram, email providers, webhooks).
              Your use of these services is subject to their respective terms and policies. We are not
              responsible for the actions, content, or privacy practices of any third-party services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">10. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground leading-relaxed">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
              EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE
              WILL BE ERROR-FREE, SECURE, OR CONTINUOUSLY AVAILABLE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">11. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, FORMJET SHALL NOT BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS,
              DATA, OR GOODWILL, ARISING FROM YOUR USE OF OR INABILITY TO USE THE SERVICE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">12. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              You may terminate your account at any time by deleting it from the Settings page. We may
              terminate or suspend your account at our discretion if you violate these Terms. Upon
              termination, your right to use the Service ceases immediately and we may delete your data
              in accordance with our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">13. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with applicable laws.
              Any disputes arising from these Terms or your use of the Service shall be resolved
              through good-faith negotiation before any formal proceedings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">14. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms, please contact us at:{" "}
              <span className="font-medium text-foreground">legal@formjet.app</span>
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
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="text-foreground font-medium">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
