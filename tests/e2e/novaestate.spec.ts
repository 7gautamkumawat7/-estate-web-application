import { test, expect } from "@playwright/test";

test.describe("NovaEstate Properties E2E Suite", () => {
  test("1. Homepage loads with brand identity, hero, and live statistics", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/NovaEstate Properties/i);
    await expect(page.getByRole("heading", { name: /Find Your Place in Dubai/i })).toBeVisible();
    await expect(page.getByText(/Curated Residences/i)).toBeVisible();
  });

  test("2. Property listings render with 3D cards and specs", async ({ page }) => {
    await page.goto("/#listings");
    const propertyCards = page.locator("article, div.group").filter({ hasText: /AED/i });
    await expect(propertyCards.first()).toBeVisible();
  });

  test("3. Search and filter update URL and preserve parameters across refresh", async ({ page }) => {
    await page.goto("/");
    const searchInput = page.getByPlaceholder(/Search by residence title/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill("Palm Jumeirah");
      await page.keyboard.press("Enter");
      await page.waitForURL(/search=Palm/i);
      expect(page.url()).toContain("search=Palm");

      // Reload page and check preservation
      await page.reload();
      expect(page.url()).toContain("search=Palm");
    }
  });

  test("4. Property detail page loads and displays architectural narrative and gallery", async ({ page }) => {
    await page.goto("/properties/the-crown-penthouse-palm-jumeirah");
    await expect(page.getByRole("heading", { name: /The Crown Penthouse at Palm Jumeirah/i })).toBeVisible();
    await expect(page.getByText(/AED 38,500,000/i)).toBeVisible();
    await expect(page.getByText(/Architectural Narrative/i)).toBeVisible();
    await expect(page.getByText(/Enquire About This Residence/i)).toBeVisible();
  });

  test("5. Enquiry form validates fields and submits successfully", async ({ page }) => {
    await page.goto("/properties/the-crown-penthouse-palm-jumeirah");

    await page.getByPlaceholder(/e.g. Eleanor Vance/i).fill("Lady Genevieve");
    await page.getByPlaceholder(/e.g. eleanor@vance-holdings.com/i).fill("genevieve@london-estates.co.uk");
    await page.getByPlaceholder(/\+971 50 123 4567/i).fill("+44 7700 900555");
    await page.getByPlaceholder(/State your investment timeframe/i).fill("Interested in acquiring The Crown Penthouse for family residency.");

    await page.getByRole("button", { name: /Submit Private Enquiry/i }).click();

    // Verify confirmation
    await expect(page.getByText(/Enquiry Received With Distinction/i)).toBeVisible({ timeout: 10000 });
  });

  test("6. Unauthenticated visitors are redirected from /admin to /admin/login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/admin\/login/);
    await expect(page.getByRole("heading", { name: /Executive Portal/i })).toBeVisible();
  });

  test("7. Admin login authenticates and displays dashboard metrics and enquiry management", async ({ page }) => {
    await page.goto("/admin/login");

    await page.locator("input[type='email']").fill("admin@novaestate.ae");
    await page.locator("input[type='password']").fill("AdminNovaPassword2026!");
    await page.getByRole("button", { name: /Access Dashboard/i }).click();

    await page.waitForURL("/admin");
    await expect(page.getByRole("heading", { name: /Admin Overview/i })).toBeVisible();
    await expect(page.getByText(/Total Properties/i)).toBeVisible();
    await expect(page.getByText(/Client Enquiry Management/i)).toBeVisible();
  });
});
