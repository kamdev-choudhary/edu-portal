const express = require("express");
const app = express();
const router = express.Router();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
const Lecture = require("../models/lectures.js");
const flash = require("connect-flash");
const session = require("express-session");
const wrapAsync = require("../utils/wrapAsync.js");
// const wrapAsync = require("../utils/wrapAsync.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(__dirname + "/public"));

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 1000,
    maxAge: 1000 * 60 * 60 * 24 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const syllabuses = await Lecture.aggregate([
      {
        $group: {
          _id: {
            class: "$class",
            subject: "$subject",
            chapter_name: "$chapter_name",
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          class: "$_id.class",
          subject: "$_id.subject",
          chapter_name: "$_id.chapter_name",
          count: 1,
        },
      },
      {
        $addFields: {
          sort_order: {
            $switch: {
              branches: [
                { case: { $eq: ["$subject", "Physics"] }, then: 1 },
                { case: { $eq: ["$subject", "Chemistry"] }, then: 2 },
                { case: { $eq: ["$subject", "Mathematics"] }, then: 3 },
                { case: { $eq: ["$subject", "Biology"] }, then: 4 },
              ],
              default: 5, // For any other subjects not listed, assign a higher value
            },
          },
        },
      },
      {
        $sort: {
          class: 1,
          sort_order: 1, // Sort by the custom sort_order field in ascending order
        },
      },
      {
        $project: {
          sort_order: 0, // Exclude the custom sort_order field from the final result
        },
      },
    ]);
    res.render("syllabus.ejs", { syllabuses });
  })
);

module.exports = router;
