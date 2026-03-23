# Bug Report — Smart Learning Planner
**Document ID:** SLP-BR-001  
**Version:** 2.0  
**Date:** 2026-03-23  
**Standard Reference:** IEEE 829

---

## Defect Log

### BUG-001 — JWT token not invalidated on logout
| Field | Value |
|-------|-------|
| Bug ID | SLP-BUG-001 |
| Severity | High |
| Priority | P2 |
| Status | Open |
| Module | Authentication |
| Environment | Postman, Node 18 |
| Steps to Reproduce | 1. Login and copy the JWT token<br>2. Click Logout in the UI<br>3. Use the copied token to call GET /api/exams |
| Expected Result | Token should be invalidated, API returns 401 |
| Actual Result | API returns 200 — token is still valid after logout (no server-side blacklist) |
| Notes | Stateless JWT by design; fix requires a token blacklist (Redis) or short expiry |

---

### BUG-002 — Resource links open in same tab on some browsers
| Field | Value |
|-------|-------|
| Bug ID | SLP-BUG-002 |
| Severity | Low |
| Priority | P4 |
| Status | Open |
| Module | Study Planner – ResourcePanel |
| Environment | Firefox 123 |
| Steps to Reproduce | 1. Generate a study plan<br>2. Click "View Resources & Steps"<br>3. Click a resource link |
| Expected Result | Link opens in a new tab (target="_blank") |
| Actual Result | Link opens in same tab in Firefox — user loses their plan |

---

## Bug Summary

| Severity | Count | Open | Fixed |
|----------|-------|------|-------|
| Critical | 0 | 0 | 0 |
| High | 1 | 1 | 0 |
| Medium | 0 | 0 | 2 (BUG-001 rate limiting ✅, BUG-002 whitespace ✅) |
| Low | 1 | 1 | 0 |
| **Total** | **2** | **2** | **2** |

---

## Fixed Bugs (Closed)

| Bug ID | Title | Fixed In |
|--------|-------|----------|
| ~~SLP-BUG-003~~ | No rate limiting on /api/resources | Added express-rate-limit (20 req/min) |
| ~~SLP-BUG-004~~ | Whitespace-only subject generates blank plan | Fixed with `!subject.trim()` check in frontend |
