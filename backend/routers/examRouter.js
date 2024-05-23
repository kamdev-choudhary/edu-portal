const express = require("express");
const router = express(express.Router);
const examController = require("../controllers/examController");

router.route("/addtotemplate").put(examController.addToTemplate);
router.route("/createtemplate").put(examController.createTemplate);
router.route("/").get(examController.viewExams);
router.route("/templates/:id").get(examController.viewExamTemplate);
router.route("/assigntobatch/:id").post(examController.AssignExamToBatch);
router.route("/start/:id").get(examController.getExam);
router.route("/:id").get(examController.getExams);

router.route("/addtobatch").post(examController.addToBatch);
module.exports = router;
