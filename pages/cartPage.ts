import { Page, expect } from "@playwright/test";
import { BasePage } from "./basePage.ts";
import { HomePage } from "./homePage.ts";
import user_data from "../test-data/user_data.json";

export class CartPage extends BasePage {
  homePage: HomePage;
  constructor(page: Page) {
    super(page);
    this.homePage = new HomePage(page);
  }

  // LOCATORS //

  protected shopingCartTitle = () =>
    this.iframe().locator('h1:has-text("Shopping Cart")');
  protected numberOfItems = () =>
    this.iframe().locator("#cart-subtotal-products span").textContent();
  protected listOfAddedItems = () => this.iframe().locator("ul.cart-items li");
  protected itemInCart = (num: number) =>
    this.iframe().locator("ul.cart-items li").nth(num);
  protected itemInCartTitle = (num: number) =>
    this.itemInCart(num).locator("a.label").textContent();
  protected odrerConfirmed = () =>
    this.iframe().locator('h3:has-text("Your order is confirmed")');
  protected adressInput = () => this.iframe().locator("#field-address1");
  protected postalCodeInput = () => this.iframe().locator("#field-postcode");
  protected cityInput = () => this.iframe().locator("#field-city");
  protected countrySelect = () => this.iframe().locator("#field-id_country");
  protected countryFrance = () =>
    this.countrySelect().selectOption({ label: "France" });
  protected continueBtn = () =>
    this.iframe().getByRole("button", { name: "Continue" });
  protected clickAndCollect = () =>
    this.iframe().locator("input[id='delivery_option_1']");
  protected payByCashOnDelivery = () =>
    this.iframe().locator("#payment-option-2");
  protected agreeToTerms = () =>
    this.iframe().locator('input[type="checkbox"]');
  protected placeOrderBtn = () =>
    this.iframe().locator('button:has-text("Place order")');
  protected myAdressInfo = () =>
    this.iframe().locator('header:has(h4:has-text("MyAdress"))');
  protected shippingContent = () =>
    this.iframe().locator(
      "'div.delivery-option:has(#delivery_option_1) + div.carrier-extra-content'"
    );
  protected paymentMessage = () =>
    this.iframe().locator(
      'p:has-text("You pay for the merchandise upon delivery")'
    );
  public totalText = () =>
    this.iframe()
      .locator("div#cart-subtotal-products > span.label")
      .innerText();
  protected shippingMethodSector = () =>
    this.iframe().locator("h1", {
      hasText: "Shipping Method",
      has: this.page.locator("i.done"),
    });

  // METHODS //

  async checkProductsTitleInCart(num: number, text: string) {
    expect(await this.itemInCartTitle(num)).toBe(text);
  }

  async fillCustomerInformation({
    adress = user_data.adress,
    zipCode = user_data.zipCode,
    city = user_data.city,
  }: {
    adress?: string;
    zipCode?: string;
    city?: string;
  }) {
    if (!(await this.myAdressInfo().isVisible())) {
      await this.inputText(this.adressInput(), adress);
      await this.inputText(this.postalCodeInput(), zipCode);
      await this.inputText(this.cityInput(), city);
      await this.countryFrance();
    }
    const responsePromise = this.getResponse({
      endpoint: "/en/order",
    });
    await this.clickElement(this.continueBtn());
    const response = await responsePromise;
    expect(response.status()).toBe(200);
  }

  async selectShippingMethod() {
    await this.shippingMethodSector().waitFor({ state: "visible" });
    const responsePromise = this.getResponse({
      endpoint: "/en/order",
    });
    await this.page.waitForTimeout(1000);
    if (await this.shippingContent().isVisible())
      await this.clickElement(this.clickAndCollect());
    await this.clickElement(this.continueBtn());
    const response = await responsePromise;
    expect(response.status()).toBe(200);
  }

  async selectPaymentMethod() {
    await this.clickElement(this.payByCashOnDelivery());
    await expect(this.paymentMessage()).toBeVisible();
    await this.clickElement(this.agreeToTerms());
    const responsePromise = this.getResponse({
      endpoint: "/en/order-confirmation",
    });
    await this.clickElement(this.placeOrderBtn());
    await expect(this.odrerConfirmed()).toBeVisible();
    const response = await responsePromise;
    expect(response.status()).toBe(200);
  }

  async getTotalQuantity() {
    const totalText = await this.totalText();
    const total = parseInt(totalText.match(/\d+/)?.[0] || "0");
    return total;
  }
}
