# Manual Test Cases — Smart Learning Planner
**Document ID:** SLP-TC-001  
**Version:** 2.0  
**Date:** 2026-03-21  
**Standard Reference:** IEEE 829 Test Case Template  
**Total Test Cases:** 30

---

## Test Case Template
| Field | Description |
|-------|-------------|
| TC-ID | Unique test case identifier |
| Title | Short description of what is being tested |
| Module | Feature/module under test |
| Priority | P1 (Critical) / P2 (High) / P3 (Medium) / P4 (Low) |
| Type | Functional / Boundary / Negative / Security |
| Preconditions | State required before test execution |
| Test Steps | Step-by-step actions |
| Expected Result | What should happen |
| Actual Result | Filled during execution |
| Status | Pass / Fail / Blocked |

---

## MODULE 1: User Authentication

### TC-001
| Field | Value |
|-------|-------|
| TC-ID | TC-001 |
| Title | Successful user registration |
| Module | Authentication |
| Priority | P1 |
| Type | Functional |
| Preconditions | Server running, username/email not already registered |
| Test Steps | 1. Open app URL<br>2. Click Register tab<br>3. Enter Username, Name, Email, Password<br>4. Click Register |
| Expected Result | User registered, JWT token returned, redirected to Study Planner |
| Actual Result | |
| Status | |

### TC-002
| Field | Value |
|-------|-------|
| TC-ID | TC-002 |
| Title | Registration with duplicate email |
| Module | Authentication |
| Priority | P1 |
| Type | Negative |
| Preconditions | User with same email already exists |
| Test Steps | 1. Register with an email that already exists<br>2. Click Register |
| Expected Result | HTTP 400, error: "Email is already registered" |
| Actual Result | |
| Status | |

### TC-003
| Field | Value |
|-------|-------|
| TC-ID | TC-003 |
| Title | Registration with duplicate username |
| Module | Authentication |
| Priority | P1 |
| Type | Negative |
| Preconditions | User with same username already exists |
| Test Steps | 1. Register with a username that already exists<br>2. Click Register |
| Expected Result | HTTP 400, error mentioning username conflict |
| Actual Result | |
| Status | |

### TC-004
| Field | Value |
|-------|-------|
| TC-ID | TC-004 |
| Title | Registration with missing required fields |
| Module | Authentication |
| Priority | P1 |
| Type | Negative |
| Preconditions | None |
| Test Steps | 1. Submit registration with only email filled<br>2. Leave username and password empty |
| Expected Result | HTTP 400, validation error shown |
| Actual Result | |
| Status | |

### TC-005
| Field | Value |
|-------|-------|
| TC-ID | TC-005 |
| Title | Successful login with username |
| Module | Authentication |
| Priority | P1 |
| Type | Functional |
| Preconditions | User is registered |
| Test Steps | 1. Enter username and password<br>2. Click Login |
| Expected Result | JWT token returned, redirected to Study Planner, username shown in navbar |
| Actual Result | |
| Status | |

### TC-006
| Field | Value |
|-------|-------|
| TC-ID | TC-006 |
| Title | Login using email in the username field |
| Module | Authentication |
| Priority | P2 |
| Type | Functional |
| Preconditions | User is registered |
| Test Steps | 1. Enter email address in the username field<br>2. Enter correct password<br>3. Click Login |
| Expected Result | Login succeeds, JWT token returned |
| Actual Result | |
| Status | |

### TC-007
| Field | Value |
|-------|-------|
| TC-ID | TC-007 |
| Title | Login with wrong password |
| Module | Authentication |
| Priority | P1 |
| Type | Negative |
| Preconditions | User is registered |
| Test Steps | 1. Enter correct username<br>2. Enter wrong password<br>3. Click Login |
| Expected Result | HTTP 401, error message shown |
| Actual Result | |
| Status | |

