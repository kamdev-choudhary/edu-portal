import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Auth";
import CurrentTime from "../../components/CurrentTime";

// MUI Component
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#28844f",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function OnlineExamStudent() {
  const { username, userId, batchId } = useAuth();
  const [exams, setExams] = useState([]);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const getExamData = async () => {
      const response = await axios.get(`${API_URL}/exams/${batchId}`);
      if (response.status === 200) {
        setExams(response.data);
      }
    };
    if (batchId !== "") {
      getExamData();
    }
  }, []);

  const handleStartExam = (examId) => {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    window.open(
      `http://localhost:5173/exams/start/${userId}/${examId}`,
      "Exams",
      `width=${screenWidth},height=${screenHeight},resizable=yes,scrollbars=yes`
    );
  };

  return (
    <Box>
      <Box
        sx={{
          border: "1px solid rgba(0,0,0,0.2)",
          padding: "0 20px",
          borderRadius: 1,
          marginBottom: 1,
          display: "flex",
          justifyContent: "center",
          fontWeight: "bold",
        }}
      >
        <CurrentTime />
      </Box>
      {batchId === "" ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography>Join a batch to Get Exams</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>SN</StyledTableCell>
                <StyledTableCell align="center">Exam Name</StyledTableCell>
                <StyledTableCell align="center">Exam Date</StyledTableCell>
                <StyledTableCell align="center">
                  Exam Start Time
                </StyledTableCell>
                <StyledTableCell align="center">Exam End Time</StyledTableCell>
                <StyledTableCell align="center">Exam Status</StyledTableCell>
                <StyledTableCell align="center">Start Exam</StyledTableCell>
                <StyledTableCell align="center">View Result</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exams?.map((exam, index) => {
                const filteredExamAssigned = exam.examAssigned.find(
                  (assignment) => assignment.batchId === batchId
                );
                return (
                  <StyledTableRow key={exam._id}>
                    <StyledTableCell align="center">
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {exam.examName}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {filteredExamAssigned
                        ? filteredExamAssigned.examDate
                        : "N/A"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {filteredExamAssigned
                        ? filteredExamAssigned.examStartTime
                        : "N/A"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {filteredExamAssigned
                        ? filteredExamAssigned.examEndTime
                        : "N/A"}
                    </StyledTableCell>
                    <StyledTableCell align="center"></StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        onClick={() => handleStartExam(exam._id)}
                        variant="contained"
                        sx={{ borderRadius: 10 }}
                      >
                        Start
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant="contained"
                        color="secondary"
                        sx={{ borderRadius: 10 }}
                      >
                        View
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
