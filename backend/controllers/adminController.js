const User = require("../models/user");
const Academic = require("../models/academic");

module.exports.users = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

module.exports.academicData = async (req, res, next) => {
  try {
    const academic = await Academic.find({});
    res.status(200).json({ academic });
  } catch (error) {
    next(error);
  }
};
