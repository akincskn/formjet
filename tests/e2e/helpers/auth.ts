import { type Page } from "@playwright/test";

// Credentials come from env — set TEST_USER_EMAIL / TEST_USER_PASSWORD
// in .env.test or export them before running tests.
export const TEST_EMAIL = process.env.TEST_USER_EMAIL ?? "test@formjet.dev";
export const TEST_PASSWORD = process.env.TEST_USER_PASSWORD ?? "TestPassword123!";

export async function loginUser(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(TEST_EMAIL);
  await page.getByLabel("Password").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  // Wait for dashboard redirect
  await page.waitForURL(/\/dashboard/, { timeout: 10_000 });
}
