const express = require("express");
const app = express();
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Lecture = require("../models/lectures.js");
const flash = require("connect-flash");
const session = require("express-session");

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
    const lectures = await Lecture.find({});
    res.render("lectures.ejs", { lectures });
  })
);

module.exports = router;
