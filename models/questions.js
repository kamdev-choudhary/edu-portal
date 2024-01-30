const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  questionID: Number,
  question_type: Number,
  subject: String,
  topic: String,
  Subtopic: String,
  Difficulty_level: String,
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
