import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Auth";
import ConfirmationDialog from "../../components/ConfirmationDialog";

// Import MUI Components
import {
  Avatar,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  IconButton,
  Button,
  Checkbox,
  Grid,
  Box,
  Typography,
  useMediaQuery,
  CircularProgress,
  Modal,
  Container,
} from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";
import DehazeIcon from "@mui/icons-material/Dehaze";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

function Home() {
  const location = useLocation();
  const { batchId, userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState([]);
  const [showInstruction, setShowInstructions] = useState(true);
  const [showInstructionBox, setShowInstructionsBox] = useState(false);
  const [showSectionBox, setShowSectionBox] = useState(false);
  const [checkboxChecked, setCheckBoxChecked] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [value, setValue] = useState("");
  const [examAssigned, setExamAssigned] = useState([]);
  const [showExamStartConfirmation, setShowExamStartConfirmation] =
    useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const [examResponse, setExamResponse] = useState([]);
  const [newResponse, setNewResponse] = useState({
    examId: "",
    scholarId: "",
    examStatus: "started Not Submit",
  });

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const segments = location.pathname.split("/").filter((segment) => segment);

  // Getting Exam from Server
  useEffect(() => {
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

    // Get response
    const getResponse = async () => {
      const response = await axios.get(
        `${API_URL}/exams/start/response/${userId}/${examId}`
      );
      if (response.status === 200) {
        setExamResponse(response.data);
        if (localStorage.getItem("examTemplateId") !== examId) {
          localStorage.setItem("response", JSON.stringify(response.data));
        }
      }
    };

    getExam();
    getResponse();
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

  // Submit Exam
  const submitExam = () => {
    console.log("Exam Submit");
  };

  // Countdown function
  function startCountdown() {
    let remainingTimeInLs =
      parseInt(localStorage.getItem("remainingTime"), 10) || 0;

    const intervalId = setInterval(async () => {
      if (remainingTimeInLs > 0) {
        remainingTimeInLs -= 1;
        localStorage.setItem("remainingTime", remainingTimeInLs);
        setRemainingTime(remainingTimeInLs);

        // Updating Remaining Time
        try {
          await axios.get(
            `${API_URL}/exams/start/updatetime/${segments[3]}/${segments[2]}/${remainingTimeInLs}`
          );
        } catch (error) {
          console.log(error);
        }
      } else {
        clearInterval(intervalId);
        submitExam();
      }
    }, 1000);
  }

  // Handle Input changes
  const handleInputChanges = () => {
    console.log(handleInputChanges);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  // Handle Question changes
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  // Create Response
  const handleCreateResponse = async () => {
    const newResponseData = newResponse;
    newResponseData.examId = segments[3];
    newResponseData.scholarId = userId;
    const response = await axios.post(
      `${API_URL}/exams/start/createresponse`,
      newResponseData
    );
    if (response.status === 200) {
      console.log("response created Succeefully");
    }
  };

  // Exam Start Confirmation
  const handleExamStartConfirmation = () => {
    setShowExamStartConfirmation(true);
  };

  // Exam Start
  const handleStartExam = () => {
    setShowExamStartConfirmation(false);
    setShowInstructions(false);
    startCountdown();
    handleCreateResponse();
  };

  // Resume exam
  const handleResumeExam = () => {
    setShowExamStartConfirmation(false);
    setShowInstructions(false);
    startCountdown();
  };

  // Format time in HH:MM:SS
  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  // Color Change for Time
  const calculateColor = (remainingTime) => {
    const percentage = (remainingTime / (exam.examDuration * 60)) * 100;
    const hue = (percentage / 100) * 120;
    return `hsl(${hue}, 100%, 50%)`;
  };

  // Loading ELement
  if (loading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", minHeight: "100vh" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  console.log(JSON.parse(localStorage.getItem("response")));
  return (
    <>
      <Box sx={{ height: "100%", width: "100vw" }}>
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
              <Typography sx={{ fontWeight: "800", fontSize: 22 }}>
                {exam.examName}
              </Typography>
            </Box>
            <Box
              sx={{
                flex: "0 0 auto",
                bgcolor: "#e0e0e0",
                p: 1,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Typography>Instructions</Typography>
            </Box>
            <Box sx={{ flex: "1 1 auto", overflow: "auto", p: "1rem 2rem" }}>
              <Typography variant="h5">Paper Instructions</Typography>
              <div>
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
              <Grid container gap={2}>
                <Grid item xs={12} lg={8}>
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
                    <Typography>I have read all the instructions.</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} lg={3}>
                  <Box
                    sx={{
                      display: "flex",
                      width: "100%",
                      justifyContent: isLargeScreen ? "flex-end" : "center",
                    }}
                  >
                    {examResponse.examStatus === "started Not Submit" ? (
                      <Button
                        disabled={!checkboxChecked}
                        onClick={handleResumeExam}
                        variant="contained"
                        sx={{ textTransform: "none" }}
                      >
                        Resume Exam
                      </Button>
                    ) : (
                      <Button
                        disabled={!checkboxChecked}
                        onClick={handleExamStartConfirmation}
                        variant="contained"
                        sx={{ textTransform: "none" }}
                      >
                        Start Exam
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              height: "100vh",
              display: "flex",
            }}
          >
            <Box sx={{ height: "100%", width: "20px", flexGrow: 1 }}>
              <Box
                sx={{
                  height: "98vh",
                  display: "flex",
                  flexDirection: "column",
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
                {!isLargeScreen && (
                  <Box
                    sx={{
                      flex: "0 0 auto",
                      bgcolor: "#e0e0e0",
                      display: "flex",
                      padding: "0 10px",
                      justifyContent: "space-between",
                    }}
                  >
                    <h4>Time Left : {formatTime(remainingTime)}</h4>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton onClick={() => setShowSectionBox(true)}>
                        <DehazeIcon />
                      </IconButton>
                      <IconButton onClick={() => setShowInstructionsBox(true)}>
                        <InfoIcon />
                      </IconButton>
                    </Box>
                  </Box>
                )}
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
                    Save & Next
                  </Button>
                </Box>
              </Box>
            </Box>
            {isLargeScreen && (
              <Box
                sx={{
                  minWidth: 350,
                  padding: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  border: "1px solid rgba(0,0,0,0.2)",
                  borderRadius: 2,
                  margin: 1,
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    borderRadius: 2,
                    border: `1px solid ${calculateColor(remainingTime)}`,
                    p: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#333",
                      fontSize: "1rem",
                    }}
                  >
                    Time Left: {formatTime(remainingTime)}
                  </Typography>
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
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 10,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button variant="contained" fullWidth>
                    Submit
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={showExamStartConfirmation}
        header={"Confirmation"}
        message={"Confirm Start Exam"}
        handleConfirm={handleStartExam}
        handleClose={() => setShowExamStartConfirmation(false)}
      />

      <Modal
        open={showInstructionBox}
        onClose={() => setShowInstructionsBox(false)}
        aria-labelledby="exam-instruction-modal"
        aria-describedby="exam-instruction-modal-showing-instuctions-for-exams"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxHeight: "60%",
            bgcolor: "background.paper",
            boxShadow: 24,
            overflow: "auto",
            borderRadius: 2,
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography>Instructions</Typography>
            <Button
              variant="contained"
              onClick={() => setShowInstructionsBox(false)}
              color="error"
              sx={{ textTransform: "none" }}
            >
              Close
            </Button>
          </Box>
          <hr />
          <Typography
            dangerouslySetInnerHTML={{
              __html: exam.exam.examInstruction,
            }}
          />
        </Box>
      </Modal>

      <Modal
        open={showSectionBox}
        onClose={() => setShowSectionBox(false)}
        aria-labelledby="exam-instruction-modal"
        aria-describedby="exam-instruction-modal-showing-instuctions-for-exams"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxHeight: "60%",
            bgcolor: "background.paper",
            boxShadow: 24,
            overflow: "auto",
            borderRadius: 2,
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography>Question Section</Typography>
            <Button
              variant="contained"
              onClick={() => setShowSectionBox(false)}
              color="error"
              sx={{ textTransform: "none" }}
            >
              Close
            </Button>
          </Box>
          <hr />
          <Typography
            dangerouslySetInnerHTML={{
              __html: exam.exam.examInstruction,
            }}
          />
        </Box>
      </Modal>
    </>
  );
}

export default Home;
