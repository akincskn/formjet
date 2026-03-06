import Link from "next/link";
import { Zap } from "lucide-react";

// Shared layout for login and register pages.
// WHY separate route group (auth): keeps dashboard layout separate.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col bg-primary p-10 text-white">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
            <Zap className="h-4 w-4" />
          </div>
          FormJet
        </Link>
        <div className="mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;FormJet made it dead simple to collect leads and get Telegram
              notifications. I set it up in 10 minutes.&rdquo;
            </p>
            <footer className="text-sm text-primary-foreground/70">— Alex Johnson, Indie Developer</footer>
          </blockquote>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center lg:hidden">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-4 w-4 text-white" />
              </div>
              FormJet
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
