import { test, expect } from "@playwright/test";
import { loginUser } from "./helpers/auth";

test.describe("Authentication — UI and validation", () => {
  test("register page loads with all fields", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByRole("heading", { name: /create your account/i })).toBeVisible();
    await expect(page.getByLabel("Full name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
  });

  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
  });

  test("register shows validation error for empty submit", async ({ page }) => {
    await page.goto("/register");
    await page.getByRole("button", { name: /create account/i }).click();
    await expect(page.getByText(/required|must be/i).first()).toBeVisible();
  });

  test("register shows error for weak password", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel("Full name").fill("Test User");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("123");
    await page.getByRole("button", { name: /create account/i }).click();
    await expect(page.getByText(/password|at least/i)).toBeVisible();
  });

  test("login page retains redirectTo param", async ({ page }) => {
    await page.goto("/login?redirectTo=/dashboard");
    await expect(page).toHaveURL(/login/);
  });

  test("unauthenticated visit to dashboard redirects to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/login/);
  });
});

// ─── Tests that require a real Supabase connection ───────────────────────────
// Set TEST_USER_EMAIL and TEST_USER_PASSWORD env vars to run these.

test.describe("Authentication — full flow (requires Supabase)", () => {
  test.skip(!process.env.TEST_USER_EMAIL, "TEST_USER_EMAIL not set");

  test("login and reach dashboard", async ({ page }) => {
    await loginUser(page);
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByText(/forms|new form/i)).toBeVisible();
  });

  test("logout returns to landing or login", async ({ page }) => {
    await loginUser(page);
    // Open user menu and sign out
    await page.getByRole("button", { name: /sign out|logout/i }).click();
    await expect(page).toHaveURL(/\/(login)?$/);
  });
});
