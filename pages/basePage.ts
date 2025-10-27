import { Page, Locator, expect } from "@playwright/test";

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // LOCATORS //

  public iframe = () => this.page.frameLocator("#framelive");
  public emailInput = () => this.iframe().locator("#field-email");
  public passwordInput = () => this.iframe().locator("#field-password");
  public signInLink = () => this.iframe().locator("span:has-text('Sign in')");
  public cart = () => this.iframe().getByText("text=Cart");
  public createAccBtn = () =>
    this.iframe().locator("a:has-text('No account? Create one here')");
  public signInBtn = () => this.iframe().locator("#submit-login");
  public loadingMessage = () => this.page.locator("#loadingMessage");
  public changeDevices = () => this.page.locator("#devices");
  public mobileDevice = () => this.changeDevices().locator("a.mobile");
  public mobileUser = () =>
    this.iframe().locator("div#_mobile_user_info + div");
  public userIcon = () =>
    this.iframe().locator(
      'div.user-info a[title="Log in to your customer account"]'
    );
  public popularProductsTitle = () =>
    this.iframe().locator('h2:has-text("Popular Products")');
  public inputNumberOfProducts = () =>
    this.iframe().locator("#quantity_wanted");
  public insertQuantity = () =>
    this.iframe().locator('input[aria-label*="product quantity field"]');
  public total = () =>
    this.iframe().locator("div#cart-subtotal-products > span.label");
  public totalText = () => this.total().innerText();

  // METHODS //

  async inputText(locator: Locator, text: string) {
    await locator.fill(text);
  }

  async goToPage(url: string) {
    await this.page.goto(url);
    await this.loadingMessage().waitFor({ state: "hidden", timeout: 30000 });
  }

  async clickElement(locator: Locator) {
    await this.page.waitForTimeout(500);
    await locator.click();
  }

  getRandomNumber(max: number) {
    return Math.floor(Math.random() * max) + 1;
  }

  async getResponse({
    endpoint,
    statusCode = 200,
  }: {
    endpoint: string;
    statusCode?: number;
  }) {
    return this.page.waitForResponse(
      (response) =>
        response.url().includes(endpoint) && response.status() === statusCode
    );
  }

  getRandomCredentials() {
    return {
      email: `Test${this.getRandomNumber(1000)}@mail.com`,
      password: `Test@test${this.getRandomNumber(1000)}`,
    };
  }

  async setProductQuantity(numOfProducts = 1) {
    const quantityInput = this.inputNumberOfProducts().or(
      this.insertQuantity()
    );
    await quantityInput.clear();
    await this.inputText(quantityInput, numOfProducts.toString());
    if (await this.insertQuantity().isVisible()) {
      await this.page.keyboard.press("Enter");
      await this.total()
        .filter({ hasText: `${numOfProducts} item` })
        .waitFor();
    }
  }
}
