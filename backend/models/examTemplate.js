const mongoose = require("mongoose");
const { Schema } = mongoose;

const examTemplateSchema = new Schema({
  examId: String,
  examName: String,
  examPattern: String,
  examInstruction: String,
  createdAt: {
    type: String,
    default: formatDate(),
  },
  questionTypes: {
    singleCorrect: {
      totalQuestions: {
        type: Number,
        default: 0,
      },
      addedQuestions: Number,
      positiveMarks: {
        type: Number,
        default: 0,
      },
      negativeMarks: {
        type: Number,
        default: 0,
      },
      partialMarks: {
        type: Number,
        default: 0,
      },
    },
    multiCorrect: {
      totalQuestions: {
        type: Number,
        default: 0,
      },
      addedQuestions: Number,
      positiveMarks: {
        type: Number,
        default: 0,
      },
      negativeMarks: {
        type: Number,
        default: 0,
      },
      partialMarks: {
        type: Number,
        default: 1,
      },
    },
    integerType: {
      totalQuestions: {
        type: Number,
        default: 0,
      },
      addedQuestions: Number,
      positiveMarks: {
        type: Number,
        default: 0,
      },
      negativeMarks: {
        type: Number,
        default: 0,
      },
      partialMarks: {
        type: Number,
        default: 0,
      },
    },
  },
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
});

// Function to format date, assumed to be already defined
function formatDate() {
  const date = new Date();
  return date.toISOString();
}

const ExamTemplate = mongoose.model("ExamTemplate", examTemplateSchema);

module.exports = ExamTemplate;