### TC-008
| Field | Value |
|-------|-------|
| TC-ID | TC-008 |
| Title | Logout clears session |
| Module | Authentication |
| Priority | P2 |
| Type | Functional |
| Preconditions | User is logged in |
| Test Steps | 1. Click Logout button in navbar |
| Expected Result | Token removed from localStorage, redirected to login page |
| Actual Result | |
| Status | |

---

## MODULE 2: Study Planner

### TC-009
| Field | Value |
|-------|-------|
| TC-ID | TC-009 |
| Title | Generate AI study plan using Gemini |
| Module | Study Planner |
| Priority | P1 |
| Type | Functional |
| Preconditions | User logged in, backend running, Gemini API key set |
| Test Steps | 1. Type "DSA" in subject field<br>2. Set Days: 3, Hours: 2, Level: Beginner<br>3. Click Generate |
| Expected Result | Gemini generates day-by-day plan, day cards appear with specific topics |
| Actual Result | |
| Status | |

### TC-010
| Field | Value |
|-------|-------|
| TC-ID | TC-010 |
| Title | Generate plan for non-catalog subject (auto-generate) |
| Module | Study Planner |
| Priority | P1 |
| Type | Functional |
| Preconditions | User logged in |
| Test Steps | 1. Type "Pottery" in subject field<br>2. Set Days: 3, Hours: 1<br>3. Click Generate |
| Expected Result | Plan generated with relevant topics for Pottery |
| Actual Result | |
| Status | |

### TC-011
| Field | Value |
|-------|-------|
| TC-ID | TC-011 |
| Title | View AI resources for a topic |
| Module | Study Planner – ResourcePanel |
| Priority | P1 |
| Type | Functional |
| Preconditions | Study plan is generated |
| Test Steps | 1. Click "📚 View Resources & Steps" on any topic<br>2. Wait for Gemini response |
| Expected Result | Panel shows 3 steps with resource links, platform names, and practice problems |
| Actual Result | |
| Status | |

### TC-012
| Field | Value |
|-------|-------|
| TC-ID | TC-012 |
| Title | Mark topic as complete — updates progress |
| Module | Study Planner |
| Priority | P1 |
| Type | Functional |
| Preconditions | Study plan is generated |
| Test Steps | 1. Click circle icon next to a topic<br>2. Observe progress bar and pie chart |
| Expected Result | Topic gets strikethrough, progress bar updates, daily score saved to localStorage |
| Actual Result | |
| Status | |

### TC-013
| Field | Value |
|-------|-------|
| TC-ID | TC-013 |
| Title | Daily score saved to localStorage on topic completion |
| Module | Study Planner – LSTM Data Feed |
| Priority | P1 |
| Type | Functional |
| Preconditions | User logged in, study plan generated |
| Test Steps | 1. Mark several topics complete<br>2. Open browser DevTools → Application → localStorage<br>3. Check key `dailyScores_<userId>` |
| Expected Result | Entry exists with today's date and completion percentage (0.0–1.0) |
| Actual Result | |
| Status | |

### TC-014
| Field | Value |
|-------|-------|
| TC-ID | TC-014 |
| Title | Generate plan with empty subject field |
| Module | Study Planner |
| Priority | P2 |
| Type | Negative |
| Preconditions | User logged in |
| Test Steps | 1. Clear subject field<br>2. Click Generate |
| Expected Result | Error snackbar: "Please enter a subject name" |
| Actual Result | |
| Status | |

### TC-015
| Field | Value |
|-------|-------|
| TC-ID | TC-015 |
| Title | Boundary — Days field set to 1 |
| Module | Study Planner |
| Priority | P2 |
| Type | Boundary |
| Preconditions | User logged in |
| Test Steps | 1. Set Days: 1<br>2. Generate plan for DSA Beginner |
| Expected Result | Single day card with all beginner topics |
| Actual Result | |
| Status | |

### TC-016
| Field | Value |
|-------|-------|
| TC-ID | TC-016 |
| Title | Study timer start, pause, reset |
| Module | Study Planner – Timer |
| Priority | P3 |
| Type | Functional |
| Preconditions | Study plan is generated |
| Test Steps | 1. Click Start — timer counts up<br>2. Click Pause — timer stops<br>3. Click Reset — timer shows 00:00:00 |
| Expected Result | Timer behaves correctly at each step |
| Actual Result | |
| Status | |

