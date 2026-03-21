const express = require('express');
const router = express.Router();
const { getResources, generateStudyPlan, generateSmartPlan } = require('../controllers/resourcesController');

// GET /api/resources?topic=Arrays&subject=DSA
router.get('/', getResources);

// POST /api/resources/plan
router.post('/plan', generateStudyPlan);

// POST /api/resources/smartplan
router.post('/smartplan', generateSmartPlan);

module.exports = router;
