import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Auth";

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
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function OnlineExamStudent() {
  const { username, userId, batch } = useAuth();
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const getExamData = async () => {
      const response = await axios.get(`${API_URL}/batch`);
      if (response.status === 200) {
        setExams(response.data.exams);
      }
    };
    getExamData();
  }, []);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>SN</StyledTableCell>
            <StyledTableCell align="right">Exam Name</StyledTableCell>
            <StyledTableCell align="right">Exam Date</StyledTableCell>
            <StyledTableCell align="right">Exam Time</StyledTableCell>
            <StyledTableCell align="right">Syllabus</StyledTableCell>
            <StyledTableCell align="right">Start Status</StyledTableCell>
            <StyledTableCell align="right">Exam Start</StyledTableCell>
            <StyledTableCell align="right">View Result</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {exams?.map((exam) => (
            <StyledTableRow key={exam._id}>
              <StyledTableCell component="th" scope="exam">
                {exam.name}
              </StyledTableCell>
              <StyledTableCell component="th" scope="exam">
                <Button>Start</Button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
