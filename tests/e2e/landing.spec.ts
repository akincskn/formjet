import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("loads and shows hero content", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/FormJet/);
    await expect(page.getByRole("heading", { name: /build forms/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /start for free/i })).toBeVisible();
  });

  test("shows 3-step section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Build your form")).toBeVisible();
    await expect(page.getByText("Share anywhere")).toBeVisible();
    await expect(page.getByText("Get notified")).toBeVisible();
  });

  test("pricing section shows free plan", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("$0")).toBeVisible();
    await expect(page.getByText("5 forms")).toBeVisible();
  });

  test("CTA links point to register", async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("link", { name: /start for free/i }).first();
    await expect(link).toHaveAttribute("href", /register/);
  });

  test("nav has login and register links", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /sign in|log in/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /get started|register/i })).toBeVisible();
  });
});
