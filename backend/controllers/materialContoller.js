const Library = require("../models/library");

module.exports.viewLibrary = async (req, res, next) => {
  try {
    const books = await Library.find({});
    res.status(200).json({ books });
  } catch (error) {
    next(error);
  }
};

module.exports.saveNewBook = async (req, res, next) => {
  try {
    const newBook = new Library(req.body);
    newBook.file = req.body.file;
    newBook.save();
    res.status(200).json("Succesfully Saved");
  } catch (error) {
    next(error);
  }
};

module.exports.deleteBook = async (req, res, next) => {
  let { id } = req.params;
  try {
    const deleteBook = await Library.findOneAndDelete({ _id: id });
    res.status(200).json("Successfully deleted the book");
  } catch (error) {
    next(error);
  }
};
