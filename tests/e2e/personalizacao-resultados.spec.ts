import { test, expect, Page } from "@playwright/test";

/**
 * Golden-master da tela de Personalização de Resultados (base da feature 003).
 * A lógica de reordenação/ocultação em si está travada nos testes de API
 * (result-section-order.spec.ts) e de unidade (getOrderedSections.spec.ts);
 * aqui o foco é: a tela renderiza e conversa com a API (salva/recarrega).
 * Restaura o padrão no fim para não sujar o banco.
 */
const TABS = [
  "Manutenção e Nutrição de Plantas",
  "Fertilidade e Construção de Perfil de Solo",
  "Investimento TMF x Concorrente",
  "Custo de Produção",
];

async function openTab(page: Page, title: string) {
  await page.getByRole("tab", { name: title }).click();
  await expect(page.locator(".tab-pane.active .list-group-item").first()).toBeVisible();
}

async function sectionLabels(page: Page): Promise<string[]> {
  return page
    .locator(".tab-pane.active .list-group-item")
    .evaluateAll((els) => els.map((e) => e.querySelector("span")?.textContent?.trim() || ""));
}

async function saveAndWait(page: Page) {
  await page.locator(".tab-pane.active").getByRole("button", { name: "Salvar" }).click();
  await expect(
    page.locator(".tab-pane.active").getByRole("button", { name: /Salvando/ })
  ).toHaveCount(0);
}

test.describe("personalizacao-resultados", () => {
  test.afterEach(async ({ page }) => {
    await page.goto("/personalizacao-resultados", { waitUntil: "networkidle" });
    for (const title of TABS) {
      await page.getByRole("tab", { name: title }).click();
      const restore = page.locator(".tab-pane.active").getByRole("button", { name: "Restaurar padrão" });
      if (await restore.isEnabled().catch(() => false)) {
        await restore.click();
        await expect(
          page.locator(".tab-pane.active").getByRole("button", { name: /Salvando/ })
        ).toHaveCount(0);
      }
    }
  });

  test("as 4 abas existem e listam suas seções", async ({ page }) => {
    await page.goto("/personalizacao-resultados", { waitUntil: "networkidle" });
    for (const title of TABS) {
      await expect(page.getByRole("tab", { name: title })).toBeVisible();
    }
    await openTab(page, TABS[1]);
    expect((await sectionLabels(page)).length).toBeGreaterThan(2);
  });

  test("ocultar seção via switch persiste após reload", async ({ page }) => {
    await page.goto("/personalizacao-resultados", { waitUntil: "networkidle" });
    await openTab(page, TABS[0]); // nutrition

    const firstItem = page.locator(".tab-pane.active .list-group-item").first();
    const toggle = firstItem.locator("input.form-check-input"); // react-bootstrap switch = checkbox
    await expect(toggle).toBeChecked();
    await toggle.uncheck();
    await expect(firstItem).toContainText("Oculta");

    await saveAndWait(page);
    await page.reload({ waitUntil: "networkidle" });
    await openTab(page, TABS[0]);

    await expect(
      page.locator(".tab-pane.active .list-group-item").first().locator("input.form-check-input")
    ).not.toBeChecked();
  });

  test("Salvar envia a ordem à API e recarrega igual (round-trip)", async ({ page }) => {
    // A reordenação em si (drag) é golden-master em result-section-order.spec.ts (API)
    // e getOrderedSections.spec.ts (unidade). Aqui garantimos que a tela persiste
    // e relê o que a API guardou.
    await page.goto("/personalizacao-resultados", { waitUntil: "networkidle" });
    await openTab(page, TABS[1]); // fertility

    const before = await sectionLabels(page);
    expect(before.length).toBeGreaterThan(2);

    await saveAndWait(page);
    await page.reload({ waitUntil: "networkidle" });
    await openTab(page, TABS[1]);

    expect(await sectionLabels(page)).toEqual(before);
  });

  test("Restaurar padrão volta a ordem/visibilidade default", async ({ page }) => {
    await page.goto("/personalizacao-resultados", { waitUntil: "networkidle" });
    await openTab(page, TABS[0]); // nutrition

    // esconde a 1ª seção e salva
    const firstToggle = page.locator(".tab-pane.active .list-group-item").first().locator("input.form-check-input");
    await firstToggle.uncheck();
    await saveAndWait(page);

    // restaura
    await page.locator(".tab-pane.active").getByRole("button", { name: "Restaurar padrão" }).click();
    await expect(
      page.locator(".tab-pane.active").getByRole("button", { name: /Salvando/ })
    ).toHaveCount(0);
    await page.reload({ waitUntil: "networkidle" });
    await openTab(page, TABS[0]);

    // todas as seções voltam a "Exibida"
    const checks = page.locator(".tab-pane.active .list-group-item input.form-check-input");
    const n = await checks.count();
    for (let i = 0; i < n; i++) await expect(checks.nth(i)).toBeChecked();
  });
});
