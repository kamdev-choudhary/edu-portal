const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  bookId: Number,
  title: String,
  author: String,
  subject: String,
  class: String,
  category: String,
  publishingYear: String,
  file: Buffer,
});

const Book = mongoose.model("Library", bookSchema);

module.exports = Book;
