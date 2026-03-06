import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "FormJet — Smart Form Builder",
    template: "%s | FormJet",
  },
  description:
    "Create beautiful forms, collect responses, and get instant multi-channel notifications. Free to start.",
  keywords: ["form builder", "form creator", "notifications", "telegram", "email"],
  openGraph: {
    title: "FormJet — Smart Form Builder",
    description: "Create beautiful forms, collect responses, and get instant notifications.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
