import { Page, expect } from "@playwright/test";
import { BasePage } from "./basePage.ts";
import products from "../test-data/products.json";

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // LOCATORS //

  public cart = () => this.iframe().locator('div:has-text("Cart")');
  protected cartStatus = () => this.cart().locator("span.cart-products-count");
  public productsSection = () =>
    this.iframe().locator('section:has(h2:has-text("Popular Products"))');
  protected allProducts = () =>
    this.productsSection().locator("div.products > div");
  protected product = (title?: string) =>
    this.iframe().locator(`img[alt="${title}"]`).first();
  protected productTitle = () => this.iframe().locator("h1.h1");
  protected productTitleText = () => this.productTitle().textContent();
  protected productPrice = (num: number) =>
    this.product().locator("span.price");
  public addSelectedProductToCart = () =>
    this.iframe().locator('button[data-button-action="add-to-cart"]');
  public proceedToCheckoutBtn = () =>
    this.iframe().locator('a:has-text("Proceed to checkout")');
  public backToHomeBtn = () =>
    this.iframe().getByRole("link", { name: "Home", exact: true });
  public continueShoppingBtn = () =>
    this.iframe().locator('button:has-text("Continue shopping")');
  public numOfProducts = () =>
    this.iframe().locator(".product-quantity").locator("strong").innerText();
  public searchField = () => this.iframe().locator('[aria-label="Search"]');
  protected searchResultItem = (productName: string) =>
    this.iframe().locator(`li.ui-menu-item a:has-text("${productName}")`);

  // METHODS //

  async getCartItemCount(): Promise<number> {
    const cartStateText = await this.cartStatus().innerText();
    const cartState = parseInt(cartStateText.replace(/[^\d]/g, ""), 10);
    return cartState;
  }

  async selectProduct(productName: string = products.mug_adventure_begins) {
    await this.clickElement(this.product(productName));
    const productTitle = await this.productTitleText();
    return productTitle ?? "";
  }

  async addToCart(proceedToCheckout: boolean = true) {
    await expect(this.addSelectedProductToCart()).toBeVisible();
    const responsePromise = this.getResponse({
      endpoint: "/en/cart",
    });

    await this.clickElement(this.addSelectedProductToCart());

    const response = await responsePromise;
    expect(response.status()).toBe(200);

    await this.clickElement(
      proceedToCheckout
        ? this.proceedToCheckoutBtn()
        : this.continueShoppingBtn()
    );
  }

  async searchForSpecificProduct(productName: string) {
    await this.inputText(this.searchField(), productName);
    await expect(this.searchResultItem(productName)).toBeVisible();
    await this.clickElement(this.searchResultItem(productName));
    await expect(this.productTitle()).toHaveText(productName);

    const productTitle = await this.productTitleText();
    return productTitle ?? "";
  }
}
