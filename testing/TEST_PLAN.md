# Test Plan — Smart Learning Planner
**Document ID:** SLP-TP-001  
**Version:** 2.0  
**Date:** 2026-03-23  
**Standard Reference:** IEEE 829

---

## 1. Introduction

### 1.1 Purpose
This test plan describes the testing strategy, scope, resources, schedule, and deliverables for the Smart Learning Planner web application, prepared in accordance with IEEE 829.

### 1.2 Project Overview
Smart Learning Planner is a full-stack AI-powered study platform that allows users to:
- Register and authenticate securely (JWT)
- Generate personalized day-wise study plans for any subject via Groq LLaMA 3.3
- Get AI-generated hour-by-hour daily strategies (Smart Plan)
- Predict Day 8 study performance using an LSTM deep learning model
- Track progress with real-time charts and a study timer

**Tech Stack:**
- Frontend: React + Vite + Material UI, deployed on Vercel
- Backend: Node.js + Express.js + MongoDB Atlas, deployed on Render
- ML Service: Python Flask + scikit-learn (MLP) + custom LSTM predictor
- AI: Groq API with LLaMA 3.3 70B
- Auth: JWT (JSON Web Tokens) + bcrypt

### 1.3 Scope
**In Scope:**
- Backend REST API testing (Auth, Exams, Subjects, Resources/SmartPlan)
- Frontend functional testing (Landing, Auth, Study Planner, Smart Plan, AI Predictor)
- Performance testing on critical API endpoints
- Security testing on authentication and input handling
- Manual test case execution (24 TCs)
- Automated Jest tests (28 TCs)

**Out of Scope:**
- Mobile application testing
- Third-party infrastructure testing (MongoDB Atlas, Groq API, Vercel, Render)
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

| Item | Route | Description |
|------|-------|-------------|
| Auth API | POST /api/auth/register, POST /api/auth/login | Registration and login |
| Exams API | GET/POST/DELETE /api/exams | Exam CRUD |
| Subjects API | GET/POST /api/subjects | Subject CRUD |
| Resources API | GET /api/resources | Groq topic resources |
| Study Plan API | POST /api/resources/plan | Groq study plan generation |
| Smart Plan API | POST /api/resources/smartplan | Groq hour-by-hour schedule |
| LSTM Predictor | POST /predict (ML service :5002) | Day 8 performance prediction |
| Study Planner UI | — | Subject search, plan generation, topic completion, timer |
| Smart Plan UI | — | Day context, schedule display, back navigation |
| AI Predictor UI | — | Sliders, prediction result, data source detection |
| Auth UI | — | Login and registration forms |

---

## 4. Testing Approach

### 4.1 Testing Levels
| Level | Description | Tools |
|-------|-------------|-------|
| Unit Testing | Individual API endpoints | Jest + Supertest |
| Integration Testing | API + Database interaction | Jest + MongoDB Memory Server |
| System Testing | End-to-end user flows | Selenium WebDriver |
| Performance Testing | API response time under load | Apache JMeter |
| Security Testing | Auth bypass, injection | Manual + OWASP ZAP |

### 4.2 Testing Types
- Functional, Boundary Value Analysis, Negative, Regression, Performance, Security

### 4.3 Testing Techniques
- Black-box testing for API and UI
- White-box testing for unit tests
- Equivalence Partitioning and Boundary Value Analysis for input validation

---

## 5. Test Environment

| Tool | Purpose |
|------|---------|
| Jest + Supertest | Unit & Integration testing |
| MongoDB Memory Server | In-memory DB for tests |
| Postman / Newman | API testing |
| Apache JMeter | Performance testing |
| OWASP ZAP | Security testing |
| Selenium WebDriver | UI automation |

**Ports:** Backend :5001 · Frontend :5173 · ML Service :5002

---

## 6. Entry and Exit Criteria

### Entry Criteria
- Backend server starts without errors
- MongoDB connection established
- All dependencies installed
- GROQ_API_KEY set in backend/.env

### Exit Criteria
- All P1 test cases pass
- No open P1 or P2 defects
- Backend code coverage ≥ 70%
- 95th percentile response time < 500ms under 50 concurrent users

---

## 7. Test Deliverables
| Deliverable | File |
|-------------|------|
| Test Plan | TEST_PLAN.md |
| Manual Test Cases (24 TCs) | MANUAL_TEST_CASES.md |
| Postman Collection | postman/SLP_API_Tests.postman_collection.json |
| Jest Test Files (28 TCs) | backend/tests/ |
| JMeter Test Plan | jmeter/SLP_Performance_Test.jmx |
| Selenium UI Tests | selenium/ui_test.js |
| Bug Report | BUG_REPORT.md |
| Test Summary Report | TEST_SUMMARY_REPORT.md |

---

## 8. Risks and Mitigations
| Risk | Mitigation |
|------|------------|
| MongoDB Atlas unavailable | Use MongoDB Memory Server for tests |
| Groq API rate limit | Tests accept 200 or 500 for AI endpoints |
| ML service not running | Error message guides user to start it |
| JWT secret not set | Server guards at startup and exits |

---

## 9. Schedule
| Phase | Activity | Duration |
|-------|----------|----------|
| 1 | Test planning & case design | 1 day |
| 2 | Manual test execution | 1 day |
| 3 | Automated Jest tests | 1 day |
| 4 | API testing (Postman) | 1 day |
| 5 | Performance testing (JMeter) | 1 day |
| 6 | Security testing | 1 day |
| 7 | Bug reporting & summary | 1 day |
