import React, { useEffect, useState } from "react";
import SingleCorrectQuestion from "../../components/SingleCorrectQuestion";
import MultiCorrectQuestion from "../../components/MultiCorrectQuestion";
import IntegerType from "../../components/IntegerType";
import ViewQuestion from "../../components/ViewQuestion";
import {
  Skeleton,
  Box,
  MenuItem,
  FormControl,
  FormControlLabel,
  Select,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Switch,
  Paper,
  OutlinedInput,
  InputAdornment,
  Fab,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  IconButton,
  Snackbar,
  Alert,
  Grid,
  Modal,
  Button,
  Typography,
} from "@mui/material";

import {
  Search as SearchIcon,
  Add as AddIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export default function QuestionBankPage() {
  const [error, setError] = useState("");
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currQuestion, setCurrentQuestion] = useState([]);
  const [examTemplates, setExamTemplates] = useState([]);
  const [questionInExamTemplate, setQuestionInExamTemplate] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [questionAddToTemplate, setQuestionAddToTemplate] = useState({
    questionId: "",
    examTemplateId: "",
  });

  const [academic, setAcademic] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [showQuestionTypeModal, setShowQuestionTypeModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showViewQuestion, setShowViewQuestion] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState({
    singleCorrect: false,
    multiCorrect: false,
    Integer: false,
  });
  const [searchInput, setSearchInput] = useState("");
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [filteredSubtopics, setFilteredSubtopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Snackbar
  const handleOpenSnackbar = () => {
    setOpenSuccessSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccessSnackbar(false);
  };

  const [filterData, setFilterData] = useState({
    classes: "",
    subject: "",
    topic: "",
    subtopic: "",
    difficultyLevel: "",
    timeRequired: "",
    target: "",
    examTemplates: "",
  });

  const handleFilterDataChange = (e) => {
    setFilterData({ ...filterData, [e.target.name]: e.target.value });
  };

  // Fetch Question Bank
  useEffect(() => {
    fetch(`${API_URL}/questionbank`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setQuestions(data.questions);
        setIsLoading(false);
      })
      .catch((error) => setError(error.message));

    fetch(`${API_URL}/exams`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setExamTemplates(data.examTemplates))
      .catch((error) => setError(error.message));

    fetch(`${API_URL}/academic`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setAcademic(data.academic[0]))
      .catch((error) => setError(error.message));
  }, [showQuestionModal, showQuestionTypeModal, refresh]);

  // Delete Question
  const handleDeleteQuestion = (question) => {
    fetch(`${API_URL}/questionbank`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(question),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setRefresh(!refresh);
  };

  const handleQuestionToTemplate = (Id) => {
    const updatedQuestionAddToTemplate = {
      ...questionAddToTemplate,
      questionId: Id,
      examTemplateId: selectedTemplate,
    };

    setQuestionAddToTemplate(updatedQuestionAddToTemplate);

    if (updatedQuestionAddToTemplate) {
      fetch(`${API_URL}/exams/addtotemplate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedQuestionAddToTemplate),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setSnackbarMessage(data);
          handleOpenSnackbar();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
    setRefresh(!refresh);
  };

  const handleChangeEditMode = () => {
    setEditMode(!editMode);
  };

  const handleShowViewQuestion = (question) => {
    setShowViewQuestion(!showViewQuestion);
    if (question) {
      setCurrentQuestion(question);
    }
  };
  const handleAddQuestion = (value) => {
    console.log(value);
    setShowQuestionModal({
      ...showQuestionModal,
      [value]: true,
    });
  };

  const handleCloseAddQuestion = (modalName) => {
    setShowQuestionModal({
      ...showQuestionModal,
      [modalName]: false,
    });
  };

  const addquestionInExamTemplate = (id) => {
    const qInTemp = examTemplates.filter((template) => template._id === id);
    setQuestionInExamTemplate(qInTemp[0].questions);
    setRefresh(!refresh);
  };

  const handleSelectedTemplate = (e) => {
    if (e.target.value !== "") {
      setSelectedTemplate(e.target.value);
      addquestionInExamTemplate(e.target.value);
    }
  };

  const clearSelectedTemplate = () => {
    setSelectedTemplate("");
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const filterdQuestions = questions.filter((question) =>
    Object.values(question).some(
      (field) =>
        (typeof field === "string" || typeof field === "number") &&
        field.toString().toLowerCase().includes(searchInput.toLowerCase())
    )
  );

  useEffect(() => {
    if (filterData.classes && filterData.subject) {
      const selectedSubjectData = academic.subjects.find(
        (subject) => subject.name === filterData.subject
      );
      if (selectedSubjectData) {
        const filteredTopics = selectedSubjectData.topics.filter(
          (topic) => topic.className === filterData.classes
        );
        setFilteredTopics(filteredTopics);
      }
    }
  }, [filterData.classes, filterData.subject, academic.subjects]);

  useEffect(() => {
    if (filteredTopics.length > 0) {
      const filteredSubtopics = filteredTopics
        .filter((topic) => !filterData.topic || topic.name === filterData.topic)
        .flatMap((topic) => topic.subtopics);
      setFilteredSubtopics(filteredSubtopics);
    }
  }, [filteredTopics, filterData.topic]);

  // Skeleton
  if (isLoading) {
    return (
      <>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4} lg={3}>
            <Skeleton
              sx={{ borderRadius: 10 }}
              variant="rectangular"
              height={40}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Skeleton
              sx={{ borderRadius: 10 }}
              variant="rectangular"
              height={40}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Skeleton
              sx={{ borderRadius: 10 }}
              variant="rectangular"
              height={40}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Skeleton
              sx={{ borderRadius: 10 }}
              variant="rectangular"
              height={40}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Skeleton
              sx={{ borderRadius: 10 }}
              variant="rectangular"
              height={40}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Skeleton
              sx={{ borderRadius: 10 }}
              variant="rectangular"
              height={40}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Skeleton
              sx={{ borderRadius: 10 }}
              variant="rectangular"
              height={40}
            />
          </Grid>
        </Grid>
        <br />
        <Skeleton sx={{ borderRadius: 10 }} variant="rectangular" height={5} />
        <br />
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={5}>
            <Skeleton
              sx={{ borderRadius: 10 }}
              variant="rectangular"
              height={40}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={2}>
            <Skeleton
              sx={{ borderRadius: 10 }}
              variant="rectangular"
              height={40}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={2}>
            <Skeleton
              sx={{ borderRadius: 10 }}
              variant="rectangular"
              height={40}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={3}>
            <Skeleton
              sx={{ borderRadius: 10 }}
              variant="rectangular"
              height={40}
            />
          </Grid>
        </Grid>
        <br />
        <Skeleton sx={{ borderRadius: 10 }} variant="rectangular" height={5} />
        <br />
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#28844f" }}>
              <TableRow>
                <TableCell align="center" className="text-white">
                  Question ID
                </TableCell>
                <TableCell align="center" className="text-white">
                  Queston
                </TableCell>
                <TableCell align="center" className="text-white">
                  View
                </TableCell>
                <TableCell align="center" className="text-white">
                  Approved
                </TableCell>
                <TableCell align="center" className="text-white">
                  Subject
                </TableCell>
                <TableCell align="center" className="text-white">
                  Topic
                </TableCell>
                <TableCell align="center" className="text-white">
                  SubTopic
                </TableCell>
                <TableCell align="center" className="text-white">
                  D Level
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Example skeleton rows */}
              {[...Array(10)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  {/* Add more skeleton cells as needed */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  }

  return (
    <>
      <Snackbar
        open={openSuccessSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Box>
        <Grid container spacing={1}>
          <Grid item xs={12} md={4} lg={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Class</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="classes"
                label="Class"
                value={filterData.classes}
                onChange={handleFilterDataChange}
              >
                {academic &&
                  academic.classes &&
                  academic.classes.map((classes, index) => (
                    <MenuItem key={index} value={classes}>
                      {classes}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Subject</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="subject"
                label="Subject"
                value={filterData.subject}
                onChange={handleFilterDataChange}
              >
                {academic &&
                  academic.subjects &&
                  academic.subjects.map((subject, index) => (
                    <MenuItem key={index} value={subject.name}>
                      {subject.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Topic</InputLabel>
              <Select
                labelId="Topic Selection"
                id="selectTopic"
                name="topic"
                label="topic"
                value={filterData.topic}
                onChange={handleFilterDataChange}
              >
                {filteredTopics &&
                  filteredTopics.map((topics, index) => (
                    <MenuItem key={index} value={topics.name}>
                      {topics.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Sub Topic</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="subtopic"
                label="subtopic"
                value={filterData.subtopic}
                onChange={handleFilterDataChange}
              >
                {filteredSubtopics.map((subTopic, index) => (
                  <MenuItem key={index} value={subTopic.name}>
                    {subTopic.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">
                Difficulty Level
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="difficultyLevel"
                label="difficultyLevel"
                value={filterData.difficultyLevel}
                onChange={handleFilterDataChange}
              >
                {academic &&
                  academic.difficultyLevel &&
                  academic.difficultyLevel.map((dLevel, index) => (
                    <MenuItem key={index} value={dLevel}>
                      {dLevel}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">
                Time Required
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="timeRequired"
                label="timeRequired"
                value={filterData.timeRequired}
                onChange={handleFilterDataChange}
              >
                {academic &&
                  academic.timeRequired &&
                  academic.timeRequired.map((time, index) => (
                    <MenuItem key={index} value={time}>
                      {time}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Target</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="target"
                label="target"
                value={filterData.target}
                onChange={handleFilterDataChange}
              >
                {academic &&
                  academic.target &&
                  academic.target.map((tget, index) => (
                    <MenuItem key={index} value={tget}>
                      {tget}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <hr />
      <Box sx={{ flexGrow: 1 }} padding={1}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6} lg={6}>
            <FormControl fullWidth size="small">
              <OutlinedInput
                sx={{ borderRadius: 10 }}
                id="outlined-adornment-amount"
                startAdornment={
                  <InputAdornment position="start">
                    Search <SearchIcon />
                  </InputAdornment>
                }
                value={searchInput}
                onChange={handleSearchInputChange}
              />
            </FormControl>
          </Grid>
          <Grid
            item
            xs={6}
            md={2}
            lg={1}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Fab
              size="small"
              color="primary"
              aria-label="add"
              onClick={() => setShowQuestionTypeModal(true)}
            >
              <AddIcon />
            </Fab>
          </Grid>
          <Grid
            item
            xs={6}
            md={1}
            lg={2}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FormControlLabel
              control={
                <Switch checked={editMode} onChange={handleChangeEditMode} />
              }
              label="Delete"
            />
          </Grid>

          <Grid item xs={12} md={3} lg={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Exam Group</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="examTemplate"
                label="Exam Group"
                value={selectedTemplate}
                onChange={handleSelectedTemplate}
                endAdornment={
                  selectedTemplate && (
                    <IconButton size="small" onClick={clearSelectedTemplate}>
                      <ClearIcon sx={{ marginRight: 2 }} />
                    </IconButton>
                  )
                }
              >
                {examTemplates.map((examTemplate, index) => (
                  <MenuItem key={index} value={examTemplate._id}>
                    {examTemplate.examName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <hr />
      <TableContainer component={Paper} style={{ maxHeight: "80vh" }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead className="bg bg-success sticky-top">
            <TableRow>
              <TableCell align="center" className="text-white">
                Question ID
              </TableCell>
              <TableCell align="center" className="text-white">
                Queston
              </TableCell>
              <TableCell align="center" className="text-white">
                View
              </TableCell>
              <TableCell align="center" className="text-white">
                Approved
              </TableCell>
              <TableCell align="center" className="text-white">
                Subject
              </TableCell>
              <TableCell align="center" className="text-white">
                Topic
              </TableCell>
              <TableCell align="center" className="text-white">
                SubTopic
              </TableCell>
              <TableCell align="center" className="text-white">
                D Level
              </TableCell>
              {editMode && (
                <TableCell className="text-white" align="center">
                  Delete
                </TableCell>
              )}
              {selectedTemplate && (
                <TableCell className="text-white" align="center">
                  Add to Group
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filterdQuestions.map((question, index) => (
              <TableRow
                key={question._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{question.questionId}</TableCell>
                <TableCell
                  dangerouslySetInnerHTML={{ __html: question.questionText }}
                />

                <TableCell align="center">
                  <Button
                    size="sm"
                    onClick={() => {
                      handleShowViewQuestion(question);
                    }}
                  >
                    View
                  </Button>
                </TableCell>
                <TableCell align="center">{question.isApproved}</TableCell>
                <TableCell align="center">{question.subject}</TableCell>
                <TableCell align="center">{question.topic}</TableCell>
                <TableCell align="center">{question.subtopic}</TableCell>
                <TableCell align="center">{question.difficultyLevel}</TableCell>
                {editMode && (
                  <TableCell align="center" scope="col" className="text-center">
                    <IconButton onClick={() => handleDeleteQuestion(question)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                )}
                {selectedTemplate && (
                  <TableCell scope="col" align="center" className="text-center">
                    {!questionInExamTemplate.includes(question._id) ? (
                      <Button
                        className="btn btn-outline-success"
                        onClick={() => handleQuestionToTemplate(question._id)}
                      >
                        Add
                      </Button>
                    ) : (
                      <Button className="btn btn-success" disabled>
                        Added
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={showQuestionTypeModal}
        onClose={() => setShowQuestionTypeModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "1px solid rgba(0,0,0,0.2)",
            borderRadius: 2,
            boxShadow: 10,
            p: 2,
          }}
        >
          <p style={{ position: "fixed", top: 0, left: 20, fontSize: 25 }}>
            Question Types
          </p>
          <Box
            fullWidth
            sx={{ display: "flex", justifyContent: "right", marginBottom: 2 }}
          >
            <Button
              onClick={() => setShowQuestionTypeModal(false)}
              variant="contained"
              color="error"
              sx={{ textTransform: "none", borderRadius: 10 }}
            >
              Close
            </Button>
          </Box>
          <Divider />
          <Box>
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleAddQuestion("singleCorrect")}
                >
                  <ListItemText primary="Single Correct Question" />
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText primary="Multi Correct Question" />
                </ListItemButton>
              </ListItem>
              <Divider />
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemText primary="Integer Correct Question" />
                </ListItemButton>
              </ListItem>
              <Divider />
            </List>
          </Box>
        </Box>
      </Modal>

      {/* Single Correct Modal */}
      <Modal
        open={showQuestionModal.singleCorrect}
        onClose={() =>
          setShowQuestionModal({ ...showQuestionModal, singleCorrect: false })
        }
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            backgroundColor: "#fff",
            height: "95vh",
            margin: "2.5vh 2.5vw",
            width: "95vw",
            padding: 2,
            overflow: "auto",
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h5">Single Correct Question</Typography>
            <Button
              color="error"
              variant="contained"
              sx={{
                textTransform: "none",
                borderRadius: 10,
              }}
              onClick={() =>
                setShowQuestionModal({
                  ...showQuestionModal,
                  singleCorrect: false,
                })
              }
            >
              Close
            </Button>
          </Box>
          <hr />
          <Box>
            <SingleCorrectQuestion />
          </Box>
        </Box>
      </Modal>
    </>
  );
}
