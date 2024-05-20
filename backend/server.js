const express = require("express");
const app = express();
const connectDB = require("./utils/connectDB");
const errorMiddleware = require("./middlewares/error-middleware");
const cors = require("cors");
const bodyParser = require("body-parser");

const PORT = 5000;

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const authRouter = require("./routers/authRouter");
const lectureRouter = require("./routers/lectureRouter");
const questionRouter = require("./routers/questionRoute");
const materialRouter = require("./routers/materialRoute");
const adminRoute = require("./routers/adminRoute");
const examRouter = require("./routers/examRouter");
const batchRouter = require("./routers/batchRoute");
const academicRoute = require("./routers/academicRoute");
const doubtRoute = require("./routers/doubtRoute");

app.get("/", (req, res) => {
  res.status(200).send("This is Home Page");
});

app.use("/auth", authRouter);
app.use("/admin", adminRoute);
app.use("/lectures", lectureRouter);
app.use("/questionbank", questionRouter);
app.use("/materials", materialRouter);
app.use("/exams", examRouter);
app.use("/batch", batchRouter);
app.use("/academic", academicRoute);
app.use("/doubts", doubtRoute);

app.use("/*", (req, res) => {
  res.status(400).json("error from backend");
});

app.use(errorMiddleware);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening to Port : ${PORT}`);
  });
});
