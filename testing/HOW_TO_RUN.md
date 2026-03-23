# How to Run All Tests — Smart Learning Planner

---

## 1. Jest (Unit + Integration Tests)

```bash
cd backend
npm install
npm test
```

Runs all 28 tests with in-memory MongoDB. No real DB or API keys needed.  
Expected: 28 tests passing across 4 suites.

---

## 2. Postman (API Tests)

**Option A — Postman GUI:**
1. Open Postman
2. Import → select `testing/postman/SLP_API_Tests.postman_collection.json`
3. Start backend: `cd backend && npm run dev`
4. Click "Run Collection" → Run All

**Option B — Newman (CLI):**
```bash
npm install -g newman
newman run testing/postman/SLP_API_Tests.postman_collection.json
```

Note: Run requests in order — Register first sets the `token` variable used by later requests.

---

## 3. JMeter (Performance Tests)

**Prerequisites:** Download Apache JMeter from https://jmeter.apache.org/download_jmeter.cgi

**Step 1 — Get a valid token:**
```bash
cd backend && npm run dev

curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"loaduser","email":"load@slp.com","password":"password123"}'

curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"loaduser","password":"password123"}'
```

**Step 2 — Run JMeter GUI:**
```bash
jmeter -t testing/jmeter/SLP_Performance_Test.jmx
```
Set the TOKEN variable in Test Plan → User Defined Variables, then click Run.

**Step 3 — Headless + HTML report:**
```bash
jmeter -n -t testing/jmeter/SLP_Performance_Test.jmx \
       -l testing/jmeter/results.jtl \
       -e -o testing/jmeter/report/
```
Open `testing/jmeter/report/index.html` to view results.

---

## 4. Selenium (UI Tests)

**Prerequisites:**
```bash
npm install selenium-webdriver chromedriver
```

**Run:**
```bash
# Start backend and frontend first (in separate terminals)
cd backend && npm run dev
cd frontend && npm run dev

# Run UI tests
node testing/selenium/ui_test.js
```

Expected: 9 UI tests covering landing page, registration, login, Study Planner, Smart Plan tab, AI Predictor tab, and logout.

---

## 5. OWASP ZAP (Security Testing)

1. Download from https://www.zaproxy.org/download/
2. Start backend: `cd backend && npm run dev`
3. Open OWASP ZAP → Automated Scan → Target: `http://localhost:5001`
4. Click Attack → review Alerts tab

---

## File Structure

```
testing/
├── TEST_PLAN.md                         ← IEEE 829 test plan
├── MANUAL_TEST_CASES.md                 ← 24 manual test cases
├── BUG_REPORT.md                        ← Defect log
├── TEST_SUMMARY_REPORT.md               ← Final test results
├── HOW_TO_RUN.md                        ← This file
├── postman/
│   └── SLP_API_Tests.postman_collection.json
├── jmeter/
│   └── SLP_Performance_Test.jmx
└── selenium/
    └── ui_test.js

backend/tests/
├── setup.js          ← MongoDB Memory Server setup
├── auth.test.js      ← 9 Auth API tests
├── exam.test.js      ← 7 Exams API tests
├── subject.test.js   ← 5 Subjects API tests
└── smartplan.test.js ← 7 Resources/SmartPlan API tests (Groq)
```
