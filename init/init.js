const mongoose = require("mongoose");
const initdata = require("./lectureData.js");
const Lecture = require("../models/lectures.js");

const mongo_url = "mongodb://127.0.0.1:27017/dakshana-edu";

main()
  .then(() => {
    console.log(`conneted to DB ${mongo_url}`);
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongo_url);
}

const initDB = async () => {
  await Lecture.deleteMany({});
  await Lecture.insertMany(initdata.data);
  console.log(`data was initialised`);
};

initDB();
