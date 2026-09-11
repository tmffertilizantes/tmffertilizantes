import { test, expect } from "@playwright/test";

/** Login não usa o storageState (testa o fluxo do zero). */
test.use({ storageState: { cookies: [], origins: [] } });

const EMAIL = process.env.QA_ADMIN_EMAIL || "qa-superadmin@tmf.test";
const PASSWORD = process.env.QA_ADMIN_PASSWORD || "test1234";

test("login válido redireciona para /analises", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(EMAIL);
  await page.getByLabel("Senha").fill(PASSWORD);
  await page.getByRole("button", { name: /Entrar/ }).click();
  await page.waitForURL(/\/analises/, { timeout: 15_000 });
  await expect(page).toHaveURL(/\/analises/);
});

test("senha errada mostra 'Login incorreto'", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(EMAIL);
  await page.getByLabel("Senha").fill("senhaerrada123");
  await page.getByRole("button", { name: /Entrar/ }).click();
  await expect(page.getByText("Login incorreto")).toBeVisible();
});
