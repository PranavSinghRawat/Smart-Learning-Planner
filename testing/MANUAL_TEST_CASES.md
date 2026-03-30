# Manual Test Cases — Smart Learning Planner
**Document ID:** SLP-TC-001  
**Version:** 4.0  
**Date:** 2026-03-30  
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
| Expected Result | HTTP 400, error: "Email already exists" |

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

### TC-005 — Registration with password exceeding 128 characters (boundary)
| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Boundary |
| Test Steps | 1. Enter a password of 129 characters → click Create Account |
| Expected Result | HTTP 400, password too long error |

### TC-006 — Successful login with username
| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Preconditions | User is registered |
| Test Steps | 1. Enter username and password → click Sign In |
| Expected Result | JWT token stored, redirected to Study Planner, username shown in navbar |

### TC-007 — Login using email in the username field
| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Preconditions | User is registered |
| Test Steps | 1. Enter email address in the username field → correct password → Sign In |
| Expected Result | Login succeeds, JWT token returned |

### TC-008 — Login with wrong password
| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Negative |
| Preconditions | User is registered |
| Test Steps | 1. Enter correct username, wrong password → Sign In |
| Expected Result | HTTP 401, error alert shown |

### TC-009 — Logout clears session
| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Preconditions | User is logged in |
| Test Steps | 1. Click Logout button in navbar |
| Expected Result | Token removed from localStorage, redirected to landing page |

---

## MODULE 2: Study Planner

### TC-010 — Generate AI study plan using Groq
| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Preconditions | User logged in, backend running, GROQ_API_KEY set |
| Test Steps | 1. Type "DSA" in subject field<br>2. Set Days: 3, Hours: 2, Level: Beginner<br>3. Click Generate |
| Expected Result | Groq LLaMA 3.3 generates day-by-day plan, accordion day cards appear |

### TC-011 — Generate plan for non-catalog subject
| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Preconditions | User logged in |
| Test Steps | 1. Type "Pottery" → Days: 3, Hours: 1 → Generate |
| Expected Result | Plan generated with relevant topics for Pottery |

### TC-012 — Mark topic as complete — updates progress
| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Preconditions | Study plan is generated |
| Test Steps | 1. Click circle icon next to a topic<br>2. Observe progress bar and pie chart |
| Expected Result | Topic gets strikethrough, progress bar updates, daily score saved to localStorage |

### TC-013 — Daily score saved to localStorage on topic completion
| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Preconditions | User logged in, study plan generated |
| Test Steps | 1. Mark several topics complete<br>2. Open DevTools → Application → localStorage → key dailyScores_userId |
| Expected Result | Entry with today's date and completion % (0.0–1.0) |

### TC-014 — Generate plan with empty subject field
| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Negative |
| Test Steps | 1. Clear subject field → click Generate |
| Expected Result | Snackbar error: "Please enter a subject name" |

### TC-015 — Study timer start, pause, reset
| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Functional |
| Preconditions | Study plan is generated |
| Test Steps | 1. Click Start → timer counts up<br>2. Click Pause → timer stops<br>3. Click Reset → shows 00:00:00 |
| Expected Result | Timer behaves correctly at each step |

---

## MODULE 3: Smart Plan (Groq AI)

### TC-016 — Generate smart plan from Study Planner day card
| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Preconditions | User logged in, study plan generated, GROQ_API_KEY set |
| Test Steps | 1. Generate a study plan<br>2. Click "Smart Plan" on Day 1 card |
| Expected Result | Switches to Smart Plan tab, shows overview, hour-by-hour schedule, topic breakdown, tips |

### TC-017 — Smart Plan shows correct day and subject context
| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Test Steps | 1. Click Smart Plan on Day 2<br>2. Check summary cards at top |
| Expected Result | Shows Day 2, correct subject, topic count, and hours |

### TC-018 — Smart Plan empty state when no day selected
| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Functional |
| Test Steps | 1. Click Smart Plan tab in navbar directly (no day selected) |
| Expected Result | Shows "No day selected yet" message with instructions |

### TC-019 — Back button returns to Study Planner
| Field | Value |
|-------|-------|
| Priority | P3 |
| Type | Functional |
| Preconditions | Smart plan is generated |
| Test Steps | 1. Click Back button |
| Expected Result | Switches back to Study Planner tab |

---

## MODULE 4: LSTM Performance Predictor

### TC-020 — Load Sample Data seeds realistic 7-day scores
| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Preconditions | User logged in, ML service running on port 5002 |
| Test Steps | 1. Go to AI Predictor tab<br>2. Click "Load Sample Data" button<br>3. Observe bar chart |
| Expected Result | 7 bars show varied realistic scores (not all same value), chip shows "Live Data (7 days)" |

### TC-021 — Prediction with sample/real study data
| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Functional |
| Preconditions | Sample data loaded or topics completed, ML service running |
| Test Steps | 1. Click "Predict Day 8 Performance" |
| Expected Result | Shows predicted %, 7-day trend, status (On Track / At Risk / Needs Attention), LSTM gate equations, R², RMSE, MAE, param count |

### TC-022 — Slider adjustment changes prediction result
| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Functional |
| Preconditions | ML service running on port 5002 |
| Test Steps | 1. Set all 7 sliders to 0.9 → Predict → note result<br>2. Set all sliders to 0.2 → Predict again |
| Expected Result | High scores → "On Track"; Low scores → "Needs Attention" |

### TC-023 — ML service offline error handling
| Field | Value |
|-------|-------|
| Priority | P2 |
| Type | Negative |
| Preconditions | ML service NOT running |
| Test Steps | 1. Stop Flask ML service → click Predict Day 8 Performance |
| Expected Result | Error message shown: "ML service is not running. Start it: cd ml_service && python app.py" |

---

## MODULE 5: API Security

### TC-024 — Access protected route without token
| Field | Value |
|-------|-------|
| Priority | P1 |
| Type | Security |
| Test Steps | 1. GET /api/exams with no Authorization header |
| Expected Result | HTTP 401 Unauthorized |

---

## Test Execution Summary

| Module | Total TCs | Pass | Fail | Blocked |
|--------|-----------|------|------|---------|
| Authentication | 9 | 9 | 0 | 0 |
| Study Planner | 6 | 6 | 0 | 0 |
| Smart Plan | 4 | 4 | 0 | 0 |
| LSTM Predictor | 4 | 4 | 0 | 0 |
| API Security | 1 | 1 | 0 | 0 |
| **Total** | **24** | **24** | **0** | **0** |

**Pass Rate: 100%**

---

## Automated Test Coverage (Jest)

| Test Suite | Tests | Status |
|------------|-------|--------|
| auth.test.js | 16 | ✅ Pass |
| exam.test.js | 4 | ✅ Pass |
| smartplan.test.js | 11 | ✅ Pass |
| **Total** | **30** | **✅ All Pass** |
