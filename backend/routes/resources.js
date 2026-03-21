const express = require('express');
const router = express.Router();
const { getResources, generateStudyPlan } = require('../controllers/resourcesController');

// GET /api/resources?topic=Arrays&subject=DSA
router.get('/', getResources);

// POST /api/resources/plan
router.post('/plan', generateStudyPlan);

module.exports = router;
