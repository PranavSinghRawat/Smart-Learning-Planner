const { validationResult } = require('express-validator');
const Subject = require('../models/Subject');
const Exam = require('../models/Exam');

const getSubjects = async (req, res) => {
  try {
    const filter = { userId: req.user.id };
    if (req.query.examId) {
      filter.examId = req.query.examId;
    }

    const subjects = await Subject.find(filter)
      .populate('examId', 'examName examDate')
      .sort({ createdAt: -1 });

    res.status(200).json({ count: subjects.length, subjects });
  } catch (error) {
    console.error('Get Subjects Error:', error.message);
    res.status(500).json({ message: 'Server error while fetching subjects.' });
  }
};

const createSubject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { examId, subjectName, difficulty, isWeak } = req.body;

  try {
    const exam = await Exam.findOne({ _id: examId, userId: req.user.id });
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found or does not belong to you.' });
    }

    const subject = await Subject.create({
      userId: req.user.id,
      examId,
      subjectName,
      difficulty: difficulty || 'medium',
      isWeak: isWeak || false,
    });

    res.status(201).json({ message: 'Subject created successfully.', subject });
  } catch (error) {
    console.error('Create Subject Error:', error.message);
    res.status(500).json({ message: 'Server error while creating subject.' });
  }
};

module.exports = { getSubjects, createSubject };
