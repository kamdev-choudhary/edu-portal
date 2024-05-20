const express = require("express");
const router = express(express.Router);
const examController = require("../controllers/examController");

router.route("/addtotemplate").put(examController.addToTemplate);
router.route("/createtemplate").put(examController.createTemplate);
router.route("/").get(examController.viewExams);
router.route("/templates/:id").get(examController.viewExamTemplate);

router.route("/addtobatch").post(examController.addToBatch);
module.exports = router;
