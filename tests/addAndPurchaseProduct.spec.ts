import { test, expect } from "../fixtures/testFixtures.ts";
import products from "../test-data/products.json";

let productTitle: string;

test.describe("Signin and complete a product purchase", async () => {
  test.beforeEach(async ({ signinPage }) => {
    await signinPage.goToSignInPage();
    await signinPage.createNewUser({});
  });

  test("Add product to cart", async ({ homePage }) => {
    await test.step("Verify that the cart is empty", async () => {
      expect(await homePage.getCartItemCount()).toBe(0);
    });

    await test.step("Add product to cart and verify cart state", async () => {
      await homePage.searchForSpecificProduct(products.mug_adventure_begins);
      await homePage.setProductQuantity();
      await homePage.addToCart();
      expect(await homePage.getCartItemCount()).toBe(1);
    });
  });

  test("Add multiple products to cart", async ({ homePage, cartPage }) => {
    await test.step("Verify that the cart is empty", async () => {
      expect(await homePage.getCartItemCount()).toBe(0);
    });

    await test.step("Add one product to cart and verify cart state", async () => {
      productTitle = await homePage.searchForSpecificProduct(
        "Mug The adventure begins"
      );
      await homePage.setProductQuantity(3);
      await homePage.addToCart();
      expect(await homePage.getCartItemCount()).toBe(3);
    });

    await test.step("Validate product titles", async () => {
      await cartPage.checkProductsTitleInCart(0, productTitle);
    });
  });

  test("Add two different products to cart and place order", async ({
    homePage,
  }) => {
    await test.step("Verify that the cart is empty", async () => {
      expect(await homePage.getCartItemCount()).toBe(0);
    });

    await test.step("Add first product to cart", async () => {
      await homePage.searchForSpecificProduct(products.sweater);
      await homePage.setProductQuantity();
      await homePage.addToCart(false);
    });

    await test.step("Add second product to cart", async () => {
      await homePage.searchForSpecificProduct(products.mug_adventure_begins);
      await homePage.setProductQuantity(2);
      await homePage.addToCart();
      await homePage.clickElement(homePage.proceedToCheckoutBtn());
    });

    await test.step("Verify cart state", async () => {
      expect(await homePage.getCartItemCount()).toBe(3);
    });
  });

  test("Place an order from the cart", async ({ homePage, cartPage, page }) => {
    await test.step("Add two products to the cart", async () => {
      await homePage.searchForSpecificProduct(products.sweater);
      await homePage.setProductQuantity(2);
      await homePage.addToCart();
      await homePage.clickElement(homePage.proceedToCheckoutBtn());
    });

    await test.step("Fill out requested fields and finish with purchase", async () => {
      await cartPage.fillCustomerInformation({});
      await cartPage.selectShippingMethod();
      await cartPage.selectPaymentMethod();
    });
  });

  test("Verify if 0 products can be added to the cart", async ({
    homePage,
  }) => {
    await test.step("Verify that the cart is empty", async () => {
      expect(await homePage.getCartItemCount()).toBe(0);
    });

    await test.step("Add 0 product to cart and verify cart state", async () => {
      await homePage.searchForSpecificProduct(products.sweater);
      await expect(homePage.addSelectedProductToCart()).toBeVisible();
      await homePage.setProductQuantity(0);
      await homePage.addToCart();
      expect(await homePage.getCartItemCount()).toBe(1);
    });
  });

  test("Update product quantity in shopping cart and complete purchase", async ({
    homePage,
    cartPage,
  }) => {
    await test.step("Verify that the cart is empty", async () => {
      expect(await homePage.getCartItemCount()).toBe(0);
    });

    await test.step("Add product and navigate to shopping cart", async () => {
      await homePage.searchForSpecificProduct(products.sweater);
      await homePage.setProductQuantity(2);
      await homePage.addToCart();
    });

    await test.step("Add product quantity in shopping cart", async () => {
      await expect(homePage.proceedToCheckoutBtn()).toBeVisible();
      expect(await cartPage.getTotalQuantity()).toBe(2);
      await cartPage.setProductQuantity(4);
      expect(await cartPage.getTotalQuantity()).toBe(4);
    });

    await test.step("Fill out requested fields and finish with purchase", async () => {
      await homePage.clickElement(homePage.proceedToCheckoutBtn());
      await cartPage.fillCustomerInformation({});
      await cartPage.selectShippingMethod();
      await cartPage.selectPaymentMethod();
    });
  });
});
