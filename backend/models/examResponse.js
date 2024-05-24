const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const examResponseSchema = new Schema({
  examId: String,
  scholarId: String,
  examTemplate: {
    type: Schema.Types.ObjectId,
    ref: "ExamTemplate",
  },
  examStatus: String,
  response: [
    {
      questionId: String,
      timeTaken: String,
      answer: [
        {
          type: String,
        },
      ],
    },
  ],
});

const ExamResponse = mongoose.model("ExamResponse", examResponseSchema);

module.exports = ExamResponse;
