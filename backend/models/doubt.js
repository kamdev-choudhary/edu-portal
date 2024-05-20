const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doubtSchema = new Schema({
  postedBy: String,
  postedById: String,
  doubtQuestion: String,
  doubtPostedDate: {
    type: Date,
    default: Date.now,
  },
  doubtSolutions: [
    {
      postedBy: String,
      postedById: String,
      solution: String,
      solutionPostedDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Doubt = mongoose.model("Doubt", doubtSchema);

module.exports = Doubt;
