import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

// WHY Suspense: useSearchParams() in LoginForm reads the query string at render time.
// Next.js App Router requires a Suspense boundary when a client component
// uses useSearchParams() to enable streaming SSR correctly.
export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">Sign in to your FormJet account</p>
      </div>
      <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-muted" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
