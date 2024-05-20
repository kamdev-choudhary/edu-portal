const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  classes: String,
  questionId: String,
  subject: String,
  topic: String,
  subtopic: String,
  difficultyLevel: String,
  questionType: String,
  timeRequired: String,
  target: String,
  isApproved: {
    type: String,
    default: "No",
  },
  questionText: String,
  option1: {
    text: String,
    isCorrect: Boolean,
  },
  option2: {
    text: String,
    isCorrect: Boolean,
  },
  option3: {
    text: String,
    isCorrect: Boolean,
  },
  option4: {
    text: String,
    isCorrect: Boolean,
  },
  correctAnswer: String,
  solution: String,
  inTemplateId: [
    {
      type: String,
    },
  ],
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
