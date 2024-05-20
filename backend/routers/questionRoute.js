const express = require("express");
const router = express(express.Router);
const questionController = require("../controllers/questionController");

router
  .route("/")
  .get(questionController.viewQuestion)
  .post(questionController.saveQuestion)
  .delete(questionController.deleteQuestion);

router.route("/update").put(questionController.updateQuestion);

module.exports = router;
