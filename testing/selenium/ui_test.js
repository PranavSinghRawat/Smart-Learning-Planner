/**
 * Selenium UI Tests — Smart Learning Planner
 * Tool: Selenium WebDriver (free, open source)
 * Run: node testing/selenium/ui_test.js
 * Prerequisites:
 *   npm install selenium-webdriver chromedriver
 *   Backend running on :5001, Frontend on :5173, ML service on :5002
 */

const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const BASE_URL = "http://localhost:5173";
const TEST_USERNAME = `selenium_${Date.now()}`;
const TEST_EMAIL = `selenium_${Date.now()}@slp.com`;
const TEST_PASSWORD = "password123";
const TIMEOUT = 12000;

let passed = 0;
let failed = 0;

function log(status, testName, detail = "") {
  const icon = status === "PASS" ? "✅" : "❌";
  console.log(`${icon} [${status}] ${testName}${detail ? " — " + detail : ""}`);
  if (status === "PASS") passed++;
  else failed++;
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function runTests() {
  const options = new chrome.Options();
  // options.addArguments("--headless=new"); // uncomment for headless
  options.addArguments("--window-size=1280,800");

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    // ── TC-UI-001: Landing page loads ─────────────────────────────────────
    await driver.get(BASE_URL);
    await sleep(1500);
    try {
      await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(),'Smart Learning Planner')]")),
        TIMEOUT
      );
      log("PASS", "TC-UI-001: Landing page loads");
    } catch (e) {
      log("FAIL", "TC-UI-001: Landing page loads", e.message);
    }

    // ── TC-UI-002: Get Started Free navigates to Auth page ────────────────
    try {
      const btn = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(text(),'Get Started')]")),
        TIMEOUT
      );
      await btn.click();
      await sleep(1000);
      await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(),'Welcome back') or contains(text(),'Create account')]")),
        TIMEOUT
      );
      log("PASS", "TC-UI-002: Get Started navigates to Auth page");
    } catch (e) {
      log("FAIL", "TC-UI-002: Get Started button", e.message);
    }

    // ── TC-UI-003: Register a new user ────────────────────────────────────
    try {
      // Click Register tab
      const registerTab = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(text(),'Register')]")),
        TIMEOUT
      );
      await registerTab.click();
      await sleep(600);

      await driver.findElement(By.css("input[placeholder*='username' i]")).sendKeys(TEST_USERNAME);
      await driver.findElement(By.css("input[type='email']")).sendKeys(TEST_EMAIL);

      const passFields = await driver.findElements(By.css("input[type='password']"));
      await passFields[0].sendKeys(TEST_PASSWORD);
      await passFields[1].sendKeys(TEST_PASSWORD);

      await driver.findElement(By.xpath("//button[contains(text(),'Create Account')]")).click();
      await sleep(3000);

      // After register, should be on Study Planner (navbar visible)
      await driver.wait(
        until.elementLocated(By.xpath("//button[contains(text(),'Study Planner')]")),
        TIMEOUT
      );
      log("PASS", "TC-UI-003: User registration successful");
    } catch (e) {
      log("FAIL", "TC-UI-003: User registration", e.message);
    }

    // ── TC-UI-004: Study Planner tab is active by default ─────────────────
    try {
      await driver.wait(
        until.elementLocated(By.css("input[placeholder*='learn' i]")),
        TIMEOUT
      );
      log("PASS", "TC-UI-004: Study Planner tab active after login");
    } catch (e) {
      log("FAIL", "TC-UI-004: Study Planner tab", e.message);
    }

    // ── TC-UI-005: Generate a study plan ──────────────────────────────────
    try {
      const subjectInput = await driver.wait(
        until.elementLocated(By.css("input[placeholder*='learn' i]")),
        TIMEOUT
      );
      await subjectInput.clear();
      await subjectInput.sendKeys("DSA");

      await driver.findElement(By.xpath("//button[contains(text(),'Generate')]")).click();
      await sleep(4000);

      await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(),'Day 1')]")),
        TIMEOUT
      );
      log("PASS", "TC-UI-005: Study plan generated for DSA");
    } catch (e) {
      log("FAIL", "TC-UI-005: Generate study plan", e.message);
    }

    // ── TC-UI-006: Smart Plan tab shows empty state ───────────────────────
    try {
      await driver.findElement(By.xpath("//button[contains(text(),'Smart Plan')]")).click();
      await sleep(1000);
      await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(),'No day selected')]")),
        TIMEOUT
      );
      log("PASS", "TC-UI-006: Smart Plan tab shows empty state");
    } catch (e) {
      log("FAIL", "TC-UI-006: Smart Plan tab", e.message);
    }

    // ── TC-UI-007: AI Predictor tab loads LSTM predictor ─────────────────
    try {
      await driver.findElement(By.xpath("//button[contains(text(),'AI Predictor')]")).click();
      await sleep(1000);
      await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(),'LSTM')]")),
        TIMEOUT
      );
      log("PASS", "TC-UI-007: AI Predictor tab loads LSTM predictor");
    } catch (e) {
      log("FAIL", "TC-UI-007: AI Predictor tab", e.message);
    }

    // ── TC-UI-008: Logout clears session and returns to landing ───────────
    try {
      await driver.findElement(By.xpath("//button[contains(text(),'Logout')]")).click();
      await sleep(1500);
      await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(),'Smart Learning Planner')]")),
        TIMEOUT
      );
      log("PASS", "TC-UI-008: Logout returns to landing page");
    } catch (e) {
      log("FAIL", "TC-UI-008: Logout", e.message);
    }

    // ── TC-UI-009: Login with wrong password shows error ──────────────────
    try {
      // Navigate back to auth
      const getStarted = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(text(),'Get Started') or contains(text(),'Login')]")),
        TIMEOUT
      );
      await getStarted.click();
      await sleep(1000);

      const usernameInput = await driver.wait(
        until.elementLocated(By.css("input[placeholder*='username' i]")),
        TIMEOUT
      );
      await usernameInput.sendKeys(TEST_USERNAME);
      await driver.findElement(By.css("input[type='password']")).sendKeys("wrongpassword");
      await driver.findElement(By.xpath("//button[contains(text(),'Sign In')]")).click();
      await sleep(2000);

      await driver.wait(
        until.elementLocated(By.css(".MuiAlert-root")),
        TIMEOUT
      );
      log("PASS", "TC-UI-009: Wrong password shows error alert");
    } catch (e) {
      log("FAIL", "TC-UI-009: Wrong password error", e.message);
    }

  } finally {
    await driver.quit();

    console.log("\n" + "─".repeat(50));
    console.log("Selenium UI Test Results");
    console.log("─".repeat(50));
    console.log(`Total:     ${passed + failed}`);
    console.log(`Passed:    ${passed}`);
    console.log(`Failed:    ${failed}`);
    console.log(`Pass Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
    console.log("─".repeat(50));
  }
}

runTests().catch((err) => {
  console.error("Fatal error in test runner:", err);
  process.exit(1);
});
