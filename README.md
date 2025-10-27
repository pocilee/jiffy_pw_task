# Setting Up Your Environment

## Step 1: Create Your .env File

To configure environment-specific variables, first create your own `.env` file by copying the provided template:

```bash
cp .env.template .env
```

This will create a new `.env` file that you can safely edit without modifying the original template.

## Step 2: Configure Your Credentials

Open the newly created `.env` file in your editor. Replace all placeholder values with your actual credentials and base URL.

**Example:**

````bash
# Base URL of the site under test
BASE_URL=https://your-website.com


⚠️ **Never commit your `.env` file** — it is ignored via `.gitignore`.

---

# Running the Tests

After setting up the environment variables, you can run the tests using the following commands.

## 1. Install Dependencies

```bash
npm install
````

## 2. Run All Tests

```bash
npx playwright test
```

## 3. Run Tests with UI (headed mode)

```bash
npx playwright test --headed
```

## 4. Open HTML Test Report

After running tests:

```bash
npx playwright show-report
```

### Example

To run a specific test file:

```bash
npx playwright test tests/addAndPurchaseProduct.spec.ts
```

---

# 🧪 Running Tests by Device / Browser

By default, tests run in Desktop Chrome. If you want to run tests on other browsers or mobile devices, use the `--project` flag as shown below.

Runs all tests in headless mode.

```bash
npx playwright test
```

To run with browser UI (headed mode):

```bash
npx playwright test --headed
```

## Mobile Chrome (Pixel 5)

Emulates Google Chrome on a Pixel 5 device.

```bash
npx playwright test --project="Mobile Chrome"
```

## Mobile Safari (iPhone 14)

Emulates Safari on an iPhone 14.

```bash
npx playwright test --project="Mobile Safari"
```

## Desktop Chrome

Runs tests in the Chrome browser.

```bash
npx playwright test --project="chromium"
```

## Desktop Safari

Runs tests using WebKit engine (Safari equivalent on macOS).

```bash
npx playwright test --project="webkit"
```

## Desktop Firefox

Runs tests in the Firefox browser.

```bash
npx playwright test --project="firefox"
```

---

# View Test Report

After running tests, open the report:

```bash
npx playwright show-report
```
