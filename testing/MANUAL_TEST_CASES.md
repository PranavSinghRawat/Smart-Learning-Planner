# Manual Test Cases — Smart Learning Planner
**Document ID:** SLP-TC-001  
**Version:** 1.0  
**Date:** 2026-03-18  
**Standard Reference:** IEEE 829 Test Case Template

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
| Preconditions | Server running, email not already registered |
| Test Steps | 1. Navigate to app URL<br>2. Click "Register" tab<br>3. Enter Name: "John Doe"<br>4. Enter Email: "john@test.com"<br>5. Enter Password: "password123"<br>6. Click Register button |
| Expected Result | User is registered, JWT token returned, redirected to Study Planner |
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
| Preconditions | User with email "john@test.com" already exists |
| Test Steps | 1. Attempt to register with same email "john@test.com"<br>2. Click Register |
| Expected Result | Error message: "Email is already registered." HTTP 400 |
| Actual Result | |
| Status | |

### TC-003
| Field | Value |
|-------|-------|
| TC-ID | TC-003 |
| Title | Registration with missing required fields |
| Module | Authentication |
| Priority | P1 |
| Type | Negative |
| Preconditions | None |
| Test Steps | 1. Submit registration form with only email field filled<br>2. Leave name and password empty |
| Expected Result | Validation error shown, HTTP 400 returned |
| Actual Result | |
| Status | |

### TC-004
| Field | Value |
|-------|-------|
| TC-ID | TC-004 |
| Title | Registration with password shorter than 6 characters |
| Module | Authentication |
| Priority | P2 |
| Type | Boundary |
| Preconditions | None |
| Test Steps | 1. Enter valid name and email<br>2. Enter password: "abc" (3 chars)<br>3. Click Register |
| Expected Result | Validation error: password too short, HTTP 400 |
| Actual Result | |
| Status | |

### TC-005
| Field | Value |
|-------|-------|
| TC-ID | TC-005 |
| Title | Successful login with valid credentials |
| Module | Authentication |
| Priority | P1 |
| Type | Functional |
| Preconditions | User "john@test.com" / "password123" is registered |
| Test Steps | 1. Enter email: "john@test.com"<br>2. Enter password: "password123"<br>3. Click Login |
| Expected Result | JWT token returned, user redirected to Study Planner, username shown in navbar |
| Actual Result | |
| Status | |

### TC-006
| Field | Value |
|-------|-------|
| TC-ID | TC-006 |
| Title | Login with wrong password |
| Module | Authentication |
| Priority | P1 |
| Type | Negative |
| Preconditions | User "john@test.com" is registered |
| Test Steps | 1. Enter email: "john@test.com"<br>2. Enter password: "wrongpass"<br>3. Click Login |
| Expected Result | Error message shown, HTTP 401, user stays on login page |
| Actual Result | |
| Status | |

### TC-007
| Field | Value |
|-------|-------|
| TC-ID | TC-007 |
| Title | Login with non-existent email |
| Module | Authentication |
| Priority | P1 |
| Type | Negative |
| Preconditions | None |
| Test Steps | 1. Enter email: "nobody@nowhere.com"<br>2. Enter any password<br>3. Click Login |
| Expected Result | HTTP 401, error message displayed |
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
| Test Steps | 1. Click "Logout" button in navbar<br>2. Observe page state |
| Expected Result | Token removed from localStorage, user redirected to login page |
| Actual Result | |
| Status | |

---

## MODULE 2: Study Planner

### TC-009
| Field | Value |
|-------|-------|
| TC-ID | TC-009 |
| Title | Generate study plan for a catalog subject (DSA) |
| Module | Study Planner |
| Priority | P1 |
| Type | Functional |
| Preconditions | User is logged in |
| Test Steps | 1. Type "DSA" in the subject field<br>2. Set Days: 3, Hours/Day: 2<br>3. Select Level: Beginner<br>4. Click Generate |
| Expected Result | Day cards appear with topics, each topic has a "View Resources & Steps" button |
| Actual Result | |
| Status | |

### TC-010
| Field | Value |
|-------|-------|
| TC-ID | TC-010 |
| Title | Generate study plan for a non-catalog subject |
| Module | Study Planner |
| Priority | P1 |
| Type | Functional |
| Preconditions | User is logged in |
| Test Steps | 1. Type "Pottery" in the subject field<br>2. Set Days: 5, Hours/Day: 1<br>3. Select Level: Beginner<br>4. Click Generate |
| Expected Result | Auto-generated plan appears with 5 day cards and relevant topics |
| Actual Result | |
| Status | |

### TC-011
| Field | Value |
|-------|-------|
| TC-ID | TC-011 |
| Title | View resources for a topic |
| Module | Study Planner – ResourcePanel |
| Priority | P1 |
| Type | Functional |
| Preconditions | Study plan is generated |
| Test Steps | 1. Click "📚 View Resources & Steps" on any topic<br>2. Observe the expanded panel |
| Expected Result | Panel expands showing numbered steps, resource links with type badges, practice problems with difficulty chips |
| Actual Result | |
| Status | |

### TC-012
| Field | Value |
|-------|-------|
| TC-ID | TC-012 |
| Title | Mark topic as complete |
| Module | Study Planner |
| Priority | P2 |
| Type | Functional |
| Preconditions | Study plan is generated |
| Test Steps | 1. Click the circle icon next to a topic<br>2. Observe the topic and progress bar |
| Expected Result | Topic gets strikethrough, circle turns green, progress bar updates |
| Actual Result | |
| Status | |

