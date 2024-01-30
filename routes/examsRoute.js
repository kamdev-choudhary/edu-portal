const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
const flash = require("connect-flash");
const session = require("express-session");

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

router.get("/", (req, res) => {
  res.render("exams.ejs");
});

module.exports = router;
