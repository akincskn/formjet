import { test, expect } from "@playwright/test";

test.describe("Public form page — no auth required", () => {
  test("shows not-found for non-existent slug", async ({ page }) => {
    await page.goto("/f/this-slug-does-not-exist-12345");
    await expect(page.getByText(/404|not found/i)).toBeVisible();
  });

  test("submit API returns 404 for unknown slug", async ({ request }) => {
    const res = await request.post("/api/submit/unknown-slug-xyz", {
      data: { data: {} },
    });
    expect(res.status()).toBe(404);
  });

  test("submit API rate limits after 10 requests from same IP", async ({ request }) => {
    const slug = "rate-limit-test-slug";
    const ip = "5.6.7.8";
    const responses = await Promise.all(
      Array.from({ length: 11 }, () =>
        request.post(`/api/submit/${slug}`, {
          data: { data: {} },
          headers: { "x-forwarded-for": ip },
        })
      )
    );
    const statuses = responses.map((r) => r.status());
    // Some should be 404 (slug not found), the 11th from that IP should be 429
    expect(statuses).toContain(429);
  });
});

// ─── Full E2E form submit (requires seeded form in Supabase) ─────────────────
// Set TEST_FORM_SLUG env var to the slug of an active, seeded test form.

test.describe("Public form — submit flow (requires seeded DB)", () => {
  test.skip(!process.env.TEST_FORM_SLUG, "TEST_FORM_SLUG not set");

  const slug = process.env.TEST_FORM_SLUG!;

  test("form page renders and shows submit button", async ({ page }) => {
    await page.goto(`/f/${slug}`);
    await expect(page.getByRole("button", { name: /submit/i })).toBeVisible();
  });

  test("shows validation errors when submitting empty required fields", async ({ page }) => {
    await page.goto(`/f/${slug}`);
    await page.getByRole("button", { name: /submit/i }).click();
    // At least one error should appear
    await expect(page.getByText(/required|zorunlu/i).first()).toBeVisible();
  });
});
