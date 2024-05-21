import React, { useState } from "react";

import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  TextField,
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  TableHead,
  Paper,
  Typography,
} from "@mui/material";

import { TinyBox } from "../../components/TinyBox";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export default function CreateExamTemplate(handleShowAddTemplate) {
  const [newExamTemplate, setNewExamTemplate] = useState({
    examName: "",
    examPattern: "",
    examInstruction: "",
    questionTypes: {
      singleCorrect: {
        totalQuestions: 0,
        addedQuestions: 0,
        positiveMarks: 3,
        partialMarks: 0,
        negativeMarks: 1,
      },
      multiCorrect: {
        totalQuestions: 0,
        addedQuestions: 0,
        positiveMarks: 4,
        partialMarks: 1,
        negativeMarks: 2,
      },
      integerType: {
        totalQuestions: 0,
        addedQuestions: 0,
        positiveMarks: 3,
        partialMarks: 0,
        negativeMarks: 1,
      },
    },
  });

  console.log(newExamTemplate);

  const handleCreateTemplate = () => {
    fetch(`${API_URL}/exams/createtemplate`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newExamTemplate),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    handleShowAddTemplate();
  };

  const handleTemplateInputChange = (e) => {
    const { name, value } = e.target;
    setNewExamTemplate((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleQuestionTypeInputChange = (e, type) => {
    const { name, value } = e.target;
    setNewExamTemplate((prevState) => ({
      ...prevState,
      questionTypes: {
        ...prevState.questionTypes,
        [type]: {
          ...prevState.questionTypes[type],
          [name]: value,
        },
      },
    }));
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} padding={1}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={4} lg={3}>
            <TextField
              fullWidth
              size="small"
              label="Exam Name"
              name="examName"
              value={newExamTemplate.examName}
              onChange={handleTemplateInputChange}
              id="examName"
              style={{ marginBottom: "20px" }}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Target</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Exam Pattern"
                name="examPattern"
                value={newExamTemplate.examPattern}
                onChange={handleTemplateInputChange}
              >
                <MenuItem value="JEE">JEE</MenuItem>
                <MenuItem value="NEET">NEET</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Box padding={1}>
        <Typography>Exam Instructions</Typography>
        <TinyBox
          content={newExamTemplate.examInstruction}
          onContentChange={(newContent) =>
            setNewExamTemplate({
              ...newExamTemplate,
              examInstruction: newContent,
            })
          }
        />
      </Box>
      <Box padding={1}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead className="bg bg-success ">
              <TableRow>
                <TableCell align="center" className="text-white">
                  Question Type
                </TableCell>
                <TableCell align="center" className="text-white">
                  # of Questions
                </TableCell>
                <TableCell align="center" className="text-white">
                  Positive Marks
                </TableCell>
                <TableCell align="center" className="text-white">
                  Partial
                </TableCell>
                <TableCell align="center" className="text-white">
                  Negative Marks
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(newExamTemplate.questionTypes).map(
                ([type, questionType]) => (
                  <TableRow key={type}>
                    <TableCell align="center">{type}</TableCell>
                    <TableCell align="center">
                      <TextField
                        id={`${type}-questions`}
                        size="small"
                        type="number"
                        name="totalQuestions"
                        value={questionType.totalQuestions}
                        onChange={(e) => handleQuestionTypeInputChange(e, type)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        id={`${type}-positive`}
                        size="small"
                        type="number"
                        name="positiveMarks"
                        value={questionType.positiveMarks}
                        onChange={(e) => handleQuestionTypeInputChange(e, type)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        id={`${type}-partial`}
                        size="small"
                        type="number"
                        name="partialMarks"
                        value={questionType.partialMarks}
                        onChange={(e) => handleQuestionTypeInputChange(e, type)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        id={`${type}-negative`}
                        size="small"
                        type="number"
                        name="negativeMarks"
                        value={questionType.negativeMarks}
                        onChange={(e) => handleQuestionTypeInputChange(e, type)}
                      />
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ padding: 2 }}>
        <Button variant="contained" onClick={handleCreateTemplate}>
          Create template
        </Button>
      </Box>
    </>
  );
}
