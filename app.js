const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongo_url = "mongodb://127.0.0.1:27017/dakshana";
const exams = require("./routes/examsRoute.js");
const lectures = require("./routes/lecturesRoute.js");
const syllabus = require("./routes/syllabusRoute.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(__dirname + "/public"));

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

//Home Route
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.use("/syllabus", syllabus);
app.use("/exams", exams);
app.use("/lectures", lectures);

app.get("/dashboard", async (req, res) => {
  res.render("dashboard.ejs");
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
  //   res.status(statusCode).send(message);
});

app.listen(8080, (req, res) => {
  console.log("server is listening at port : 8080");
});
