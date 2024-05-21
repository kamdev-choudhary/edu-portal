const mongoose = require("mongoose");
const { Schema } = mongoose;

// Sub-schema for batch assignment with time slot
const batchAssignmentSchema = new Schema({
  batchName: {
    type: String,
  },
  batchId: {
    type: Schema.Types.ObjectId,
    ref: "Batch",
    required: true,
  },
  examDate: {
    type: String,
    required: true,
  },
  examStartTime: {
    type: String,
    require: true,
  },
  examEndTime: {
    type: String,
    required: true,
  },
});

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
  examAssigned: [batchAssignmentSchema], // Use the sub-schema here
});

// Function to format date, assumed to be already defined
function formatDate() {
  const date = new Date();
  return date.toISOString();
}

const ExamTemplate = mongoose.model("ExamTemplate", examTemplateSchema);

module.exports = ExamTemplate;
