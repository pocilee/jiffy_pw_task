import { test as base, expect, Page } from "@playwright/test";
import { Browser, BrowserContext, chromium } from "playwright";
import { HomePage } from "../pages/homePage";
import { BasePage } from "../pages/basePage.ts";
import { SignInPage } from "../pages/signInPage.ts";
import { CartPage } from "../pages/cartPage.ts";

type Fixtures = {
  page: Page;
  homePage: HomePage;
  basePage: BasePage;
  signinPage: SignInPage;
  cartPage: CartPage;
};

export const test = base.extend<Fixtures>({
  page: [
    async ({}, use) => {
      const browser: Browser = await chromium.launch();
      const context: BrowserContext = await browser.newContext();
      const page: Page = await context.newPage();
      await use(page);
      await page.close();
      await context.close();
      await browser.close();
    },
    { scope: "test" },
  ],

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  basePage: async ({ page }, use) => {
    await use(new BasePage(page));
  },

  signinPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});

export { expect };
