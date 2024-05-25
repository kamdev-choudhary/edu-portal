import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Auth";
import CurrentTime from "../../components/CurrentTime";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import StartExamButtonGroup from "../../components/StartExamButtonGroup";

// Import MUI Components
import {
  Avatar,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Container,
  Paper,
  Button,
  Checkbox,
  Grid,
  Box,
  Typography,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

function Home() {
  const location = useLocation();
  const { batchId, userId } = useAuth();
  const [pathSegments, setPathSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState([]);
  const [showInstruction, setShowInstructions] = useState(true);
  const [checkboxChecked, setCheckBoxChecked] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [value, setValue] = useState("");
  const [examAssigned, setExamAssigned] = useState([]);
  const [showExamStartConfirmation, setShowExamStartConfirmation] =
    useState(false);
  const [remainingTime, setRemainingTime] = useState(null);

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  const segments = location.pathname.split("/").filter((segment) => segment);
  // Getting Exam from Server
  useEffect(() => {
    setPathSegments(segments);
    const examId = segments[3];

    const getExam = async () => {
      try {
        const response = await axios.get(`${API_URL}/exams/start/${examId}`);
        if (response.status === 200) {
          setExam(response.data);
          setLoading(false);
          if (localStorage.getItem("examTemplateId") !== examId) {
            localStorage.setItem("examTemplateId", examId);
            localStorage.setItem(
              "questions",
              JSON.stringify(response.data.exam.questions)
            );
            localStorage.setItem(
              "remainingTime",
              response.data.examDuration * 60
            );
          }
          setExamAssigned(
            response?.data?.examAssigned?.filter(
              (examAssign) => examAssign.batchId === batchId
            )[0]
          );
        }
      } catch (error) {
        console.error("Error fetching exam:", error);
      }
    };
    getExam();
  }, []);

  // Getting the Questions from Local Storage
  useEffect(() => {
    const questionsString = localStorage.getItem("questions");
    if (questionsString) {
      try {
        const questions = JSON.parse(questionsString);
        const sortedQuestions = questions.sort((a, b) => {
          if (a.text < b.text) return -1;
          if (a.text > b.text) return 1;
          return 0;
        });

        setQuestions(sortedQuestions);
      } catch (error) {
        console.error("Error parsing questions from localStorage:", error);
      }
    }
  }, []);

  function startCountdown() {
    let remainingTimeInLs =
      parseInt(localStorage.getItem("remainingTime"), 10) || 0;

    const intervalId = setInterval(async () => {
      if (remainingTimeInLs > 0) {
        remainingTimeInLs -= 1;
        localStorage.setItem("remainingTime", remainingTimeInLs);
        setRemainingTime(remainingTimeInLs);
        try {
          await axios.get(
            `${API_URL}/exams/start/updatetime/${segments[3]}/${segments[2]}/${remainingTimeInLs}`
          );
        } catch (error) {
          console.log(error);
        }
      } else {
        clearInterval(intervalId);
        console.log("Countdown finished.");
      }
    }, 1000);
  }

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  // Exam Stating
  const handleExamStartConfirmation = () => {
    setShowExamStartConfirmation(true);
  };
  const handleStartExam = () => {
    setShowExamStartConfirmation(false);
    setShowInstructions(false);
    startCountdown();
  };

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  const calculateColor = (remainingTime) => {
    const percentage = (remainingTime / (exam.examDuration * 60)) * 100;
    const hue = (percentage / 100) * 120;
    return `hsl(${hue}, 100%, 50%)`;
  };

  if (loading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", minHeight: "100vh" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Container maxWidth="lg">
        <Paper elevation={6} sx={{ height: "100vh" }}>
          {showInstruction ? (
            <Box
              sx={{ height: "100vh", display: "flex", flexDirection: "column" }}
            >
              <Box
                sx={{
                  flex: "0 0 auto",
                  bgcolor: "#28844f",
                  color: "white",
                  p: 1,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <h3>{exam.examName}</h3>
              </Box>
              <Box sx={{ flex: "1 1 auto", overflow: "auto", p: "1rem 2rem" }}>
                <div>
                  <Typography variant="h5">Paper Instructions</Typography>
                  <Box>
                    <Typography
                      dangerouslySetInnerHTML={{
                        __html: exam.exam.examInstruction,
                      }}
                    />
                  </Box>
                </div>
              </Box>

              <Box
                sx={{
                  flex: "0 0 auto",
                  p: 3,
                  marginBottom: 1,
                }}
              >
                <Grid container>
                  <Grid item xs={12} lg={9}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={() => setCheckBoxChecked(!checkboxChecked)}
                    >
                      <Checkbox
                        checked={checkboxChecked}
                        onChange={() => setCheckBoxChecked(!checkboxChecked)}
                      />
                      <Typography>I have read all the instructions</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} lg={3}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        disabled={!checkboxChecked}
                        onClick={handleExamStartConfirmation}
                        variant="contained"
                        sx={{ textTransform: "none" }}
                      >
                        Start Exam
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          ) : (
            <Box sx={{ height: "98%", display: "flex" }}>
              {!isLargeScreen && (
                <Box>
                  <Box
                    sx={{
                      borderRadius: 2,
                      border: "1px solid rgba(0,0,0,0.2)",
                      padding: 2,
                      backgroundColor: calculateColor(remainingTime),
                      color: "#fff",
                    }}
                  >
                    Remaining Time: {formatTime(remainingTime)}
                  </Box>
                </Box>
              )}
              <Box sx={{ height: "100%", width: "20px", flexGrow: 1 }}>
                <Box
                  sx={{
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    borderRight: "1px solid rgba(0,0,0,0.5)",
                  }}
                >
                  <Box
                    sx={{
                      flex: "0 0 auto",
                      bgcolor: "#28844f",
                      color: "white",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <h4>{exam.examName}</h4>
                  </Box>
                  <Box
                    sx={{ flex: "1 1 auto", overflow: "auto", p: "1rem 2rem" }}
                  >
                    {questions &&
                      questions &&
                      currentQuestionIndex < questions.length && (
                        <>
                          <Typography>Question : </Typography>
                          <Typography
                            dangerouslySetInnerHTML={{
                              __html:
                                questions[currentQuestionIndex].questionText,
                            }}
                          />
                          <hr />
                          <FormControl>
                            <FormLabel id="demo-controlled-radio-buttons-group">
                              Options
                            </FormLabel>
                            <RadioGroup
                              aria-labelledby="demo-controlled-radio-buttons-group"
                              name="controlled-radio-buttons-group"
                              value={value}
                              onChange={handleChange}
                            >
                              <FormControlLabel
                                value={
                                  questions[currentQuestionIndex].option1
                                    .isCorrect
                                }
                                control={<Radio />}
                                label={
                                  questions[currentQuestionIndex].option1.text
                                }
                              />
                              <FormControlLabel
                                value={
                                  questions[currentQuestionIndex].option2
                                    .isCorrect
                                }
                                control={<Radio />}
                                label={
                                  questions[currentQuestionIndex].option2.text
                                }
                              />
                              <FormControlLabel
                                value={
                                  questions[currentQuestionIndex].option3
                                    .isCorrect
                                }
                                control={<Radio />}
                                label={
                                  questions[currentQuestionIndex].option3.text
                                }
                              />
                              <FormControlLabel
                                value={
                                  questions[currentQuestionIndex].option4
                                    .isCorrect
                                }
                                control={<Radio />}
                                label={
                                  questions[currentQuestionIndex].option4.text
                                }
                              />
                            </RadioGroup>
                          </FormControl>
                        </>
                      )}
                  </Box>
                  {/* Buttons */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      p: 2,
                      marginBottom: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#000",
                        color: "white",
                        textTransform: "none",
                        minWidth: 160,
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#800080",
                        color: "white",
                        textTransform: "none",
                        minWidth: 160,
                      }}
                    >
                      Mark for review and Next
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handlePreviousQuestion}
                      sx={{ textTransform: "none", minWidth: 160 }}
                      disabled={
                        !exam.exam || !questions || currentQuestionIndex === 0
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleNextQuestion}
                      sx={{
                        textTransform: "none",
                        minWidth: 160,
                      }}
                      disabled={
                        !exam.exam ||
                        !questions ||
                        currentQuestionIndex === questions.length - 1
                      }
                    >
                      Next
                    </Button>
                  </Box>
                </Box>
              </Box>
              {isLargeScreen && (
                <Box
                  sx={{
                    height: "100%",
                    minWidth: 350,
                    padding: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: 2,
                      border: "1px solid rgba(0,0,0,0.2)",
                      padding: 2,
                      backgroundColor: calculateColor(remainingTime),
                      color: "#fff",
                    }}
                  >
                    Remaining Time: {formatTime(remainingTime)}
                  </Box>
                  <Box
                    sx={{
                      borderRadius: 2,
                      border: "1px solid rgba(0,0,0,0.2)",
                      padding: 2,
                    }}
                  >
                    <Typography>Question Details</Typography>
                    <hr />
                    <Grid container spacing={1} sx={{}}>
                      {questions &&
                        questions.map((question, index) => (
                          <Grid item key={index}>
                            <Avatar
                              alt="Remy Sharp"
                              src="/broken-image.jpg"
                              sx={{
                                bgcolor:
                                  currentQuestionIndex === index
                                    ? "#28844f"
                                    : undefined,
                                height: 35,
                                width: 35,
                                cursor: "pointer",
                              }}
                              onClick={() => setCurrentQuestionIndex(index)}
                            >
                              {index + 1}
                            </Avatar>
                          </Grid>
                        ))}
                    </Grid>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Paper>
      </Container>
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={showExamStartConfirmation}
        header={"Confirmation"}
        message={"Confirm Start Exam"}
        handleConfirm={handleStartExam}
        handleClose={() => setShowExamStartConfirmation(false)}
      />
    </>
  );
}

export default Home;
