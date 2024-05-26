import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";

const ExamMultiCorrect = (props) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
  const [questionResponse, setQuestionResponse] = useState({
    questionId: "",
    questionStatus: "visited",
    answer: [],
  });

  useEffect(() => {
    if (props.questions.length > 0) {
      setQuestions(props.questions);
      const index = props.currentQuestionIndex;
      if (index !== null) {
        setCurrentQuestionIndex(index);
        const storedResponses = JSON.parse(
          localStorage.getItem("response")
        ) || { response: [] };
        const existingResponse = storedResponses.response.find(
          (resp) => resp.questionId === props.questions[index]._id
        );
        setQuestionResponse(
          existingResponse || {
            questionId: props.questions[index]._id,
            questionStatus: "visited",
            answer: [],
          }
        );
      }
    }
  }, [props.questions, props.currentQuestionIndex]);

  const handleChange = (event) => {
    const selectedAnswer = event.target.value;
    const updatedAnswers = questionResponse.answer.includes(selectedAnswer)
      ? questionResponse.answer.filter((answer) => answer !== selectedAnswer)
      : [...questionResponse.answer, selectedAnswer];

    const updatedResponse = {
      ...questionResponse,
      answer: updatedAnswers,
    };

    setQuestionResponse(updatedResponse);

    // Update localStorage
    let currentResponse = JSON.parse(localStorage.getItem("response")) || {
      response: [],
    };
    const existingResponseIndex = currentResponse.response.findIndex(
      (field) => field.questionId === updatedResponse.questionId
    );

    if (existingResponseIndex !== -1) {
      currentResponse.response[existingResponseIndex] = updatedResponse;
    } else {
      currentResponse.response.push(updatedResponse);
    }
    localStorage.setItem("response", JSON.stringify(currentResponse));
  };

  const currentQuestion = questions[currentQuestionIndex] || {};

  return (
    <>
      <Typography>Question:</Typography>
      <hr />
      <Box sx={{ padding: 1 }}>
        <Typography
          dangerouslySetInnerHTML={{
            __html: currentQuestion.questionText,
          }}
        />
      </Box>
      <hr />
      <FormGroup>
        {["1", "2", "3", "4"].map((option, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={questionResponse.answer.includes(option)}
                onChange={handleChange}
                value={option}
              />
            }
            label={
              <Typography
                dangerouslySetInnerHTML={{
                  __html: currentQuestion[`option${option}`]?.text,
                }}
              />
            }
          />
        ))}
      </FormGroup>
    </>
  );
};

export default ExamMultiCorrect;
