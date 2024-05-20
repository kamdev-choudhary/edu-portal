const mongoose = require("mongoose");

const subtopicSchema = new mongoose.Schema({
  name: {
    type: String,
  },
});

const topicSchema = new mongoose.Schema({
  className: String,
  name: {
    type: String,
  },
  subtopics: [subtopicSchema],
});

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  topics: [topicSchema],
});

const academicSchema = new mongoose.Schema({
  classes: [
    {
      type: String,
    },
  ],
  subjects: [subjectSchema],
  difficultyLevel: [{ type: String }],
  timeRequired: [{ type: String }],
  target: [{ type: String }],
});

const Academic = mongoose.model("Academic", academicSchema);

module.exports = Academic;
