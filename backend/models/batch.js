const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const batchSchema = new Schema({
  batchName: {
    type: String,
    required: true,
  },
  batchClass: String,
  batchStream: String,
  batchYear: String,
  scholars: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  examTemplates: [
    {
      type: Schema.Types.ObjectId,
      ref: "ExamTemplate",
    },
  ],
  slots: [
    {
      examTemplateId: String,
      examDate: String,
      examStartTime: String,
      examEndTime: String,
    },
  ],
});

const Batch = mongoose.model("Batch", batchSchema);

module.exports = Batch;