---

## MODULE 3: Smart Plan (Gemini AI)

### TC-017
| Field | Value |
|-------|-------|
| TC-ID | TC-017 |
| Title | Generate smart plan from Study Planner day card |
| Module | Smart Plan |
| Priority | P1 |
| Type | Functional |
| Preconditions | User logged in, study plan generated, Gemini API key set |
| Test Steps | 1. Generate a study plan<br>2. Click "🧠 Smart Plan" button on Day 1 card<br>3. Wait for Gemini response |
| Expected Result | Switches to Smart Plan tab, shows overview, hour-by-hour schedule, topic breakdown, and tips |
| Actual Result | |
| Status | |

### TC-018
| Field | Value |
|-------|-------|
| TC-ID | TC-018 |
| Title | Smart Plan shows correct day and subject context |
| Module | Smart Plan |
| Priority | P2 |
| Type | Functional |
| Preconditions | Study plan generated for DSA |
| Test Steps | 1. Click Smart Plan on Day 2<br>2. Check the summary cards at top |
| Expected Result | Shows Day 2, subject DSA, correct topic count and hours |
| Actual Result | |
| Status | |

### TC-019
| Field | Value |
|-------|-------|
| TC-ID | TC-019 |
| Title | Smart Plan — no day selected state |
| Module | Smart Plan |
| Priority | P3 |
| Type | Functional |
| Preconditions | User navigates directly to Smart Plan tab without clicking a day |
| Test Steps | 1. Click Smart Plan tab in navbar directly |
| Expected Result | Shows "No Day Selected" message with instructions |
| Actual Result | |
| Status | |

### TC-020
| Field | Value |
|-------|-------|
| TC-ID | TC-020 |
| Title | Back to Study Planner from Smart Plan |
| Module | Smart Plan |
| Priority | P3 |
| Type | Functional |
| Preconditions | Smart plan is generated |
| Test Steps | 1. Click "← Back to Study Planner" button |
| Expected Result | Switches back to Study Planner tab, smart plan context cleared |
| Actual Result | |
| Status | |

---

## MODULE 4: AI Predictor (LSTM)

### TC-021
| Field | Value |
|-------|-------|
| TC-ID | TC-021 |
| Title | LSTM prediction with real study data |
| Module | AI Predictor |
| Priority | P1 |
| Type | Functional |
| Preconditions | User has completed topics in Study Planner (at least 1 day), ML service running on port 5002 |
| Test Steps | 1. Complete topics in Study Planner<br>2. Switch to AI Predictor tab<br>3. Verify "Live Data" chip is shown<br>4. Click Predict Day 8 Performance |
| Expected Result | Shows predicted %, trend, status (On Track/At Risk/Needs Attention), LSTM model info |
| Actual Result | |
| Status | |

### TC-022
| Field | Value |
|-------|-------|
| TC-ID | TC-022 |
| Title | LSTM prediction in demo mode (no study data) |
| Module | AI Predictor |
| Priority | P2 |
| Type | Functional |
| Preconditions | No study data in localStorage, ML service running |
| Test Steps | 1. Open AI Predictor tab<br>2. Verify "Demo Mode" chip<br>3. Click Predict |
| Expected Result | Prediction runs on default demo scores, result shown |
| Actual Result | |
| Status | |

### TC-023
| Field | Value |
|-------|-------|
| TC-ID | TC-023 |
| Title | Slider adjustment changes prediction |
| Module | AI Predictor |
| Priority | P2 |
| Type | Functional |
| Preconditions | ML service running |
| Test Steps | 1. Set all 7 sliders to 0.9 (high scores)<br>2. Click Predict<br>3. Note result<br>4. Set all sliders to 0.2 (low scores)<br>5. Click Predict again |
| Expected Result | High scores → "On Track" status; Low scores → "Needs Attention" status |
| Actual Result | |
| Status | |

