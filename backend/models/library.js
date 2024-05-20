const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const librarySchema = new Schema({
  bookId: Number,
  title: String,
  author: String,
  subject: String,
  class: String,
  category: String,
  publishingYear: String,
  codes: [
    {
      type: String,
    },
  ],
  quantity: Number,
  issued: Number,
  available: Number,
});

const Library = mongoose.model("Library", librarySchema);

module.exports = Library;
