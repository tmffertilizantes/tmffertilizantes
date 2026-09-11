import { defineConfig, devices } from "@playwright/test";

/**
 * E2E do painel administrativo contra a API de teste (tmf-api + MySQL do dump).
 * Pré-requisitos (o tests/run-all.sh cuida disso):
 *   - MySQL de teste no ar (docker-compose.test.yml) + tests/db/reset.sh aplicado
 *   - tmf-api rodando em TEST_API_BASE_URL (default http://127.0.0.1:3001/api/v1)
 */
const API_URL = process.env.API_URL || "http://127.0.0.1:3001/api/v1";
const PORT = Number(process.env.CMS_PORT || 3100);
const BASE_URL = process.env.CMS_BASE_URL || `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "setup", testMatch: /global\.setup\.ts/ },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], storageState: "tests/e2e/.auth/admin.json" },
      dependencies: ["setup"],
    },
  ],
  webServer: {
    command: `npx next dev -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { API_URL, NODE_ENV: "development" },
  },
});
