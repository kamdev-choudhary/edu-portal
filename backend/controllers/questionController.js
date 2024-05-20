const Question = require("../models/questions");
const ExamTemplate = require("../models/examTemplate");

module.exports.viewQuestion = async (req, res, next) => {
  try {
    const questions = await Question.find({});
    res.status(200).json({ questions });
  } catch (error) {
    next(error);
  }
};

module.exports.saveQuestion = async (req, res) => {
  const newQuestion = new Question(req.body);
  let subject = req.body.subject;
  let preQuestionId = (subject) => {
    let qprefix;
    switch (subject.toLowerCase()) {
      case "physics":
        qprefix = 1000000;
        break;
      case "chemistry":
        qprefix = 2000000;
        break;
      case "mathematics":
        qprefix = 3000000;
        break;
      case "biology":
        qprefix = 4000000;
        break;
      default:
        qprefix = 500000;
        break;
    }
    return qprefix;
  };

  try {
    let maxQuestionId = await Question.aggregate([
      { $match: { subject: subject } },
      { $group: { _id: null, maxQuestionID: { $max: "$questionId" } } },
    ]);

    if (maxQuestionId.length > 0 && maxQuestionId[0].maxQuestionID !== null) {
      newQuestion.questionId = +maxQuestionId[0].maxQuestionID + 1;
    } else {
      newQuestion.questionId = +preQuestionId(subject) + 1;
    }
  } catch (error) {
    console.error("Error occurred while finding max question ID:", error);
  }
  await newQuestion.save();
  res.status(200).json("Data Saved Successfully");
};

// Delete Question

module.exports.deleteQuestion = async (req, res) => {
  try {
    const deletedQuestion = await Question.findOneAndDelete({
      _id: req.body._id,
    });

    // If no question was found and deleted, respond with an error
    if (!deletedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }

    for (const templateId of deletedQuestion.inTemplateId) {
      const template = await ExamTemplate.findById(templateId);
      if (template) {
        // Check if the question is present in the template
        const questionIndex = template.questions.findIndex((q) =>
          q.equals(deletedQuestion._id)
        );
        if (questionIndex !== -1) {
          // Remove the question from the template's questions array
          template.questions.splice(questionIndex, 1);

          // Update addedQuestions count based on question type
          switch (deletedQuestion.questionType) {
            case "singleCorrect":
              template.questionTypes.singleCorrect.addedQuestions--;
              break;
            case "multiCorrect":
              template.questionTypes.multiCorrect.addedQuestions--;
              break;
            case "integerType":
              template.questionTypes.integerType.addedQuestions--;
              break;
            default:
              break;
          }

          await template.save();
        }
      }
    }

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.updateQuestion = async (req, res, next) => {
  try {
    const question = await Question.findOneAndUpdate(
      { _id: req.body._id },
      req.body,
      { new: true }
    );
    res.status(200).json({ Success: "Question Updated Successfully" });
  } catch (error) {
    next(error);
  }
};
