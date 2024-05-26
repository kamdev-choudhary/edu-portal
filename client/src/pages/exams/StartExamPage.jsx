import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Auth";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import ExamSingleCorrect from "./ExamSingleCorrect";
import ExamMultiCorrect from "./ExamMultiCorrect";
import CircleIcon from "@mui/icons-material/Circle";

// Import MUI Components
import {
  Avatar,
  IconButton,
  Button,
  Checkbox,
  Grid,
  Box,
  Typography,
  useMediaQuery,
  CircularProgress,
  Modal,
} from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";
import DehazeIcon from "@mui/icons-material/Dehaze";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

function Home() {
  const location = useLocation();
  const { batchId, userId, username } = useAuth();
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
  }, [userId]);

  const localExamResponse = JSON.parse(localStorage.getItem("response"));

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
  }, [userId]);

  useEffect(() => {
    if (!showInstruction) {
      // Enter full screen mode
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        // Firefox
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        // Chrome, Safari, and Opera
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        // IE/Edge
        elem.msRequestFullscreen();
      }

      // Add event listener for visibility change
      document.addEventListener("visibilitychange", handleVisibilityChange);

      // Add event listener for before unload
      window.addEventListener("beforeunload", handleBeforeUnload);

      // Add event listener for back button
      window.addEventListener("popstate", handleBackButton);

      // Cleanup event listeners on component unmount
      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener("popstate", handleBackButton);
      };
    }
  }, [!showInstruction]);

  const handleVisibilityChange = () => {
    // if (document.hidden) {
    //   alert(
    //     "You have attempted to switch tabs or minimize the window. Your exam will be terminated."
    //   );
    //   // Implement any additional logic such as logging the attempt or ending the exam
    // }
  };

  const handleBeforeUnload = (e) => {
    const confirmationMessage =
      "Are you sure you want to leave? Your exam will be terminated.";
    e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
    return confirmationMessage; // Gecko, WebKit, Chrome <34
  };

  const handleBackButton = (e) => {
    // Prevent the default action (navigation) and show an alert
    e.preventDefault();
    alert("You cannot go back during the exam. Your exam will be terminated.");
    // Optionally, you can also log the attempt or end the exam here
    window.history.pushState(null, null, window.location.pathname); // push the state again to prevent back navigation
  };

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
            <Box sx={{ display: "flex", justifyContent: "center", padding: 1 }}>
              <Typography>Read the Instructions carefully.</Typography>
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
                p: 1,
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
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        alignContent: "center",
                      }}
                    >
                      <Typography variant="body1">
                        Time Left : {formatTime(remainingTime)}
                      </Typography>
                      &nbsp;&nbsp;&nbsp;
                      <CircleIcon
                        sx={{ color: calculateColor(remainingTime) }}
                      />
                    </Box>

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
                {/* Questions */}
                <Box
                  sx={{ flex: "1 1 auto", overflow: "auto", p: "1rem 2rem" }}
                >
                  {questions &&
                    questions &&
                    currentQuestionIndex < questions.length && (
                      <>
                        {questions[currentQuestionIndex]?.questionType ===
                          "singleCorrect" && (
                          <ExamSingleCorrect
                            questions={questions}
                            currentQuestionIndex={currentQuestionIndex}
                          />
                        )}
                        {questions[currentQuestionIndex]?.questionType ===
                          "multiCorrect" && (
                          <ExamMultiCorrect
                            questions={questions}
                            currentQuestionIndex={currentQuestionIndex}
                          />
                        )}
                      </>
                    )}
                </Box>

                {/* Buttons */}
                <Box
                  sx={{
                    p: 2,
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={6} md={3}>
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
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      sm={6}
                      md={3}
                      sx={{
                        display: "flex",
                        justifyContent: !isLargeScreen && "right",
                      }}
                    >
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#800080",
                          color: "white",
                          textTransform: "none",
                          minWidth: 160,
                        }}
                      >
                        Mark for Review
                      </Button>
                    </Grid>
                    <Grid item xs={6} sm={6} md={3}>
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
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      sm={6}
                      md={3}
                      sx={{
                        display: "flex",
                        justifyContent: !isLargeScreen && "right",
                      }}
                    >
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
                    </Grid>
                    {!isLargeScreen && (
                      <Grid item xs={12} md={12} lg={12}>
                        <Button fullWidth variant="contained">
                          Submit
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Box>
            </Box>
            {/* Sidepanel */}
            {isLargeScreen && (
              <Box
                sx={{
                  minWidth: 350,
                  padding: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  border: "1px solid rgba(0,0,0,0.2)",
                  borderRadius: 2,
                  margin: 1,
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    p: 1,
                    border: "1px solid rgba(0,0,0,0.2)",
                    borderRadius: 1,
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <Typography>
                    <strong>Name:</strong> {username}
                  </Typography>
                </Box>
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
                <Button
                  sx={{ textTransform: "none" }}
                  variant="outlined"
                  onClick={() => setShowInstructionsBox(true)}
                >
                  Show Instructions <InfoIcon />
                </Button>
                {/* Question Details */}
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
                      questions.map((question, index) => {
                        const storedResponses = JSON.parse(
                          localStorage.getItem("response")
                        );
                        const hasResponse = storedResponses?.response?.filter(
                          (response) => response.questionId === question._id
                        );

                        console.log(hasResponse);

                        return (
                          <Grid item key={index}>
                            <Avatar
                              sx={{
                                bgcolor:
                                  hasResponse.length > 0 &&
                                  hasResponse[0]?.answer.length > 0
                                    ? "#28844f"
                                    : "#e0e0e0",
                                height: 35,
                                border:
                                  currentQuestionIndex !== index
                                    ? "#28844f"
                                    : "2px solid rgba(255,0,0,1)",
                                width: 35,
                                cursor: "pointer",
                              }}
                              onClick={() => setCurrentQuestionIndex(index)}
                            >
                              {index + 1}
                            </Avatar>
                          </Grid>
                        );
                      })}
                  </Grid>
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "95%",
                    padding: 1,
                    backgroundColor: "#fff",
                    borderTop: "1px solid rgba(0,0,0,0.2)",
                  }}
                >
                  <Button
                    sx={{
                      textTransform: "none",
                      width: "100%",
                    }}
                    variant="outlined"
                    // onClick={handleSubmitExam}
                  >
                    Submit Exam
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Confirmation Dialog for start exam*/}
      <ConfirmationDialog
        open={showExamStartConfirmation}
        header={"Confirmation"}
        message={"Confirm Start Exam"}
        handleConfirm={handleStartExam}
        handleClose={() => setShowExamStartConfirmation(false)}
      />

      {/* Modal for Instruction Box */}
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

      {/* Modal for section */}
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
