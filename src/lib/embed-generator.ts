// Generates the embed snippet shown to users in the dashboard.
// The actual embed script lives at /api/embed/[slug].js (served dynamically).

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://formjet.app";

export function generateEmbedSnippet(slug: string): string {
  return `<script src="${APP_URL}/embed/${slug}.js" async></script>\n<div id="formjet-${slug}"></div>`;
}

export function generateFormUrl(slug: string): string {
  return `${APP_URL}/f/${slug}`;
}

export function generateApiEndpoint(slug: string): string {
  return `${APP_URL}/api/submit/${slug}`;
}
