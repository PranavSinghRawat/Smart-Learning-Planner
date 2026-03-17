const express = require('express');
const protect = require('../middleware/auth');
const { generateSmartPlan } = require('../controllers/smartPlanController');

const router = express.Router();
router.use(protect);
router.post('/generate', generateSmartPlan);

module.exports = router;
