const mongoose = require("mongoose");
const { Schema } = mongoose;
const ExamTemplate = require("./examTemplate");

// Sub-schema for batch assignment with time slot
const examAssignedSchema = new Schema({
  batchName: {
    type: String,
  },
  batchId: {
    type: Schema.Types.ObjectId,
    ref: "Batch",
    required: true,
  },
  examName: String,
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
  examDuration: {
    type: Number,
    default: 180,
  },
  exam: {
    type: Schema.Types.ObjectId,
    ref: "ExamTemplate",
  },
});

const ExamAssigned = mongoose.model("ExamAssigned", examAssignedSchema);

module.exports = ExamAssigned;
