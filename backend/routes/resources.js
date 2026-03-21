const express = require('express');
const router = express.Router();
const { getResources } = require('../controllers/resourcesController');

// GET /api/resources?topic=Arrays&subject=DSA
router.get('/', getResources);

module.exports = router;
