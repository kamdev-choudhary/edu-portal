const ExamTemplate = require("../models/examTemplate");
const Question = require("../models/questions");
const Batch = require("../models/batch");
const mongoose = require("mongoose");
const ExamAssigned = require("../models/examAssigned");
const ExamResponse = require("../models/examResponse");

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

module.exports.getExam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exam = await ExamAssigned.findById(id).populate({
      path: "exam",
      populate: {
        path: "questions",
      },
    });

    res.status(200).json(exam);
  } catch (error) {
    next(error);
  }
};

module.exports.getExams = async (req, res, next) => {
  try {
    const { id } = req.params;
    const objectId = new mongoose.Types.ObjectId(id);
    const exams = await ExamAssigned.find({ batchId: objectId });
    res.status(200).json(exams);
  } catch (error) {
    next(error);
  }
};

module.exports.AssignExamToBatch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const newAssignment = req.body;
    const { batchId } = newAssignment;

    // Fetch the exam template by ID
    const examTemp = await ExamTemplate.findById(id);

    if (!examTemp) {
      return res.status(404).json({ msg: "Exam template not found" });
    }

    // Check if the batchId already exists in the examAssigned array
    const alreadyAssigned = await ExamAssigned.find({ batchId: batchId });

    if (!alreadyAssigned) {
      const newExamAssigned = new ExamAssigned(newAssignment);
      newExamAssigned.exam = examTemp;
      newExamAssigned.examName = examTemp.examName;
      // newExamAssigned.save();
      res.status(200).json({ msg: "Saved Succesfully" });
    } else {
      res.status(200).json({ msg: "Already Assigned " });
    }
  } catch (error) {
    next(error);
  }
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

module.exports.getAllResponses = async (req, res, next) => {
  try {
    const { batchId, userId } = req.params;
    const examResponses = await ExamResponse.find({ scholarId: userId });
    res.status(200).json(examResponses);
  } catch (error) {
    next(error);
  }
};

module.exports.updateRemaingTime = async (req, res, next) => {
  try {
    const { examId, userId, remainingtime } = req.params;
    const examRes = await ExamResponse.findOne({
      examId: examId,
      scholarId: userId,
    });
    if (examRes) {
      examRes.remainingtime = remainingtime;
      await examRes.save();
      res.status(200).json({ msg: `Data saved upto ${remainingtime}` });
    } else {
      res.status(200).json({ msg: "Error updating Exam" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports.getExamResponse = async (req, res, next) => {
  try {
    const { userId, examId } = req.params;
    const myResponse = await ExamResponse.findOne({
      examId: examId,
      scholarId: userId,
    });
    if (!myResponse) {
      res.status(401).json({ msg: "Response not found" });
    } else {
      res.status(200).json(myResponse);
    }
  } catch (error) {
    next(error);
  }
};

module.exports.createResponse = async (req, res, next) => {
  try {
    const responseData = req.body;
    const newResponse = new ExamResponse(responseData);
    await newResponse.save();
    res.status(200).json({ msg: "Successfully created Response" });
  } catch (error) {
    next(error);
  }
};

module.exports.submitExam = async (req, res, next) => {
  try {
    const response = req.body;
    const newResponse = new ExamResponse(response);
    console.log(newResponse);
  } catch (error) {
    next(error);
  }
};
