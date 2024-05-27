const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const responseSchema = new Schema({
  questionId: String,
  questionStatus: String,
  answer: [{ type: String }],
});

const examResponseSchema = new Schema({
  examId: String,
  scholarId: String,
  examTemplate: {
    type: Schema.Types.ObjectId,
    ref: "ExamTemplate",
  },
  examStatus: String,
  response: [responseSchema],
});

const ExamResponse = mongoose.model("ExamResponse", examResponseSchema);

module.exports = ExamResponse;
