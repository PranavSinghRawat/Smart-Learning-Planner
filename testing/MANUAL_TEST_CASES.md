# Manual Test Cases — Smart Learning Planner
**Document ID:** SLP-TC-001  
**Version:** 3.0  
**Date:** 2026-03-23  
**Standard Reference:** IEEE 829  
**Total Test Cases:** 24

---

## MODULE 1: User Authentication

### TC-001 — Successful user registration
| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Preconditions | Server running, username/email not already registered |
| Test Steps | 1. Open app → click Get Started<br>2. Click Register tab<br>3. Enter Username, Email, Password, Confirm Password<br>4. Click Create Account |
| Expected Result | User registered, JWT token stored, redirected to Study Planner |

### TC-002 — Registration with duplicate email
| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Preconditions | User with same email already exists |
| Test Steps | 1. Register with an email that already exists |
| Expected Result | HTTP 400, error: "Email is already registered" |

### TC-003 — Registration with duplicate username
| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Preconditions | User with same username already exists |
| Test Steps | 1. Register with a username that already exists |
| Expected Result | HTTP 400, error mentioning username conflict |

### TC-004 — Registration with missing required fields
| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Test Steps | 1. Submit registration with only email filled |
| Expected Result | HTTP 400, validation error shown |

### TC-005 — Successful login with username
| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Preconditions | User is registered |
| Test Steps | 1. Enter username and password → click Sign In |
| Expected Result | JWT token stored, redirected to Study Planner, username shown in navbar |

### TC-006 — Login using email in the username field
| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Preconditions | User is registered |
| Test Steps | 1. Enter email address in the username field → correct password → Sign In |
| Expected Result | Login succeeds, JWT token returned |

### TC-007 — Login with wrong password
| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Preconditions | User is registered |
| Test Steps | 1. Enter correct username, wrong password → Sign In |
| Expected Result | HTTP 401, error alert shown |

### TC-008 — Logout clears session
| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Preconditions | User is logged in |
| Test Steps | 1. Click Logout button in navbar |
| Expected Result | Token removed from localStorage, redirected to landing page |

---

## MODULE 2: Study Planner

### TC-009 — Generate AI study plan using Groq
| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Preconditions | User logged in, backend running, GROQ_API_KEY set in backend/.env |
| Test Steps | 1. Type "DSA" in subject field<br>2. Set Days: 3, Hours: 2, Level: Beginner<br>3. Click Generate |
| Expected Result | Groq LLaMA 3.3 generates day-by-day plan, accordion day cards appear |

### TC-010 — Generate plan for non-catalog subject
| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Preconditions | User logged in |
| Test Steps | 1. Type "Pottery" → Days: 3, Hours: 1 → Generate |
| Expected Result | Plan generated with relevant topics for Pottery |

### TC-011 — Mark topic as complete — updates progress
| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Preconditions | Study plan is generated |
| Test Steps | 1. Click circle icon next to a topic<br>2. Observe progress bar and pie chart |
| Expected Result | Topic gets strikethrough, progress bar updates, daily score saved to localStorage |

### TC-012 — Daily score saved to localStorage on topic completion
| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Preconditions | User logged in, study plan generated |
| Test Steps | 1. Mark several topics complete<br>2. Open DevTools → Application → localStorage → key `dailyScores_<userId>` |
| Expected Result | Entry with today's date and completion % (0.0–1.0) |

### TC-013 — Generate plan with empty subject field
| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Negative |
| Test Steps | 1. Clear subject field → click Generate |
| Expected Result | Snackbar error: "Please enter a subject name" |

### TC-014 — Study timer start, pause, reset
| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Functional |
| Preconditions | Study plan is generated |
| Test Steps | 1. Click Start → timer counts up<br>2. Click Pause → timer stops<br>3. Click Reset → shows 00:00:00 |
| Expected Result | Timer behaves correctly at each step |

---

## MODULE 3: Smart Plan (Groq AI)

### TC-015 — Generate smart plan from Study Planner day card
| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Preconditions | User logged in, study plan generated, GROQ_API_KEY set |
| Test Steps | 1. Generate a study plan<br>2. Click "🧠 Smart Plan" on Day 1 card |
| Expected Result | Switches to Smart Plan tab, shows overview, hour-by-hour schedule, topic breakdown, tips |

### TC-016 — Smart Plan shows correct day and subject context
| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Test Steps | 1. Click Smart Plan on Day 2<br>2. Check summary cards at top |
| Expected Result | Shows Day 2, correct subject, topic count, and hours |

### TC-017 — Smart Plan empty state when no day selected
| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Functional |
| Test Steps | 1. Click Smart Plan tab in navbar directly (no day selected) |
| Expected Result | Shows "No day selected yet" message with instructions |

### TC-018 — Back button returns to Study Planner
| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Functional |
| Preconditions | Smart plan is generated |
| Test Steps | 1. Click Back button |
| Expected Result | Switches back to Study Planner tab |

---

## MODULE 4: LSTM Performance Predictor

### TC-019 — Prediction with real study data
| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Preconditions | User has completed topics in Study Planner, ML service running on port 5002 |
| Test Steps | 1. Complete topics in Study Planner<br>2. Switch to AI Predictor tab<br>3. Verify "Live Data" chip<br>4. Click Predict Day 8 Performance |
| Expected Result | Shows predicted %, trend, status (On Track / At Risk / Needs Attention), LSTM model info |

### TC-020 — Prediction in demo mode (no study data)
| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Preconditions | No study data in localStorage, ML service running |
| Test Steps | 1. Open AI Predictor tab → verify "Demo Mode" chip → click Predict |
| Expected Result | Prediction runs on default demo scores, result shown |

### TC-021 — Slider adjustment changes prediction
| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Preconditions | ML service running on port 5002 |
| Test Steps | 1. Set all 7 sliders to 0.9 → Predict → note result<br>2. Set all sliders to 0.2 → Predict again |
| Expected Result | High scores → "On Track"; Low scores → "Needs Attention" |

### TC-022 — ML service offline error handling
| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Negative |
| Preconditions | ML service NOT running |
| Test Steps | 1. Stop Flask ML service → click Predict Day 8 Performance |
| Expected Result | Error: "ML service is not running. Start it: cd ml_service && python app.py" |

---

## MODULE 5: API Security

### TC-023 — Access protected route without token
| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Security |
| Test Steps | 1. GET /api/exams with no Authorization header |
| Expected Result | HTTP 401 Unauthorized |

### TC-024 — NoSQL injection attempt in login
| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Security |
| Test Steps | 1. POST /api/auth/login with body: `{"username": {"$gt": ""}, "password": "anything"}` |
| Expected Result | HTTP 400 or 401, server does not crash |

---

## Test Execution Summary

| Module | Total TCs | Pass | Fail | Blocked |
|--------|-----------|------|------|---------|
| Authentication | 8 | | | |
| Study Planner | 6 | | | |
| Smart Plan | 4 | | | |
| LSTM Predictor | 4 | | | |
| API Security | 2 | | | |
| **Total** | **24** | | | |

---

## Automated Test Coverage (Jest)

| Test Suite | Tests | Status |
|------------|-------|--------|
| auth.test.js | 9 | ✅ Pass |
| exam.test.js | 7 | ✅ Pass |
| subject.test.js | 5 | ✅ Pass |
| smartplan.test.js | 7 | ✅ Pass |
| **Total** | **28** | **✅ All Pass** |
