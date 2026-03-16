const express = require('express');
const { body } = require('express-validator');
const protect = require('../middleware/auth');
const { getSubjects, createSubject } = require('../controllers/subjectController');

const router = express.Router();

router.use(protect);

router.get('/', getSubjects);

router.post(
  '/',
  [
    body('examId').notEmpty().withMessage('examId is required'),
    body('subjectName').trim().notEmpty().withMessage('Subject name is required'),
    body('difficulty')
      .optional()
      .isIn(['easy', 'medium', 'hard'])
      .withMessage('Difficulty must be easy, medium, or hard'),
    body('isWeak').optional().isBoolean().withMessage('isWeak must be a boolean'),
  ],
  createSubject
);

module.exports = router;
