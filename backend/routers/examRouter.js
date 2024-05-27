const express = require("express");
const router = express(express.Router);
const examController = require("../controllers/examController");

router.route("/addtotemplate").put(examController.addToTemplate);
router.route("/createtemplate").put(examController.createTemplate);
router.route("/").get(examController.viewExams);
router.route("/templates/:id").get(examController.viewExamTemplate);
router.route("/assigntobatch/:id").post(examController.AssignExamToBatch);
router.route("/:id").get(examController.getExams);
router.route("/start/:id").get(examController.getExam);
router
  .route("/responses/all/:batchId/:userId")
  .get(examController.getAllResponses);
router
  .route("/start/updatetime/:examId/:userId/:remainingtime")
  .get(examController.updateRemaingTime);

router
  .route("/start/response/:userId/:examId")
  .get(examController.getExamResponse);

router.route("/start/createresponse").post(examController.createResponse);

router.route("/submit/:userId/:examId").post(examController.submitExam);

router.route("/addtobatch").post(examController.addToBatch);
module.exports = router;
