import { Box, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { Container, Paper, Button, Checkbox } from "@mui/material";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

function Home() {
  const location = useLocation();
  const [pathSegments, setPathSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState([]);
  const [showInstruction, setShowInstructions] = useState(true);
  const [checkboxChecked, setCheckBoxChecked] = useState(false);

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
        }
      } catch (error) {
        console.error("Error fetching exam:", error);
        // Handle the error as needed
      }
    };

    getExam();
  }, [location.pathname]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
        <Typography variant="h5">Loading Your Exam</Typography>
      </Box>
    );
  }

  return (
    <>
      <Container maxWidth="xl" elevation={10}>
        <Paper elevation={4}>
          {showInstruction ? (
            <Box
              sx={{
                justifyContent: "center",
                padding: 2,
                backgroundColor: "#e1e1e1",
                height: "99vh",
                flexDirection: "row",
              }}
            >
              <div>
                <p>Exam Name : {exam?.examName}</p>
              </div>
              <div>
                <Typography
                  dangerouslySetInnerHTML={{ __html: exam.examInstruction }}
                />
              </div>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  checked={checkboxChecked}
                  onChange={() => setCheckBoxChecked(!checkboxChecked)}
                />
                <Typography>I have read all the instructions</Typography>
              </Box>
              <Button
                disabled={!checkboxChecked}
                onClick={() => setShowInstructions(false)}
                variant="contained"
              >
                Start Exam
              </Button>
            </Box>
          ) : (
            <Box>
              <p>Start exam</p>
            </Box>
          )}
        </Paper>
      </Container>
    </>
  );
}

export default Home;
