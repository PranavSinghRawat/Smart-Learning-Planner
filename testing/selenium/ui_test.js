/**
 * Selenium UI Tests — Smart Learning Planner
 * Tool: Selenium WebDriver (free, open source)
 * Run: node testing/selenium/ui_test.js
 * Prerequisites:
 *   npm install selenium-webdriver chromedriver
 *   Backend running on :5001, Frontend on :5173
 */

const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const BASE_URL = "http://localhost:5173";
const TEST_USERNAME = `selenium_${Date.now()}`;
const TEST_EMAIL = `selenium_${Date.now()}@slp.com`;
const TEST_PASSWORD = "password123";
const TIMEOUT = 10000;

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
    // TC-UI-001: Landing page loads
    await driver.get(BASE_URL);
    await sleep(1000);
    try {
      await driver.findElement(By.xpath("//*[contains(text(),'Smart Learning Planner')]"));
      log("PASS", "TC-UI-001: Landing page loads");
    } catch (e) {
      log("FAIL", "TC-UI-001: Landing page loads", e.message);
    }

    // TC-UI-002: Get Started navigates to Auth page
    try {
      const btn = await driver.findElement(By.xpath("//button[contains(text(),'Get Started')]"));
      await btn.click();
      await sleep(800);
      await driver.findElement(By.xpath("//*[contains(text(),'Login') or contains(text(),'Register')]"));
      log("PASS", "TC-UI-002: Get Started navigates to Auth page");
    } catch (e) {
      log("FAIL", "TC-UI-002: Get Started button", e.message);
    }

    // TC-UI-003: Register a new user
    try {
      const registerTab = await driver.findElement(By.xpath("//*[contains(text(),'Register')]"));
      await registerTab.click();
      await sleep(500);

      await driver.findElement(By.css("input[placeholder*='username' i]")).sendKeys(TEST_USERNAME);
      await driver.findElement(By.css("input[type='email']")).sendKeys(TEST_EMAIL);

      const passFields = await driver.findElements(By.css("input[type='password']"));
      await passFields[0].sendKeys(TEST_PASSWORD);
      await passFields[1].sendKeys(TEST_PASSWORD);

      await driver.findElement(By.xpath("//button[contains(text(),'Create Account')]")).click();
      await sleep(2000);

      await driver.findElement(By.xpath("//*[contains(text(),'Study Planner')]"));
      log("PASS", "TC-UI-003: User registration successful");
    } catch (e) {
      log("FAIL", "TC-UI-003: User registration", e.message);
    }

    // TC-UI-004: Study Planner tab is active by default
    try {
      await driver.findElement(By.css("input[placeholder*='learn' i]"));
      log("PASS", "TC-UI-004: Study Planner tab active after login");
    } catch (e) {
      log("FAIL", "TC-UI-004: Study Planner tab", e.message);
    }

    // TC-UI-005: Generate a study plan
    try {
      const subjectInput = await driver.findElement(By.css("input[placeholder*='learn' i]"));
      await subjectInput.clear();
      await subjectInput.sendKeys("DSA");

      await driver.findElement(By.xpath("//button[contains(text(),'Generate')]")).click();
      await sleep(3000);

      await driver.findElement(By.xpath("//*[contains(text(),'Day 1')]"));
      log("PASS", "TC-UI-005: Study plan generated for DSA");
    } catch (e) {
      log("FAIL", "TC-UI-005: Generate study plan", e.message);
    }

    // TC-UI-006: Smart Plan tab navigates correctly
    try {
      await driver.findElement(By.xpath("//button[contains(text(),'Smart Plan')]")).click();
      await sleep(800);
      await driver.findElement(By.xpath("//*[contains(text(),'No day selected')]"));
      log("PASS", "TC-UI-006: Smart Plan tab shows empty state");
    } catch (e) {
      log("FAIL", "TC-UI-006: Smart Plan tab", e.message);
    }

    // TC-UI-007: AI Predictor tab navigates correctly
    try {
      await driver.findElement(By.xpath("//button[contains(text(),'AI Predictor')]")).click();
      await sleep(800);
      await driver.findElement(By.xpath("//*[contains(text(),'LSTM')]"));
      log("PASS", "TC-UI-007: AI Predictor tab loads LSTM predictor");
    } catch (e) {
      log("FAIL", "TC-UI-007: AI Predictor tab", e.message);
    }

    // TC-UI-008: Logout clears session and returns to landing
    try {
      await driver.findElement(By.xpath("//button[contains(text(),'Logout')]")).click();
      await sleep(1000);
      await driver.findElement(By.xpath("//*[contains(text(),'Smart Learning Planner')]"));
      log("PASS", "TC-UI-008: Logout returns to landing page");
    } catch (e) {
      log("FAIL", "TC-UI-008: Logout", e.message);
    }

    // TC-UI-009: Login with wrong password shows error
    try {
      await driver.findElement(By.xpath("//button[contains(text(),'Login') or contains(text(),'Get Started')]")).click();
      await sleep(800);

      await driver.findElement(By.css("input[placeholder*='username' i]")).sendKeys(TEST_USERNAME);
      await driver.findElement(By.css("input[type='password']")).sendKeys("wrongpassword");
      await driver.findElement(By.xpath("//button[contains(text(),'Sign In')]")).click();
      await sleep(1500);

      await driver.findElement(By.xpath("//*[contains(@class,'MuiAlert') and contains(text(),'failed') or contains(text(),'Invalid') or contains(text(),'incorrect')]"));
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
