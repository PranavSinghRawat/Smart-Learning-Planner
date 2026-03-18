# How to Run All Tests — Smart Learning Planner

---

## 1. Jest (Unit + Integration Tests)

```bash
cd backend
npm install
npm test
```

Runs all test suites with in-memory MongoDB. No real DB needed.
Expected output: 19 tests passing across 4 suites.

---

## 2. Postman (API Tests)

**Option A — Postman GUI:**
1. Open Postman
2. Click Import → select `testing/postman/SLP_API_Tests.postman_collection.json`
3. Start the backend: `cd backend && npm run dev`
4. Click "Run Collection" → Run All

**Option B — Newman (CLI):**
```bash
npm install -g newman
cd backend && npm run dev &
newman run testing/postman/SLP_API_Tests.postman_collection.json
```

Note: Run requests in order — Register first sets the `token` variable used by later requests.

---

## 3. JMeter (Performance Tests)

**Prerequisites:** Download Apache JMeter from https://jmeter.apache.org/download_jmeter.cgi (free)

**Step 1 — Get a valid token:**
```bash
# Start backend
cd backend && npm run dev

# Register + login via Postman or curl, copy the token
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Load User","email":"load@slp.com","password":"password123"}'

curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"load@slp.com","password":"password123"}'
```

**Step 2 — Run JMeter GUI:**
```bash
jmeter -t testing/jmeter/SLP_Performance_Test.jmx
```
Set the TOKEN variable in Test Plan → User Defined Variables, then click Run.

**Step 3 — Run headless + generate HTML report:**
```bash
jmeter -n -t testing/jmeter/SLP_Performance_Test.jmx \
       -l testing/jmeter/results.jtl \
       -e -o testing/jmeter/report/
```
Open `testing/jmeter/report/index.html` in a browser to see the full report.

---

## 4. OWASP ZAP (Security Testing)

**Prerequisites:** Download OWASP ZAP from https://www.zaproxy.org/download/ (free)

1. Start backend: `cd backend && npm run dev`
2. Open OWASP ZAP
3. Go to: Automated Scan → Target URL: `http://localhost:5001`
4. Click Attack
5. Review Alerts tab for vulnerabilities

For API-specific scanning:
- Import the Postman collection as an OpenAPI definition
- Run Active Scan on `/api/auth/login` and `/api/exams`

---

## 5. Selenium (UI Tests)

**Prerequisites:**
```bash
cd frontend && npm install
# Install selenium-webdriver
npm install selenium-webdriver chromedriver --save-dev
```

Run the UI test:
```bash
# Start frontend and backend first
cd backend && npm run dev &
cd frontend && npm run dev &

# Run selenium test
node testing/selenium/ui_test.js
```

---

## File Structure
```
testing/
├── TEST_PLAN.md                    ← IEEE 829 test plan
├── MANUAL_TEST_CASES.md            ← 24 manual test cases
├── BUG_REPORT.md                   ← Defect log (JIRA format)
├── TEST_SUMMARY_REPORT.md          ← Final test results
├── HOW_TO_RUN.md                   ← This file
├── postman/
│   └── SLP_API_Tests.postman_collection.json
├── jmeter/
│   └── SLP_Performance_Test.jmx
└── selenium/
    └── ui_test.js

backend/tests/
├── setup.js                        ← MongoDB Memory Server setup
├── auth.test.js                    ← Auth API tests
├── exam.test.js                    ← Exams API tests
├── subject.test.js                 ← Subjects API tests
└── smartplan.test.js               ← SmartPlan API tests
```
