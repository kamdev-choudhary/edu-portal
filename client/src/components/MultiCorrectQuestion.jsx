import React, { useState, useEffect } from "react";
import { TinyBox, TinyBox2 } from "./TinyBox";
import {
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Box,
  Checkbox,
  Button,
  Grid,
  Typography,
  Stack,
  FormHelperText,
} from "@mui/material";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export default function MultiCorrectQuestion(props) {
  const [academic, setAcademic] = useState([]);
  const [error, setError] = useState("");
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [filteredSubtopics, setFilteredSubtopics] = useState([]);
  const [questionData, setQuestionData] = useState({
    classes: "",
    subject: "",
    topic: "",
    subtopic: "",
    questionType: "multiCorrect",
    questionText: "",
    option1: {
      text: "",
      isCorrect: false,
    },
    option2: {
      text: "",
      isCorrect: false,
    },
    option3: {
      text: "",
      isCorrect: false,
    },
    option4: {
      text: "",
      isCorrect: false,
    },
    solution: "",
  });

  const [validationError, setValidationError] = useState({
    classes: "",
    subject: "",
    topic: "",
    subtopic: "",
    questionText: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    solution: "",
  });

  useEffect(() => {
    if (props.selectedSubject) {
      setQuestionData((prevQuestionData) => ({
        ...prevQuestionData,
        subject: props.selectedSubject,
      }));
    }
    if (props.selectedClass) {
      setQuestionData((prevQuestionData) => ({
        ...prevQuestionData,
        classes: props.selectedClass,
      }));
    }
  }, [props.selectedClass, props.selectedSubject]); // Added props.selectedSubject as dependency

  useEffect(() => {
    fetch(`${API_URL}/academic`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setAcademic(data.academic[0]))
      .catch((error) => setError(error.message));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = "";

    switch (name) {
      case "classes":
        errorMessage = value ? "" : "Class is required";
        break;
      case "subject":
        errorMessage = value ? "" : "Subject is required";
        break;
      case "topic":
        errorMessage = value ? "" : "Topic is required";
        break;
      case "subtopic":
        errorMessage = value ? "" : "Subtopic is required";
        break;
      case "questionText":
        errorMessage = value ? "" : "Question is required";
        break;
      case "solution":
        errorMessage = value ? "" : "Solution is required";
        break;
      default:
        break;
    }
    setValidationError({
      ...validationError,
      [name]: errorMessage,
    });

    setQuestionData({
      ...questionData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      fetch(`${API_URL}/questionbank`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questionData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          props.handleCloseAddQuestion("multiCorrect");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      console.log("Validation failed");
    }
  };

  const validateForm = () => {
    let isValid = true;
    const NewError = {};
    for (const key in questionData) {
      if (!questionData[key]) {
        isValid = false;
        NewError[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`;
      } else {
        NewError[key] = "";
      }
    }
    setValidationError(NewError);
    return isValid;
  };

  useEffect(() => {
    if (questionData.classes && questionData.subject && academic.subjects) {
      const selectedSubjectData = academic.subjects.find(
        (subject) => subject.name === questionData.subject
      );
      if (selectedSubjectData) {
        const filteredTopics = selectedSubjectData.topics.filter(
          (topic) => topic.className === questionData.classes
        );
        setFilteredTopics(filteredTopics);
      }
    }
  }, [questionData.classes, questionData.subject, academic.subjects]);

  useEffect(() => {
    if (filteredTopics.length > 0) {
      const filteredSubtopics = filteredTopics
        .filter(
          (topic) => !questionData.topic || topic.name === questionData.topic
        )
        .flatMap((topic) => topic.subtopics);
      setFilteredSubtopics(filteredSubtopics);
    }
  }, [filteredTopics, questionData.topic]);

  const handleTinyBoxChange = (name, newContent) => {
    setQuestionData((prevQuestion) => ({
      ...prevQuestion,
      [name]: newContent,
    }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setQuestionData({
      ...questionData,
      [name]: {
        ...questionData[name],
        isCorrect: checked,
      },
    });
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} padding={1}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={4} lg={3}>
            <FormControl
              fullWidth
              size="small"
              error={Boolean(validationError.classes)}
            >
              <InputLabel id="demo-simple-select-label">Class</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="classes"
                label="Class"
                value={questionData.classes}
                onChange={handleInputChange}
              >
                {academic &&
                  academic.classes &&
                  academic.classes.map((classes, index) => (
                    <MenuItem key={index} value={classes}>
                      {classes}
                    </MenuItem>
                  ))}
              </Select>
              <FormHelperText>{validationError.classes}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <FormControl
              fullWidth
              size="small"
              error={Boolean(validationError.subject)}
            >
              <InputLabel id="demo-simple-select-label">Subject</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="subject"
                label="Subject"
                value={questionData.subject}
                onChange={handleInputChange}
              >
                {academic &&
                  academic.subjects &&
                  academic.subjects.map((subject, index) => (
                    <MenuItem key={index} value={subject.name}>
                      {subject.name}
                    </MenuItem>
                  ))}
              </Select>
              <FormHelperText>{validationError.subject}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <FormControl
              fullWidth
              size="small"
              error={Boolean(validationError.topic)}
            >
              <InputLabel id="demo-simple-select-label">Topic</InputLabel>
              <Select
                labelId="Topic Selection"
                id="selectTopic"
                name="topic"
                label="topic"
                value={questionData.topic}
                onChange={handleInputChange}
              >
                {filteredTopics &&
                  filteredTopics.map((topics, index) => (
                    <MenuItem key={index} value={topics.name}>
                      {topics.name}
                    </MenuItem>
                  ))}
              </Select>
              <FormHelperText>{validationError.topic}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <FormControl
              fullWidth
              size="small"
              error={Boolean(validationError.subtopic)}
            >
              <InputLabel id="demo-simple-select-label">Sub Topic</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="subtopic"
                label="subtopic"
                value={questionData.subtopic}
                onChange={handleInputChange}
              >
                {filteredSubtopics.length > 0 ? (
                  filteredSubtopics.map((subTopic, index) => (
                    <MenuItem key={index} value={subTopic.name}>
                      {subTopic.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No Subtopics available</MenuItem>
                )}
              </Select>
              <FormHelperText>{validationError.subtopic}</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <hr />
      <Box padding={1}>
        <Typography>Question</Typography>
        <TinyBox
          content={questionData.questionText}
          onContentChange={(newContent) =>
            handleTinyBoxChange("questionText", newContent)
          }
        />
        <FormHelperText>{validationError.questionText}</FormHelperText>
      </Box>
      <Box padding={1}>
        <Grid container spacing={1}>
          <Grid
            item
            xs={12}
            sm={1}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography>1</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={1}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Checkbox
              color="success"
              name="option1"
              checked={questionData.option1.isCorrect}
              onChange={(event) => handleCheckboxChange(event)}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={10}
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TinyBox2
              content={questionData.option1.text}
              onContentChange={(newContent) =>
                handleTinyBoxChange("option1", {
                  ...questionData.option1,
                  text: newContent,
                })
              }
            />
          </Grid>
          <FormHelperText>{validationError.option1}</FormHelperText>
        </Grid>
      </Box>
      <Box padding={1}>
        <Grid container spacing={1}>
          <Grid
            item
            xs={12}
            sm={1}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography>2</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={1}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Checkbox
              color="success"
              name="option2"
              checked={questionData.option2.isCorrect}
              onChange={(event) => handleCheckboxChange(event)}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={10}
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TinyBox2
              content={questionData.option2.text}
              onContentChange={(newContent) =>
                handleTinyBoxChange("option2", {
                  ...questionData.option2,
                  text: newContent,
                })
              }
            />
          </Grid>
          <FormHelperText>{validationError.option1}</FormHelperText>
        </Grid>
      </Box>
      <Box padding={1}>
        <Grid container spacing={1}>
          <Grid
            item
            xs={12}
            sm={1}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography>3</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={1}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Checkbox
              color="success"
              name="option3"
              checked={questionData.option3.isCorrect}
              onChange={(event) => handleCheckboxChange(event)}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={10}
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TinyBox2
              content={questionData.option3.text}
              onContentChange={(newContent) =>
                handleTinyBoxChange("option3", {
                  ...questionData.option3,
                  text: newContent,
                })
              }
            />
          </Grid>
          <FormHelperText>{validationError.option1}</FormHelperText>
        </Grid>
      </Box>
      <Box padding={1}>
        <Grid container spacing={1}>
          <Grid
            item
            xs={12}
            sm={1}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography>4</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={1}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Checkbox
              color="success"
              name="option4"
              checked={questionData.option4.isCorrect}
              onChange={(event) => handleCheckboxChange(event)}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={10}
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TinyBox2
              content={questionData.option4.text}
              onContentChange={(newContent) =>
                handleTinyBoxChange("option4", {
                  ...questionData.option4,
                  text: newContent,
                })
              }
            />
          </Grid>
          <FormHelperText>{validationError.option1}</FormHelperText>
        </Grid>
      </Box>
      <Box padding={1}>
        <Typography>Question</Typography>
        <TinyBox
          content={questionData.solution}
          onContentChange={(newContent) =>
            handleTinyBoxChange("solution", newContent)
          }
        />
        <FormHelperText>{validationError.solution}</FormHelperText>
      </Box>
      <Stack direction="row" justifyContent="flex-end">
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </Stack>
    </>
  );
}
