import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Checkbox,
  Button,
  Grid,
  Typography,
  Stack,
} from "@mui/material";
import { TinyBox, TinyBox2, TinyBoxReadOnly } from "./TinyBox";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const ViewQuestion = ({ currQuestion, handleShowViewQuestion, setRefresh }) => {
  const [academic, setAcademicData] = useState({});
  const [error, setError] = useState(null);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [filteredSubtopics, setFilteredSubtopics] = useState([]);
  const [question, setQuestion] = useState(currQuestion);
  const [readOnly, setReadOnly] = useState(question.isApproved === "Yes");
  const [editMode, setEditMode] = useState(false);

  const fetchAcademicData = useCallback(() => {
    fetch(`${API_URL}/academic`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setAcademicData(data.academic[0]);
      })
      .catch((error) => setError(error.message));
  }, []);

  useEffect(() => {
    fetchAcademicData();
  }, [fetchAcademicData]);

  useEffect(() => {
    if (question.classes && question.subject && academic.subjects) {
      const selectedSubjectData = academic.subjects.find(
        (subject) => subject.name === question.subject
      );
      if (selectedSubjectData) {
        const filteredTopics = selectedSubjectData.topics.filter(
          (topic) => topic.className === question.classes
        );
        setFilteredTopics(filteredTopics);
      }
    }
  }, [question, academic]);

  useEffect(() => {
    if (filteredTopics.length > 0) {
      const filteredSubtopics = filteredTopics
        .filter((topic) => !question.topic || topic.name === question.topic)
        .flatMap((topic) => topic.subtopics);
      setFilteredSubtopics(filteredSubtopics);
    }
  }, [filteredTopics, question]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestion((prevQuestion) => ({ ...prevQuestion, [name]: value }));
  };

  const handleTinyBoxChange = (name, newContent) => {
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      [name]: newContent,
    }));
  };
  const updateQuestion = (approve) => {
    const updatedQuestion = { ...question, isApproved: approve ? "Yes" : "No" };
    fetch(`${API_URL}/questionbank/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedQuestion),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        handleShowViewQuestion();
        setRefresh(!refresh);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    if (question.questionType === "singleCorrect") {
      setQuestion({
        ...question,
        [name]: {
          ...question[name],
          isCorrect: checked,
        },
        option1:
          name === "option1"
            ? { ...question.option1, isCorrect: checked }
            : { ...question.option1, isCorrect: false },
        option2:
          name === "option2"
            ? { ...question.option2, isCorrect: checked }
            : { ...question.option2, isCorrect: false },
        option3:
          name === "option3"
            ? { ...question.option3, isCorrect: checked }
            : { ...question.option3, isCorrect: false },
        option4:
          name === "option4"
            ? { ...question.option4, isCorrect: checked }
            : { ...question.option4, isCorrect: false },
      });
    } else {
      setQuestion({
        ...question,
        [name]: {
          ...question[name],
          isCorrect: checked,
        },
      });
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} padding={1}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={4} lg={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="class-label">Class</InputLabel>
              <Select
                labelId="class-label"
                id="class-select"
                value={question.classes || ""}
                label="Class"
                name="classes"
                readOnly={readOnly}
                onChange={handleChange}
              >
                {academic && academic.classes
                  ? academic.classes.map((classes, index) => (
                      <MenuItem key={index} value={classes}>
                        {classes}
                      </MenuItem>
                    ))
                  : question.classes && (
                      <MenuItem value={question.classes}>
                        {question.classes}
                      </MenuItem>
                    )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="subject-label">Subject</InputLabel>
              <Select
                labelId="subject-label"
                label="Subject"
                id="subject-select"
                name="subject"
                readOnly={readOnly}
                value={question.subject}
                onChange={handleChange}
              >
                {academic && academic.subjects
                  ? academic.subjects.map((subject, index) => (
                      <MenuItem key={index} value={subject.name}>
                        {subject.name}
                      </MenuItem>
                    ))
                  : question.subject && (
                      <MenuItem value={question.subject}>
                        {question.subject}
                      </MenuItem>
                    )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="topic-label">Topic</InputLabel>
              <Select
                labelId="topic-label"
                id="selectTopic"
                name="topic"
                label="Topic"
                readOnly={readOnly}
                value={question.topic || ""}
                onChange={handleChange}
              >
                {filteredTopics
                  ? filteredTopics.map((topic, index) => (
                      <MenuItem key={index} value={topic.name}>
                        {topic.name}
                      </MenuItem>
                    ))
                  : question.topic && (
                      <MenuItem value={question.topic}>
                        {question.topic}
                      </MenuItem>
                    )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="subtopic-label">Subtopic</InputLabel>
              <Select
                labelId="subtopic-label"
                id="selectSubtopic"
                name="subtopic"
                readOnly={readOnly}
                label="Subtopic"
                value={question.subtopic || ""}
                onChange={handleChange}
              >
                {filteredSubtopics &&
                  filteredSubtopics.map((subtopic, index) => (
                    <MenuItem key={index} value={subtopic.name}>
                      {subtopic.name}
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
                readOnly={readOnly}
                label="difficultyLevel"
                value={question.difficultyLevel || ""}
                onChange={handleChange}
              >
                {academic && academic.difficultyLevel
                  ? academic.difficultyLevel.map((Dlevel, index) => (
                      <MenuItem key={index} value={Dlevel}>
                        {Dlevel}
                      </MenuItem>
                    ))
                  : question.difficultyLevel && (
                      <MenuItem value={question.difficultyLevel}>
                        {question.difficultyLevel}
                      </MenuItem>
                    )}
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
                readOnly={readOnly}
                value={question.timeRequired || ""}
                onChange={handleChange}
              >
                {academic && academic.timeRequired
                  ? academic.timeRequired.map((time, index) => (
                      <MenuItem key={index} value={time}>
                        {time}
                      </MenuItem>
                    ))
                  : question.timeRequired && (
                      <MenuItem value={question.timeRequired}>
                        {question.timeRequired}
                      </MenuItem>
                    )}
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
                readOnly={readOnly}
                value={question.target || ""}
                onChange={handleChange}
              >
                {academic && academic.target
                  ? academic.target.map((tget, index) => (
                      <MenuItem key={index} value={tget}>
                        {tget}
                      </MenuItem>
                    ))
                  : question.target && (
                      <MenuItem value={question.target}>
                        {question.target}
                      </MenuItem>
                    )}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <hr style={{ color: "#000" }} />
      <Box sx={{ padding: 1 }}>
        <Typography>Question</Typography>
        {readOnly ? (
          <TinyBoxReadOnly content={question.questionText} height={200} />
        ) : (
          <TinyBox
            content={question.questionText}
            onContentChange={(newContent) =>
              handleTinyBoxChange("questionText", newContent)
            }
          />
        )}
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
              checked={question.option1.isCorrect}
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
            {readOnly ? (
              <TinyBoxReadOnly content={question.option1.text} height={100} />
            ) : (
              <TinyBox2
                content={question.option1.text}
                onContentChange={(newContent) =>
                  handleTinyBoxChange("option1", {
                    ...question.option1,
                    text: newContent,
                  })
                }
              />
            )}
          </Grid>
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
              checked={question.option2.isCorrect}
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
            {readOnly ? (
              <TinyBoxReadOnly content={question.option2.text} height={100} />
            ) : (
              <TinyBox2
                content={question.option2.text}
                onContentChange={(newContent) =>
                  handleTinyBoxChange("option2", {
                    ...question.option2,
                    text: newContent,
                  })
                }
              />
            )}
          </Grid>
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
              checked={question.option3.isCorrect}
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
            {readOnly ? (
              <TinyBoxReadOnly content={question.option3.text} height={100} />
            ) : (
              <TinyBox2
                content={question.option3.text}
                onContentChange={(newContent) =>
                  handleTinyBoxChange("option3", {
                    ...question.option3,
                    text: newContent,
                  })
                }
              />
            )}
          </Grid>
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
              checked={question.option4.isCorrect}
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
            {readOnly ? (
              <TinyBoxReadOnly content={question.option4.text} height={100} />
            ) : (
              <TinyBox2
                content={question.option4.text}
                onContentChange={(newContent) =>
                  handleTinyBoxChange("option4", {
                    ...question.option4,
                    text: newContent,
                  })
                }
              />
            )}
          </Grid>
        </Grid>
      </Box>
      <Box padding={1}>
        <Typography>Solutions</Typography>
        <Grid container spacing={1}>
          <Grid
            item
            xs={12}
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {readOnly ? (
              <TinyBoxReadOnly content={question.solution} height={100} />
            ) : (
              <TinyBox2
                content={question.solution}
                onContentChange={(newContent) =>
                  handleTinyBoxChange("solution", newContent)
                }
              />
            )}
          </Grid>
        </Grid>
      </Box>
      {readOnly ? (
        <Stack direction="row" justifyContent="flex-end">
          <Button
            variant="contained"
            color="secondary"
            sx={{ marginTop: 2 }}
            onClick={() => setReadOnly(false)}
          >
            Edit
          </Button>
        </Stack>
      ) : (
        <Stack direction="row" justifyContent="flex-end">
          <Button
            variant="contained"
            color="success"
            sx={{ marginTop: 2 }}
            onClick={updateQuestion}
          >
            Save and Approve
          </Button>
        </Stack>
      )}
    </>
  );
};

export default ViewQuestion;
