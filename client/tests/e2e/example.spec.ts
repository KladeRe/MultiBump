import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("http://localhost:7978");

  await expect(
    page.getByRole("heading", { name: "MultiBump", level: 1 })
  ).toBeVisible();
});
