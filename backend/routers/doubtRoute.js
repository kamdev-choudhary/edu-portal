const express = require("express");
const router = express(express.Router);
const doubtController = require("../controllers/doubtController");

router.route("/").get(doubtController.viewDoubts);

router.route("/new").post(doubtController.saveNewDoubt);

router
  .route("/:id")
  .post(doubtController.saveSolution)
  .delete(doubtController.deleteDoubt);

module.exports = router;
