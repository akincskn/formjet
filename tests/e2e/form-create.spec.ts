import { test, expect } from "@playwright/test";
import { loginUser } from "./helpers/auth";

// ─── All tests here need a logged-in user ────────────────────────────────────
test.skip(!process.env.TEST_USER_EMAIL, "TEST_USER_EMAIL not set — skipping form create tests");

test.describe("Form creation — template flow", () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
    await page.goto("/dashboard/forms/new");
  });

  test("template selector is shown on /forms/new", async ({ page }) => {
    await expect(page.getByText(/şablon seçin|şablonlar/i)).toBeVisible();
    await expect(page.getByText("Boş Form")).toBeVisible();
    await expect(page.getByText("İletişim Formu")).toBeVisible();
  });

  test("clicking 'Boş Form' opens empty builder", async ({ page }) => {
    await page.getByText("Boş Form").click();
    // Builder step — no template name pre-filled
    await expect(page.getByRole("heading", { name: /yeni form/i })).toBeVisible();
    // Fields list should be empty
    await expect(page.getByText(/click a field type|add your first field/i)).toBeVisible();
  });

  test("clicking 'İletişim Formu' pre-fills name and fields", async ({ page }) => {
    await page.getByText("İletişim Formu").click();
    // Form name input should be pre-filled
    const nameInput = page.getByPlaceholder(/e\.g\. contact/i);
    await expect(nameInput).toHaveValue("İletişim Formu");
    // Fields should be visible in the builder
    await expect(page.getByText("Ad Soyad")).toBeVisible();
    await expect(page.getByText("E-posta")).toBeVisible();
    await expect(page.getByText("Mesaj")).toBeVisible();
  });

  test("can navigate back from builder to template list", async ({ page }) => {
    await page.getByText("Randevu Formu").click();
    await page.getByRole("button", { name: /← şablonlar/i }).click();
    await expect(page.getByText(/şablon seçin/i)).toBeVisible();
  });

  test("can create a form from template and reach form detail page", async ({ page }) => {
    await page.getByText("Geri Bildirim Formu").click();

    // Rename it to avoid collision
    const nameInput = page.getByPlaceholder(/e\.g\. contact/i);
    await nameInput.clear();
    await nameInput.fill(`E2E Test Form ${Date.now()}`);

    await page.getByRole("button", { name: /create form/i }).click();

    // Should redirect to /dashboard/forms/<id>
    await expect(page).toHaveURL(/\/dashboard\/forms\/[a-z0-9-]+$/, { timeout: 15_000 });
    await expect(page.getByText(/responses|submissions/i)).toBeVisible();
  });
});

test.describe("Dashboard — submission appears after form submit", () => {
  test.skip(!process.env.TEST_FORM_SLUG, "TEST_FORM_SLUG not set");

  test("submission is visible in dashboard after public form submit", async ({
    page,
    request,
  }) => {
    const slug = process.env.TEST_FORM_SLUG!;

    // Submit via API (simulates public form submit)
    const submitRes = await request.post(`/api/submit/${slug}`, {
      data: {
        data: {
          // Adjust field keys to match your seeded test form
          "Ad Soyad": "Playwright Test",
          "E-posta": "playwright@test.dev",
          Mesaj: "Automated e2e test submission",
        },
      },
    });
    expect(submitRes.status()).toBe(201);

    // Login and navigate to the form's detail page
    await loginUser(page);
    await page.goto("/dashboard");

    // Find the test form card and click into it
    await page.getByText(slug, { exact: false }).first().click();
    await expect(page).toHaveURL(/\/dashboard\/forms\//);

    // The submission we just made should appear
    await expect(page.getByText("Playwright Test")).toBeVisible({ timeout: 10_000 });
  });
});
