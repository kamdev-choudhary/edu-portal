const mongoose = require("mongoose");
const initdata = require("./lectureData.js");
const academicData = require("./academicData.js");
const Lecture = require("../models/lectures.js");
const Academic = require("../models/academic.js");
require("dotenv").config();

dbUrl = process.env.DB_URL;

main()
  .then(() => {
    console.log(`conneted to DB Atlas`);
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
  // await Lecture.deleteMany({});
  // await Lecture.insertMany(initdata.data);
  // await Academic.deleteMany({});
  // await Academic.insertMany(academicData.data);
  console.log(`data was initialised`);
};

initDB();
