require("dotenv").config();
const mongoose = require("mongoose");
const url = process.env.DB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected to Mongoose Database");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