### TC-024
| Field | Value |
|-------|-------|
| TC-ID | TC-024 |
| Title | ML service offline error handling |
| Module | AI Predictor |
| Priority | P2 |
| Type | Negative |
| Preconditions | ML service NOT running |
| Test Steps | 1. Stop the Flask ML service<br>2. Click Predict Day 8 Performance |
| Expected Result | Error message: "ML service is not running. Start it: cd ml_service && python app.py" |
| Actual Result | |
| Status | |

---

## MODULE 5: API Security

### TC-025
| Field | Value |
|-------|-------|
| TC-ID | TC-025 |
| Title | Access protected route without token |
| Module | API Security |
| Priority | P1 |
| Type | Security |
| Preconditions | Server running |
| Test Steps | 1. Send GET /api/exams with no Authorization header |
| Expected Result | HTTP 401 Unauthorized |
| Actual Result | |
| Status | |

### TC-026
| Field | Value |
|-------|-------|
| TC-ID | TC-026 |
| Title | Access protected route with invalid token |
| Module | API Security |
| Priority | P1 |
| Type | Security |
| Preconditions | Server running |
| Test Steps | 1. Send GET /api/exams with Authorization: Bearer invalidtoken123 |
| Expected Result | HTTP 401 Unauthorized |
| Actual Result | |
| Status | |

### TC-027
| Field | Value |
|-------|-------|
| TC-ID | TC-027 |
| Title | NoSQL injection attempt in login |
| Module | API Security |
| Priority | P1 |
| Type | Security |
| Preconditions | Server running |
| Test Steps | 1. POST /api/auth/login with body: `{"username": {"$gt": ""}, "password": "anything"}` |
| Expected Result | HTTP 400 or 401, no data leaked, server does not crash |
| Actual Result | |
| Status | |

### TC-028
| Field | Value |
|-------|-------|
| TC-ID | TC-028 |
| Title | Unknown route returns 404 |
| Module | API Security |
| Priority | P3 |
| Type | Negative |
| Preconditions | Server running |
| Test Steps | 1. Send GET /api/nonexistent |
| Expected Result | HTTP 404, JSON error response |
| Actual Result | |
| Status | |

---

## MODULE 6: Resources API (Gemini)

### TC-029
| Field | Value |
|-------|-------|
| TC-ID | TC-029 |
| Title | Resources API returns 400 without topic |
| Module | Resources API |
| Priority | P1 |
| Type | Negative |
| Preconditions | Server running |
| Test Steps | 1. Send GET /api/resources (no topic param) |
| Expected Result | HTTP 400, error: "topic is required" |
| Actual Result | |
| Status | |

### TC-030
| Field | Value |
|-------|-------|
| TC-ID | TC-030 |
| Title | Smart Plan API returns 400 without topics |
| Module | Resources API |
| Priority | P1 |
| Type | Negative |
| Preconditions | Server running |
| Test Steps | 1. POST /api/resources/smartplan with empty body |
| Expected Result | HTTP 400, error: "topics are required" |
| Actual Result | |
| Status | |

---

## Test Execution Summary

| Module | Total TCs | Pass | Fail | Blocked | Pass % |
|--------|-----------|------|------|---------|--------|
| Authentication | 8 | | | | |
| Study Planner | 8 | | | | |
| Smart Plan | 4 | | | | |
| AI Predictor (LSTM) | 4 | | | | |
| API Security | 4 | | | | |
| Resources API | 2 | | | | |
| **Total** | **30** | | | | |

---

## Automated Test Coverage (Jest)

| Test Suite | Tests | Status |
|------------|-------|--------|
| auth.test.js | 9 | ✅ Pass |
| exam.test.js | 7 | ✅ Pass |
| subject.test.js | 5 | ✅ Pass |
| smartplan.test.js | 7 | ✅ Pass |
| **Total** | **32** | **✅ All Pass** |
