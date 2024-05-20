const Lecture = require("../models/lectures");

module.exports.viewLectures = async (req, res, next) => {
  try {
    const lectures = await Lecture.find({});
    res.status(200).json({ lectures });
  } catch (error) {
    next(error);
  }
};

module.exports.viewLecturesByClass = async (req, res, next) => {
  try {
    const { classname } = req.params;
    const lectures = await Lecture.find({ class: classname });
    res.status(200).json({ lectures });
  } catch (error) {
    next(error);
  }
};
