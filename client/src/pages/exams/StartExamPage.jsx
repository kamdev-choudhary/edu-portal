import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useAuth } from "../../Auth";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
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
} from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

function Home() {
  const location = useLocation();
  const { batchId } = useAuth();
  const [pathSegments, setPathSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState([]);
  const [showInstruction, setShowInstructions] = useState(true);
  const [checkboxChecked, setCheckBoxChecked] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [value, setValue] = useState("");
  const [examAssigned, setExamAssigned] = useState([]);

  console.log(exam);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  useEffect(() => {
    const segments = location.pathname.split("/").filter((segment) => segment);
    setPathSegments(segments);
    const examId = segments[3];

    const getExam = async () => {
      try {
        const response = await axios.get(`${API_URL}/exams/start/${examId}`);
        if (response.status === 200) {
          setExam(response.data);
          setLoading(false);
          setQuestions(response.data.questions);
          setExamAssigned(
            response?.data?.examAssigned?.filter(
              (examAssign) => examAssign.batchId === batchId
            )[0]
          );
        }
      } catch (error) {
        console.error("Error fetching exam:", error);
        // Handle the error as needed
      }
    };
    getExam();
  }, []);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    flexGrow: 1,
  }));

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
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
                        onClick={() => setShowInstructions(false)}
                        variant="contained"
                        sx={{ textTransform: "none", borderRadius: 10 }}
                      >
                        Start Exam
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          ) : (
            <Grid
              container
              spacing={1}
              sx={{ height: "100%", padding: "1rem 1rem 0 1rem" }}
            >
              <Grid
                item
                xs={12}
                sm={9}
                order={{ xs: 2, sm: 1 }}
                style={{ height: "100%", position: "relative" }}
              >
                {exam.exam &&
                  exam.exam.questions &&
                  currentQuestionIndex < exam.exam.questions.length && (
                    <>
                      <Typography>Question : </Typography>
                      <Typography
                        dangerouslySetInnerHTML={{
                          __html:
                            exam.exam.questions[currentQuestionIndex]
                              .questionText,
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
                              exam.exam.questions[currentQuestionIndex].option1
                                .text
                            }
                            control={<Radio />}
                            label={
                              exam.exam.questions[currentQuestionIndex].option1
                                .text
                            }
                          />
                          <FormControlLabel
                            value={
                              exam.exam.questions[currentQuestionIndex].option2
                                .text
                            }
                            control={<Radio />}
                            label={
                              exam.exam.questions[currentQuestionIndex].option2
                                .text
                            }
                          />
                          <FormControlLabel
                            value={
                              exam.exam.questions[currentQuestionIndex].option3
                                .text
                            }
                            control={<Radio />}
                            label={
                              exam.exam.questions[currentQuestionIndex].option3
                                .text
                            }
                          />
                          <FormControlLabel
                            value={
                              exam.exam.questions[currentQuestionIndex].option4
                                .text
                            }
                            control={<Radio />}
                            label={
                              exam.exam.questions[currentQuestionIndex].option4
                                .text
                            }
                          />
                        </RadioGroup>
                      </FormControl>
                    </>
                  )}
                <Stack
                  spacing={2}
                  padding={1}
                  direction="row"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    marginRight: 2,
                    marginBottom: 1,
                  }}
                >
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: "#000",
                      color: "white",
                      borderRadius: 100,
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: "#800080",
                      color: "white",
                      borderRadius: 100,
                    }}
                  >
                    Mark for review
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ borderRadius: 100 }}
                    onClick={handlePreviousQuestion}
                    disabled={
                      !exam || !exam.questions || currentQuestionIndex === 0
                    }
                  >
                    Previous
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ borderRadius: 100 }}
                    onClick={handleNextQuestion}
                    disabled={
                      !exam ||
                      !exam.questions ||
                      currentQuestionIndex === exam.questions.length - 1
                    }
                  >
                    Next
                  </Button>
                </Stack>
              </Grid>

              <Grid
                item
                xs={12}
                sm={3}
                order={{ xs: 1, sm: 2 }}
                style={{ width: "100%" }}
              >
                {isLargeScreen && (
                  <Box
                    sx={{
                      borderRadius: 2,
                      border: "1px solid rgba(0,0,0,0.2)",
                      padding: 2,
                    }}
                  >
                    Remaining Time :{" "}
                  </Box>
                )}
                <Accordion defaultExpanded={isLargeScreen} elevation={4}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <Typography>Question Details</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={1}>
                      {exam &&
                        exam.questions &&
                        exam.questions.map((question, index) => (
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
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          )}
        </Paper>
      </Container>
    </>
  );
}

export default Home;
