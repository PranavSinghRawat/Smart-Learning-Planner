const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    examName: {
      type: String,
      required: [true, 'Exam name is required'],
      trim: true,
      maxlength: [150, 'Exam name cannot exceed 150 characters'],
    },
    examDate: {
      type: Date,
      required: [true, 'Exam date is required'],
    },
    targetScore: {
      type: Number,
      min: [0, 'Target score cannot be negative'],
      max: [100, 'Target score cannot exceed 100'],
      default: 80,
    },
    subjects: {
      type: [String],
      default: [],
    },
    weakTopics: {
      type: [String],
      default: [],
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exam', ExamSchema);
