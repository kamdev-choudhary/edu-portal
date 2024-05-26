import React, { useState, useEffect } from "react";
import { Box, Typography, Checkbox } from "@mui/material";

const examMultiCorrect = (props) => {
  const [question, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
  useEffect(() => {
    setQuestions(props.questions);
    setCurrentQuestionIndex(props.currentQuestionIndex);
  }, [props.currentQuestionIndex]);
  return (
    <>
      <Typography>Question:</Typography>
      <hr />
      <Box sx={{ padding: 1 }}>
        <Typography
          dangerouslySetInnerHTML={{
            __html: question[currentQuestionIndex]?.questionText,
          }}
        />
      </Box>
      <hr />
      <Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box>
            <Checkbox />
          </Box>
          <Typography
            dangerouslySetInnerHTML={{
              __html: question[currentQuestionIndex]?.option1.text,
            }}
          />
        </Box>
        <Box
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <Box>
            <Checkbox />
          </Box>
          <Typography
            dangerouslySetInnerHTML={{
              __html: question[currentQuestionIndex]?.option2.text, // Make sure to change to option2
            }}
          />
        </Box>
        <Box
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <Box>
            <Checkbox />
          </Box>
          <Typography
            dangerouslySetInnerHTML={{
              __html: question[currentQuestionIndex]?.option3.text, // Make sure to change to option2
            }}
          />
        </Box>
        <Box
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <Box>
            <Checkbox />
          </Box>
          <Typography
            dangerouslySetInnerHTML={{
              __html: question[currentQuestionIndex]?.option4.text, // Make sure to change to option2
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default examMultiCorrect;
