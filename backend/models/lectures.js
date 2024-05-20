const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lectureSchema = new Schema({
  class: String,
  subject: String,
  chapterName: String,
  lectureNumber: Number,
  videoId: String,
});

const Lecture = mongoose.model("Lectures", lectureSchema);

module.exports = Lecture;
