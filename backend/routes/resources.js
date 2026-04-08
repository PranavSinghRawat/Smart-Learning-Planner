const express = require('express');
const router = express.Router();
const { getResources, generateStudyPlan, generateSmartPlan, generateQuiz, generateCodingChallenge } = require('../controllers/resourcesController');

// GET /api/resources?topic=Arrays&subject=DSA
router.get('/', getResources);
// POST /api/resources/plan
router.post('/plan', generateStudyPlan);
// POST /api/resources/smartplan
router.post('/smartplan', generateSmartPlan);
// POST /api/resources/quiz
router.post('/quiz', generateQuiz);
// POST /api/resources/coding-challenge
router.post('/coding-challenge', generateCodingChallenge);

module.exports = router;
