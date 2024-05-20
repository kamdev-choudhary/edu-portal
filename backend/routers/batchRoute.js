const express = require("express");
const router = express(express.Router);
const batchController = require("../controllers/batchControlller");

router.route("/").get(batchController.viewBatch);

router.route("/:id").get(batchController.getCurrBatch);

router.route("/addnew").post(batchController.AddBatch);

module.exports = router;
