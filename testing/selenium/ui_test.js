/**
 * Selenium UI Tests — Smart Learning Planner
 * Tool: Selenium WebDriver (free, open source)
 * Run: node testing/selenium/ui_test.js
 * Prerequisites:
 *   npm install selenium-webdriver chromedriver
 *   Frontend running on :5173, Backend on :5001
 */

const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const BASE_URL    = "http://localhost:5173";
const USERNAME    = "pranavrawat0514@gmail.com"; // login via email
const PASSWORD    = "kalukali0410";
const TIMEOUT     = 15000;

let passed = 0;
let failed = 0;

function log(status, testName, detail = "") {
  const icon = status === "PASS" ? "✅" : "❌";
  console.log(`${icon} [${status}] ${testName}${detail ? " — " + detail : ""}`);
  if (status === "PASS") passed++;
  else failed++;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function runTests() {
  const options = new chrome.Options();
  // options.addArguments("--headless=new"); // uncomment for headless
  options.addArguments("--window-size=1280,800");
  options.addArguments("--disable-notifications");

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    // ── TC-UI-001: Landing page loads ─────────────────────────────────────
    await driver.get(BASE_URL);
    await sleep(2000);
    try {
      await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(),'Smart Learning Planner')]")),
        TIMEOUT
      );
      log("PASS", "TC-UI-001: Landing page loads");
    } catch (e) {
      log("FAIL", "TC-UI-001: Landing page loads", e.message);
    }

    // ── TC-UI-002: Get Started navigates to Auth page ─────────────────────
    try {
      const btn = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(text(),'Get Started')]")),
        TIMEOUT
      );
      await btn.click();
      await sleep(1500);
      await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(),'Welcome back')]")),
        TIMEOUT
      );
      log("PASS", "TC-UI-002: Get Started navigates to Auth page");
    } catch (e) {
      log("FAIL", "TC-UI-002: Get Started navigates to Auth page", e.message);
    }

    // ── TC-UI-003: Login with valid credentials ───────────────────────────
    try {
      const usernameInput = await driver.wait(
        until.elementLocated(By.css("input[placeholder*='username' i]")),
        TIMEOUT
      );
      await usernameInput.clear();
      await usernameInput.sendKeys(USERNAME);

      const passwordInput = await driver.findElement(By.css("input[type='password']"));
      await passwordInput.clear();
      await passwordInput.sendKeys(PASSWORD);

      await driver.findElement(By.xpath("//button[contains(text(),'Sign In')]")).click();
      await sleep(3000);

      await driver.wait(
        until.elementLocated(By.xpath("//button[contains(text(),'Study Planner')]")),
        TIMEOUT
      );
      log("PASS", "TC-UI-003: Login with valid credentials");
    } catch (e) {
      log("FAIL", "TC-UI-003: Login with valid credentials", e.message);
    }

    // ── TC-UI-004: Study Planner tab is active by default ─────────────────
    try {
      await driver.wait(
        until.elementLocated(By.css("input[placeholder*='Patterns' i]")),
        TIMEOUT
      );
      log("PASS", "TC-UI-004: Study Planner tab active after login");
    } catch (e) {
      log("FAIL", "TC-UI-004: Study Planner tab active after login", e.message);
    }

    // ── TC-UI-005: Generate a study plan ──────────────────────────────────
    try {
      const subjectInput = await driver.wait(
        until.elementLocated(By.css("input[placeholder*='Patterns' i]")),
        TIMEOUT
      );
      await subjectInput.clear();
      await subjectInput.sendKeys("DSA");

      await driver.findElement(By.xpath("//button[contains(normalize-space(),'Start Sprint')]")).click();
      await sleep(5000);

      await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(),'Day 1')]")),
        TIMEOUT
      );
      log("PASS", "TC-UI-005: Study plan generated for DSA");
    } catch (e) {
      log("FAIL", "TC-UI-005: Study plan generated for DSA", e.message);
    }

    // ── TC-UI-006: Smart Plan tab shows empty state ───────────────────────
    try {
      await driver.findElement(By.xpath("//button[contains(text(),'Smart Plan')]")).click();
      await sleep(1500);
      await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(),'No day selected')]")),
        TIMEOUT
      );
      log("PASS", "TC-UI-006: Smart Plan tab shows empty state");
    } catch (e) {
      log("FAIL", "TC-UI-006: Smart Plan tab shows empty state", e.message);
    }

    // ── TC-UI-007: AI Predictor tab loads LSTM predictor ─────────────────
    try {
      await driver.findElement(By.xpath("//button[contains(text(),'AI Predictor')]")).click();
      await sleep(1500);
      await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(),'LSTM')]")),
        TIMEOUT
      );
      log("PASS", "TC-UI-007: AI Predictor tab loads LSTM predictor");
    } catch (e) {
      log("FAIL", "TC-UI-007: AI Predictor tab loads LSTM predictor", e.message);
    }

    // ── TC-UI-008: Logout clears session and returns to landing ───────────
    try {
      await driver.findElement(By.xpath("//button[contains(text(),'Logout')]")).click();
      await sleep(2000);
      await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(),'Smart Learning Planner')]")),
        TIMEOUT
      );
      log("PASS", "TC-UI-008: Logout returns to landing page");
    } catch (e) {
      log("FAIL", "TC-UI-008: Logout returns to landing page", e.message);
    }

    // ── TC-UI-009: Login with wrong password shows error ──────────────────
    try {
      const getStarted = await driver.wait(
        until.elementLocated(By.xpath("//button[contains(text(),'Get Started') or contains(text(),'Login')]")),
        TIMEOUT
      );
      await getStarted.click();
      await sleep(1500);

      const usernameInput = await driver.wait(
        until.elementLocated(By.css("input[placeholder*='username' i]")),
        TIMEOUT
      );
      await usernameInput.sendKeys(USERNAME);
      await driver.findElement(By.css("input[type='password']")).sendKeys("wrongpassword");
      await driver.findElement(By.xpath("//button[contains(text(),'Sign In')]")).click();
      await sleep(2500);

      await driver.wait(
        until.elementLocated(By.css(".MuiAlert-root")),
        TIMEOUT
      );
      log("PASS", "TC-UI-009: Wrong password shows error alert");
    } catch (e) {
      log("FAIL", "TC-UI-009: Wrong password shows error alert", e.message);
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
