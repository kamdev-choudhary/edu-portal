import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";

const ExamSingleCorrect = (props) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
  const [questionResponse, setQuestionResponse] = useState({
    questionId: "",
    questionStatus: "visited",
    answer: [],
    synced: false,
  });

  useEffect(() => {
    if (props.questions.length > 0) {
      setQuestions(props.questions);
      const index = props.currentQuestionIndex;
      if (index !== null) {
        setCurrentQuestionIndex(index);
        const storedResponses = JSON.parse(
          localStorage.getItem("scholarResponse")
        );
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
    const updatedResponse = {
      ...questionResponse,
      answer: [selectedAnswer],
    };
    setQuestionResponse(updatedResponse);

    let currentResponse = JSON.parse(localStorage.getItem("scholarResponse"));
    const existingResponseIndex = currentResponse.response.findIndex(
      (field) => field.questionId === updatedResponse.questionId
    );

    if (existingResponseIndex !== -1) {
      currentResponse.response[existingResponseIndex] = updatedResponse;
    } else {
      currentResponse.response.push(updatedResponse);
    }
    localStorage.setItem("scholarResponse", JSON.stringify(currentResponse));
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
      <RadioGroup
        name={`question-${currentQuestionIndex}`}
        value={questionResponse.answer[0] || ""}
        onChange={handleChange}
      >
        {["1", "2", "3", "4"].map((option, index) => (
          <FormControlLabel
            key={index}
            value={option}
            control={<Radio />}
            label={
              <Typography
                dangerouslySetInnerHTML={{
                  __html: currentQuestion[`option${option}`]?.text,
                }}
              />
            }
          />
        ))}
      </RadioGroup>
    </>
  );
};

export default ExamSingleCorrect;
