const Doubt = require("../models/doubt");

module.exports.viewDoubts = async (req, res, next) => {
  try {
    const doubts = await Doubt.find({});
    res.status(200).json({ doubts });
  } catch (error) {
    next(error);
  }
};

module.exports.saveNewDoubt = async (req, res, next) => {
  try {
    const doubt = new Doubt(req.body);
    doubt.save();
    res.status(200).json("Successfully posted Doubt");
  } catch (error) {
    next(error);
  }
};

module.exports.saveSolution = async (req, res, next) => {
  const { id } = req.params;
  const solution = req.body;
  solution.solutionPostedDate = Date.now();
  try {
    const doubt = await Doubt.findById(id);
    doubt.doubtSolutions.push(req.body);
    doubt.save();

    res.status(200).json({ solution });
  } catch (error) {
    next(error);
  }
};

// Delete Doubt
module.exports.deleteDoubt = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDoubt = await Doubt.findOneAndDelete({ _id: id });
    res.status(200).json("Succefully Deleted Doubt");
  } catch (error) {
    next(error);
  }
};
