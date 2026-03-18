# Bug Report — Smart Learning Planner
**Document ID:** SLP-BR-001  
**Version:** 1.0  
**Date:** 2026-03-18  
**Tool:** JIRA (Free Tier)  
**Standard Reference:** IEEE 829

---

## Bug Report Template
| Field | Description |
|-------|-------------|
| Bug ID | Unique identifier (e.g., SLP-BUG-001) |
| Title | Short description of the defect |
| Module | Feature area where bug was found |
| Severity | Critical / High / Medium / Low |
| Priority | P1 / P2 / P3 / P4 |
| Status | Open / In Progress / Fixed / Closed / Reopen |
| Reported By | Tester name |
| Assigned To | Developer name |
| Environment | OS, Browser, Node version |
| Steps to Reproduce | Numbered steps |
| Expected Result | What should happen |
| Actual Result | What actually happened |
| Attachments | Screenshots, logs |

---

## Defect Log

### BUG-001
| Field | Value |
|-------|-------|
| Bug ID | SLP-BUG-001 |
| Title | No rate limiting on login endpoint — brute force possible |
| Module | Authentication |
| Severity | High |
| Priority | P2 |
| Status | Open |
| Reported By | QA Tester |
| Environment | Node 18, macOS, Postman |
| Steps to Reproduce | 1. Send 100 rapid POST /api/auth/login requests with wrong password<br>2. Observe — no lockout or throttling occurs |
| Expected Result | After 5 failed attempts, account should be temporarily locked or rate limited |
| Actual Result | All 100 requests return 401 without any throttling — brute force is possible |
| Attachments | — |

---

### BUG-002
| Field | Value |
|-------|-------|
| Bug ID | SLP-BUG-002 |
| Title | Study plan generates with 0 topics when subject field is whitespace only |
| Module | Study Planner |
| Severity | Medium |
| Priority | P3 |
| Status | Open |
| Reported By | QA Tester |
| Environment | Chrome 122, React frontend |
| Steps to Reproduce | 1. Type only spaces in the subject field<br>2. Click Generate |
| Expected Result | Validation error: "Please enter a subject name" |
| Actual Result | Plan generates with empty topic list, showing blank day cards |
| Attachments | — |

---

### BUG-003
| Field | Value |
|-------|-------|
| Bug ID | SLP-BUG-003 |
| Title | JWT token not invalidated on logout — token still works after logout |
| Module | Authentication |
| Severity | High |
| Priority | P2 |
| Status | Open |
| Reported By | QA Tester |
| Environment | Postman, Node 18 |
| Steps to Reproduce | 1. Login and copy the JWT token<br>2. Click Logout in the UI<br>3. Use the copied token to call GET /api/exams |
| Expected Result | Token should be invalidated, API should return 401 |
| Actual Result | API returns 200 — token is still valid after logout (no server-side invalidation) |
| Attachments | — |

---

### BUG-004
| Field | Value |
|-------|-------|
| Bug ID | SLP-BUG-004 |
| Title | Resource panel links open in same tab on some browsers |
| Module | Study Planner – ResourcePanel |
| Severity | Low |
| Priority | P4 |
| Status | Open |
| Reported By | QA Tester |
| Environment | Firefox 123 |
| Steps to Reproduce | 1. Generate a study plan<br>2. Click "View Resources & Steps"<br>3. Click a resource link |
| Expected Result | Link opens in a new tab (target="_blank") |
| Actual Result | Link opens in same tab in Firefox — user loses their plan |
| Attachments | — |

---

## Bug Summary
| Severity | Count | Open | Fixed |
|----------|-------|------|-------|
| Critical | 0 | 0 | 0 |
| High | 2 | 2 | 0 |
| Medium | 1 | 1 | 0 |
| Low | 1 | 1 | 0 |
| **Total** | **4** | **4** | **0** |
