const express = require('express');
const { body } = require('express-validator');
const protect = require('../middleware/auth');
const { getExams, createExam, deleteExam } = require('../controllers/examController');

const router = express.Router();

router.use(protect);

router.get('/', getExams);

router.post(
  '/',
  [
    body('examName').trim().notEmpty().withMessage('Exam name is required'),
    body('examDate').isISO8601().withMessage('Valid exam date is required (ISO 8601 format)'),
    body('targetScore')
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage('Target score must be between 0 and 100'),
    body('difficulty')
      .optional()
      .isIn(['easy', 'medium', 'hard'])
      .withMessage('Difficulty must be easy, medium, or hard'),
  ],
  createExam
);

router.delete('/:id', deleteExam);

module.exports = router;
