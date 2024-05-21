const ExamTemplate = require("../models/examTemplate");
const Question = require("../models/questions");
const Batch = require("../models/batch");

module.exports.createTemplate = async (req, res, next) => {
  try {
    const newTemplate = new ExamTemplate(req.body);
    const exam = await ExamTemplate.findOne({}, { examId: 1 }).sort({
      examId: -1,
    });
    const examId = exam ? exam.examId : null;
    newTemplate.examId = +examId + 1;
    await newTemplate.save();
    res.status(200).json("Template Created Successfully");
  } catch (error) {
    next(error);
  }
};

module.exports.AssignExamToBatch = async (req, res, next) => {
  const { id } = req.params;
  const examTemp = await ExamTemplate.findById(id);
  examTemp.examAssigned = req.body;
  examTemp.save();
  res.status(200).json({ msg: "Data Saved Succefully" });
};

module.exports.addToTemplate = async (req, res, next) => {
  let { questionId, examTemplateId } = req.body;
  try {
    let currTemplate = await ExamTemplate.findById(examTemplateId);
    let question = await Question.findById(questionId);

    if (!currTemplate.questions.some((q) => q.equals(question._id))) {
      switch (question.questionType) {
        case "singleCorrect":
          currTemplate.questionTypes.singleCorrect.addedQuestions++;
          break;
        case "multiCorrect":
          currTemplate.questionTypes.multiCorrect.addedQuestions++;
          break;
        case "integerType":
          currTemplate.questionTypes.integerType.addedQuestions++;
          break;
        default:
          break;
      }
      currTemplate.questions.push(question);
      await currTemplate.save();

      question.inTemplateId.push(currTemplate._id);
      question.save();
      res.status(200).json("Successfully Added to source");
    } else {
      res.status(200).json("Question already exists in the template");
    }
  } catch (error) {
    next(error);
  }
};

module.exports.viewExams = async (req, res, next) => {
  try {
    const examTemplates = await ExamTemplate.find({});
    res.status(200).json({ examTemplates });
  } catch (error) {
    next(error);
  }
};

module.exports.viewExamTemplate = async (req, res, next) => {
  let id = req.params.id;
  try {
    const examTemplate = await ExamTemplate.findById(id).populate({
      path: "questions",
    });
    res.status(200).json({ examTemplate });
  } catch (error) {
    next(error);
  }
};

module.exports.addToBatch = async (req, res, next) => {
  try {
    const examTemplate = await ExamTemplate.findById(req.body.examTemplateId);
    const batch = await Batch.findById(req.body.batchId);
    const newSlotData = {
      examTemplateId: req.body.examTemplateId,
      examDate: req.body.testDate,
      examStartTime: req.body.startTime,
      examEndTime: req.body.endTime,
    };
    batch.examTemplates.push(examTemplate);
    batch.slots.push(newSlotData);
    batch.save();
    examTemplate.save();
  } catch (error) {
    next(error);
  }
};
