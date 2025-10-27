import { Page, expect } from "@playwright/test";
import { BasePage } from "./basePage.ts";
import user_data from "../test-data/user_data.json";

export class SignInPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // LOCATORS //

  protected genderMale = () => this.iframe().locator("#field-id_gender-1");
  protected genderFemale = () => this.iframe().locator("#field-id_gender-2");
  protected firstNameInput = () => this.iframe().locator("#field-firstname");
  protected lastNameInput = () => this.iframe().locator("#field-lastname");
  protected termsAgree = () =>
    this.iframe().locator(
      'span:has-text("I agree to the terms and conditions and the privacy policy")'
    );
  protected customerDataPrivacy = () =>
    this.iframe().locator('input[name="customer_privacy"]');
  protected submitBtn = () => this.iframe().locator('button:has-text("Save")');

  // METHODS //

  async createNewUser(
    options: {
      gender?: "male" | "female";
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
    } = {}
  ) {
    const user = {
      gender: "male" as const,
      ...this.getRandomCredentials(),
      ...options,
    };
    await this.clickElement(
      user.gender === "female" ? this.genderFemale() : this.genderMale()
    );
    await this.inputText(this.firstNameInput(), user_data.firstName);
    await this.inputText(this.lastNameInput(), user_data.lastName);
    await this.inputText(this.emailInput(), user.email);
    await this.inputText(this.passwordInput(), user.password);
    await this.clickElement(this.termsAgree());
    await this.clickElement(this.customerDataPrivacy());
    const responsePromise = this.getResponse({
      endpoint: "/en/registration",
      statusCode: 302,
    });
    await this.clickElement(this.submitBtn());
    const response = await responsePromise;
    expect(response.status()).toBe(302);
    await expect(this.popularProductsTitle()).toBeVisible();
  }

  async goToSignInPage() {
    await this.goToPage("/");
    const mobileVisible = await this.mobileUser().isVisible();
    await this.clickElement(
      mobileVisible ? this.userIcon() : this.signInLink()
    );
    await expect(this.userIcon()).toBeVisible();
    await this.clickElement(this.createAccBtn());
  }
}