### TC-013
| Field | Value |
|-------|-------|
| TC-ID | TC-013 |
| Title | Boundary — Days field with value 1 |
| Module | Study Planner |
| Priority | P2 |
| Type | Boundary |
| Preconditions | User is logged in |
| Test Steps | 1. Set Days: 1<br>2. Generate plan for DSA Beginner |
| Expected Result | Single day card with all beginner topics |
| Actual Result | |
| Status | |

### TC-014
| Field | Value |
|-------|-------|
| TC-ID | TC-014 |
| Title | Study timer start, pause, reset |
| Module | Study Planner – Timer |
| Priority | P3 |
| Type | Functional |
| Preconditions | Study plan is generated |
| Test Steps | 1. Click Start — timer begins counting<br>2. Click Pause — timer stops<br>3. Click Reset — timer goes to 00:00:00 |
| Expected Result | Timer behaves correctly at each step |
| Actual Result | |
| Status | |

### TC-015
| Field | Value |
|-------|-------|
| TC-ID | TC-015 |
| Title | Generate plan with empty subject field |
| Module | Study Planner |
| Priority | P2 |
| Type | Negative |
| Preconditions | User is logged in |
| Test Steps | 1. Clear the subject field<br>2. Click Generate |
| Expected Result | Error snackbar: "Please enter a subject name" |
| Actual Result | |
| Status | |

---

## MODULE 3: Exam Planner

### TC-016
| Field | Value |
|-------|-------|
| TC-ID | TC-016 |
| Title | Create a new exam |
| Module | Exam Planner |
| Priority | P1 |
| Type | Functional |
| Preconditions | User is logged in, on Exam Planner tab |
| Test Steps | 1. Enter Exam Name: "Mathematics Final"<br>2. Select Exam Date: a future date<br>3. Enter Target Score: 85<br>4. Click Add Exam |
| Expected Result | Exam appears in the list with correct name, date, and target score |
| Actual Result | |
| Status | |

### TC-017
| Field | Value |
|-------|-------|
| TC-ID | TC-017 |
| Title | Create exam without name |
| Module | Exam Planner |
| Priority | P1 |
| Type | Negative |
| Preconditions | User is logged in |
| Test Steps | 1. Leave exam name empty<br>2. Set a valid date<br>3. Click Add Exam |
| Expected Result | Validation error: "Exam name is required" |
| Actual Result | |
| Status | |

### TC-018
| Field | Value |
|-------|-------|
| TC-ID | TC-018 |
| Title | Create exam with invalid date |
| Module | Exam Planner |
| Priority | P2 |
| Type | Boundary |
| Preconditions | User is logged in |
| Test Steps | 1. Enter exam name<br>2. Enter date: "not-a-date"<br>3. Click Add Exam |
| Expected Result | Validation error: "Valid exam date is required" |
| Actual Result | |
| Status | |

### TC-019
| Field | Value |
|-------|-------|
| TC-ID | TC-019 |
| Title | Target score boundary — value 0 |
| Module | Exam Planner |
| Priority | P3 |
| Type | Boundary |
| Preconditions | User is logged in |
| Test Steps | 1. Enter valid exam name and date<br>2. Enter Target Score: 0<br>3. Click Add Exam |
| Expected Result | Exam created successfully with target score 0 |
| Actual Result | |
| Status | |

### TC-020
| Field | Value |
|-------|-------|
| TC-ID | TC-020 |
| Title | Target score boundary — value 101 (invalid) |
| Module | Exam Planner |
| Priority | P2 |
| Type | Boundary |
| Preconditions | User is logged in |
| Test Steps | 1. Enter valid exam name and date<br>2. Enter Target Score: 101<br>3. Click Add Exam |
| Expected Result | Validation error: "Target score must be between 0 and 100" |
| Actual Result | |
| Status | |

### TC-021
| Field | Value |
|-------|-------|
| TC-ID | TC-021 |
| Title | Delete an exam |
| Module | Exam Planner |
| Priority | P2 |
| Type | Functional |
| Preconditions | At least one exam exists |
| Test Steps | 1. Click delete icon on an exam<br>2. Confirm deletion |
| Expected Result | Exam removed from list, success message shown |
| Actual Result | |
| Status | |

---

## MODULE 4: API Security

### TC-022
| Field | Value |
|-------|-------|
| TC-ID | TC-022 |
| Title | Access protected route without token |
| Module | API Security |
| Priority | P1 |
| Type | Security |
| Preconditions | Server running |
| Test Steps | 1. Send GET /api/exams with no Authorization header |
| Expected Result | HTTP 401 Unauthorized |
| Actual Result | |
| Status | |

### TC-023
| Field | Value |
|-------|-------|
| TC-ID | TC-023 |
| Title | Access protected route with invalid/expired token |
| Module | API Security |
| Priority | P1 |
| Type | Security |
| Preconditions | Server running |
| Test Steps | 1. Send GET /api/exams with Authorization: Bearer invalidtoken123 |
| Expected Result | HTTP 401 Unauthorized |
| Actual Result | |
| Status | |

### TC-024
| Field | Value |
|-------|-------|
| TC-ID | TC-024 |
| Title | SQL/NoSQL injection in login email field |
| Module | API Security |
| Priority | P1 |
| Type | Security |
| Preconditions | Server running |
| Test Steps | 1. POST /api/auth/login with email: `{"$gt": ""}` and any password |
| Expected Result | HTTP 400 or 401, no data leaked, no server crash |
| Actual Result | |
| Status | |

---

## Test Execution Summary Template

| Module | Total TCs | Pass | Fail | Blocked | Pass % |
|--------|-----------|------|------|---------|--------|
| Authentication | 8 | | | | |
| Study Planner | 7 | | | | |
| Exam Planner | 6 | | | | |
| API Security | 3 | | | | |
| **Total** | **24** | | | | |
