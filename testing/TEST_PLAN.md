# Test Plan — Smart Learning Planner
**Document ID:** SLP-TP-001  
**Version:** 1.0  
**Date:** 2026-03-18  
**Prepared By:** QA Team  
**Standard Reference:** IEEE 829

---

## 1. Introduction

### 1.1 Purpose
This test plan describes the testing strategy, scope, resources, schedule, and deliverables for the Smart Learning Planner web application. It is prepared in accordance with IEEE 829 (Standard for Software Test Documentation).

### 1.2 Project Overview
Smart Learning Planner is a full-stack web application that allows users to:
- Register and authenticate securely
- Generate personalized day-wise study plans for any subject
- Plan and track upcoming exams
- Set career goals
- Receive AI/ML-powered smart study recommendations

**Tech Stack:**
- Frontend: React + Vite + Material UI
- Backend: Node.js + Express.js
- Database: MongoDB (Atlas)
- ML Service: Python Flask + scikit-learn
- Auth: JWT (JSON Web Tokens)

### 1.3 Scope
**In Scope:**
- Backend REST API testing (Auth, Exams, Subjects, SmartPlan)
- Frontend functional testing (Login, Registration, Study Planner, Exam Planner)
- Performance testing on critical API endpoints
- Security testing on authentication and input handling
- Manual test case execution

**Out of Scope:**
- Mobile application testing
- Third-party service testing (MongoDB Atlas infrastructure)
- Load testing beyond 100 concurrent users

---

## 2. Test Objectives
1. Verify all API endpoints return correct status codes and response bodies
2. Validate JWT authentication and authorization on protected routes
3. Confirm input validation and boundary conditions are handled correctly
4. Ensure the UI renders correctly and user flows work end-to-end
5. Measure API response time under normal and peak load
6. Identify security vulnerabilities in authentication and input handling

---

## 3. Test Items
| Item | Version | Description |
|------|---------|-------------|
| Auth API | 1.0 | POST /api/auth/register, POST /api/auth/login |
| Exams API | 1.0 | GET/POST/DELETE /api/exams |
| Subjects API | 1.0 | GET/POST /api/subjects |
| SmartPlan API | 1.0 | POST /api/smartplan/generate |
| Study Planner UI | 1.0 | Subject search, plan generation, topic completion |
| Exam Planner UI | 1.0 | Exam creation, listing |
| Auth UI | 1.0 | Login and registration forms |

---

## 4. Testing Approach

### 4.1 Testing Levels
| Level | Description | Tools |
|-------|-------------|-------|
| Unit Testing | Individual functions and API endpoints | Jest + Supertest |
| Integration Testing | API + Database interaction | Jest + Supertest + MongoDB Memory Server |
| System Testing | End-to-end user flows | Selenium WebDriver |
| Performance Testing | API response time under load | Apache JMeter |
| Security Testing | Auth bypass, injection, XSS | OWASP ZAP |

### 4.2 Testing Types
- **Functional Testing** — verify features work as specified
- **Boundary Value Analysis** — test edge values (empty fields, max lengths, invalid dates)
- **Negative Testing** — invalid inputs, unauthorized access, missing tokens
- **Regression Testing** — re-run after each code change
- **Performance Testing** — response time, throughput, error rate under load

### 4.3 Testing Techniques
- **Black-box testing** for API and UI (no knowledge of internals)
- **White-box testing** for unit tests (code-level)
- **Equivalence Partitioning** for input validation tests
- **Boundary Value Analysis** for numeric fields (targetScore 0–100, days, hours)

---

## 5. Test Environment

### 5.1 Hardware
- Development Machine: MacOS, 8GB RAM minimum
- Test runs locally and against localhost server

### 5.2 Software
| Tool | Purpose | Cost |
|------|---------|------|
| Jest + Supertest | Unit & Integration testing | Free (Open Source) |
| MongoDB Memory Server | In-memory DB for tests | Free (Open Source) |
| Postman | API testing & collection | Free |
| Apache JMeter | Performance testing | Free (Open Source) |
| OWASP ZAP | Security testing | Free (Open Source) |
| Selenium WebDriver | UI automation | Free (Open Source) |
| Jenkins | CI/CD pipeline | Free (Open Source) |
| JIRA | Bug tracking | Free (up to 10 users) |

### 5.3 Test Data
- Test users created fresh per test run using MongoDB Memory Server
- Postman environment variables store tokens between requests
- JMeter uses CSV data files for parameterized load tests

---

## 6. Entry and Exit Criteria

### 6.1 Entry Criteria
- Backend server starts without errors
- Database connection is established
- All dependencies installed (`npm install`)
- Test environment variables configured

### 6.2 Exit Criteria
- All critical (P1) test cases pass
- No open P1 or P2 defects
- Code coverage ≥ 70% on backend
- Performance: 95th percentile response time < 500ms under 50 concurrent users
- Security: No high-severity vulnerabilities from OWASP ZAP scan

---

## 7. Test Deliverables
| Deliverable | Description |
|-------------|-------------|
| TEST_PLAN.md | This document |
| MANUAL_TEST_CASES.md | Manual test case specifications |
| Postman Collection | API test collection (JSON) |
| Jest Test Files | Automated unit/integration tests |
| JMeter Test Plan | Performance test plan (.jmx) |
| Bug Report | Defects logged in JIRA format |
| Test Summary Report | Final results after execution |

---

## 8. Risks and Mitigations
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| MongoDB Atlas unavailable | Low | High | Use MongoDB Memory Server for tests |
| ML service (Flask) not running | Medium | Medium | Mock ML responses in unit tests |
| JWT secret not set | Low | High | Validate .env before test run |
| Flaky async tests | Medium | Low | Use --runInBand, set 30s timeout |

---

## 9. Schedule
| Phase | Activity | Duration |
|-------|----------|----------|
| Phase 1 | Test planning & case design | 1 day |
| Phase 2 | Manual test execution | 1 day |
| Phase 3 | Automated test execution (Jest) | 1 day |
| Phase 4 | API testing (Postman) | 1 day |
| Phase 5 | Performance testing (JMeter) | 1 day |
| Phase 6 | Security testing (OWASP ZAP) | 1 day |
| Phase 7 | Bug reporting & test summary | 1 day |

---

## 10. Approvals
| Role | Name | Signature | Date |
|------|------|-----------|------|
| Test Lead | | | |
| Developer | | | |
| Project Manager | | | |
