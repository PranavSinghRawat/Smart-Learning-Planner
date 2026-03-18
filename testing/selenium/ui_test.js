/**
 * Selenium UI Tests — Smart Learning Planner
 * Tool: Selenium WebDriver (free, open source)
 * Run: node testing/selenium/ui_test.js
 * Prerequisites:
 *   npm install selenium-webdriver chromedriver
 *   Backend running on :5001, Frontend on :5173
 */

const { Builder, By, until, Key } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

// ── Config ────────────────────────────────────────────────────────────────────
const BASE_URL = "http://localhost:5173";
const TEST_EMAIL = `selenium_${Date.now()}@slp.com`;
const TEST_PASSWORD = "password123";
const TEST_NAME = "Selenium Tester";
const TIMEOUT = 10000;

// ── Helpers ───────────────────────────────────────────────────────────────────
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

// ── Test Runner ───────────────────────────────────────────────────────────────
async function runTests() {
  const options = new chrome.Options();
  // Uncomment next line to run headless (no browser window):
  // options.addArguments("--headless=new");
  options.addArguments("--window-size=1280,800");

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    // ── TC-UI-001: Page loads and shows login form ──────────────────────────
    await driver.get(BASE_URL);
    await driver.wait(until.titleContains("Smart"), TIMEOUT);
    const loginTab = await driver.findElement(By.xpath("//*[contains(text(),'Login')]"));
    log("PASS", "TC-UI-001: Page loads and shows login form");

    // ── TC-UI-002: Register a new user ─────────────────────────────────────
    try {
      const registerTab = await driver.findElement(
        By.xpath("//*[contains(text(),'Register') or contains(text(),'Sign Up')]")
      );
      await registerTab.click();
      await sleep(500);

      const nameField = await driver.findElement(By.css("input[name='name'], input[placeholder*='name' i], input[label*='name' i]"));
      await nameField.sendKeys(TEST_NAME);

      const emailField = await driver.findElement(By.css("input[type='email'], input[name='email']"));
      await emailField.sendKeys(TEST_EMAIL);

      const passField = await driver.findElement(By.css("input[type='password']"));
      await passField.sendKeys(TEST_PASSWORD);

      const submitBtn = await driver.findElement(
        By.xpath("//button[contains(text(),'Register') or contains(text(),'Sign Up')]")
      );
      await submitBtn.click();
      await sleep(1500);

      // After register, should be on main app
      const navbar = await driver.findElement(By.xpath("//*[contains(text(),'Smart Learning Planner')]"));
      log("PASS", "TC-UI-002: User registration successful");
    } catch (e) {
      log("FAIL", "TC-UI-002: User registration", e.message);
    }

    // ── TC-UI-003: Study Planner tab is visible ─────────────────────────────
    try {
      const studyTab = await driver.findElement(
        By.xpath("//*[contains(text(),'Study Planner')]")
      );
      await studyTab.click();
      await sleep(500);
      log("PASS", "TC-UI-003: Study Planner tab visible and clickable");
    } catch (e) {
      log("FAIL", "TC-UI-003: Study Planner tab", e.message);
    }

    // ── TC-UI-004: Generate a study plan for DSA ────────────────────────────
    try {
      const subjectInput = await driver.findElement(
        By.css("input[placeholder*='learn' i], input[placeholder*='subject' i]")
      );
      await subjectInput.clear();
      await subjectInput.sendKeys("DSA");

      const generateBtn = await driver.findElement(
        By.xpath("//button[contains(text(),'Generate')]")
      );
      await generateBtn.click();
      await sleep(1500);

      // Day 1 card should appear
      const dayCard = await driver.findElement(
        By.xpath("//*[contains(text(),'Day 1')]")
      );
      log("PASS", "TC-UI-004: Study plan generated for DSA");
    } catch (e) {
      log("FAIL", "TC-UI-004: Generate study plan", e.message);
    }

    // ── TC-UI-005: Resource panel expands ───────────────────────────────────
    try {
      const resourceBtn = await driver.findElement(
        By.xpath("//*[contains(text(),'View Resources')]")
      );
      await resourceBtn.click();
      await sleep(800);

      // Step 1 should be visible
      const stepOne = await driver.findElement(
        By.xpath("//*[contains(@class,'MuiAvatar') and contains(text(),'1')]")
      );
      log("PASS", "TC-UI-005: Resource panel expands and shows steps");
    } catch (e) {
      log("FAIL", "TC-UI-005: Resource panel", e.message);
    }

    // ── TC-UI-006: Exam Planner tab navigates correctly ─────────────────────
    try {
      const examTab = await driver.findElement(
        By.xpath("//*[contains(text(),'Exam Planner')]")
      );
      await examTab.click();
      await sleep(800);
      log("PASS", "TC-UI-006: Exam Planner tab navigates correctly");
    } catch (e) {
      log("FAIL", "TC-UI-006: Exam Planner tab", e.message);
    }

    // ── TC-UI-007: Logout clears session ────────────────────────────────────
    try {
      const logoutBtn = await driver.findElement(
        By.xpath("//button[contains(text(),'Logout')]")
      );
      await logoutBtn.click();
      await sleep(1000);

      // Should be back on login page
      await driver.findElement(By.xpath("//*[contains(text(),'Login')]"));
      log("PASS", "TC-UI-007: Logout returns to login page");
    } catch (e) {
      log("FAIL", "TC-UI-007: Logout", e.message);
    }

    // ── TC-UI-008: Login with wrong password shows error ────────────────────
    try {
      const emailField = await driver.findElement(By.css("input[type='email'], input[name='email']"));
      await emailField.sendKeys(TEST_EMAIL);

      const passField = await driver.findElement(By.css("input[type='password']"));
      await passField.sendKeys("wrongpassword");

      const loginBtn = await driver.findElement(
        By.xpath("//button[contains(text(),'Login') or contains(text(),'Sign In')]")
      );
      await loginBtn.click();
      await sleep(1500);

      // Should still be on auth page (not redirected)
      const stillOnAuth = await driver.findElements(
        By.xpath("//button[contains(text(),'Login') or contains(text(),'Sign In')]")
      );
      if (stillOnAuth.length > 0) {
        log("PASS", "TC-UI-008: Wrong password keeps user on login page");
      } else {
        log("FAIL", "TC-UI-008: Wrong password — user was incorrectly logged in");
      }
    } catch (e) {
      log("FAIL", "TC-UI-008: Wrong password test", e.message);
    }

  } finally {
    await driver.quit();

    // ── Summary ──────────────────────────────────────────────────────────────
    console.log("\n" + "─".repeat(50));
    console.log(`Selenium UI Test Results`);
    console.log("─".repeat(50));
    console.log(`Total:  ${passed + failed}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Pass Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
    console.log("─".repeat(50));
  }
}

runTests().catch((err) => {
  console.error("Fatal error in test runner:", err);
  process.exit(1);
});
