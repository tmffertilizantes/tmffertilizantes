import { test as setup, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const API_URL = process.env.API_URL || "http://127.0.0.1:3001/api/v1";
const BASE_URL = process.env.CMS_BASE_URL || "http://127.0.0.1:3100";
const AUTH_FILE = path.resolve(__dirname, ".auth/admin.json");

const EMAIL = process.env.QA_ADMIN_EMAIL || "qa-superadmin@tmf.test";
const PASSWORD = process.env.QA_ADMIN_PASSWORD || "test1234";

/**
 * Autentica via API e grava os MESMOS cookies que pages/login.tsx grava
 * (USER_TOKEN + user), para o painel abrir já logado.
 */
setup("authenticate", async ({ request }) => {
  const res = await request.post(`${API_URL}/auth/login`, {
    data: { email: EMAIL, password: PASSWORD },
  });
  expect(res.ok(), `login falhou (${res.status()})`).toBeTruthy();
  const body = await res.json();
  expect(body.token).toBeTruthy();
  expect([1, 2]).toContain(body.user.roleId);

  const url = new URL(BASE_URL);
  const cookies = [
    { name: "USER_TOKEN", value: body.token, domain: url.hostname, path: "/", httpOnly: false, secure: false, sameSite: "Lax" as const, expires: -1 },
    { name: "user", value: JSON.stringify(body.user), domain: url.hostname, path: "/", httpOnly: false, secure: false, sameSite: "Lax" as const, expires: -1 },
  ];

  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
  fs.writeFileSync(AUTH_FILE, JSON.stringify({ cookies, origins: [] }, null, 2));
});
