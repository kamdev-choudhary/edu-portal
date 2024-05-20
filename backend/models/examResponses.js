const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const examResponsesSchema = new Schema({
  examID: String,
  scholrId: String,
  examTemplate: {
    type: Schema.Types.ObjectId,
    ref: "ExamTemplate",
  },
});

const ExamResponse = mongoose.model("ExamResponse", examResponsesSchema);

module.exports = ExamResponse;
