const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const examResponsesSchema = new Schema({
  examID: String,
  scholrId: String,
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

const ExamResponse = mongoose.model("ExamResponse", examResponsesSchema);

module.exports = ExamResponse;
