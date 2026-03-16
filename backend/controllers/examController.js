const { validationResult } = require('express-validator');
const Exam = require('../models/Exam');

const getExams = async (req, res) => {
  try {
    const exams = await Exam.find({ userId: req.user.id }).sort({ examDate: 1 });
    res.status(200).json({ count: exams.length, exams });
  } catch (error) {
    console.error('Get Exams Error:', error.message);
    res.status(500).json({ message: 'Server error while fetching exams.' });
  }
};

const createExam = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { examName, examDate, targetScore } = req.body;

  try {
    const exam = await Exam.create({
      userId: req.user.id,
      examName,
      examDate,
      targetScore: targetScore ?? 80,
    });

    res.status(201).json({ message: 'Exam created successfully.', exam });
  } catch (error) {
    console.error('Create Exam Error:', error.message);
    res.status(500).json({ message: 'Server error while creating exam.' });
  }
};

module.exports = { getExams, createExam };
