import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Grid,
} from "@mui/material";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export default function ViewExamTemplate(props) {
  const [examTemplate, setExamTemplate] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/exams/templates/${props.currTemplate._id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setExamTemplate(data.examTemplate);
      })
      .catch((error) => setError(error.message));

    fetch(`${API_URL}/batch`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setBatches(data.batches);
      })
      .catch((error) => setError(error.message));
  }, []);

  const downloadPDF = () => {
    const element = document.getElementById("questions");
    const options = {
      margin: [10, 10, 10, 10],
      filename: "questions.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(element).set(options).save();
  };

  const printPDF = () => {
    const content = document.getElementById("questions").innerHTML;
    const printWindow = window.open(" ", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Questions</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            .question-box {
              page-break-inside: avoid;
              margin-bottom: 20px;
              border: 1px solid #000;
              padding: 10px;
              border-radius: 5px;
            }
            .question-box h4 {
              margin-top: 0;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleExamTemplateChange = (e, index) => {
    const { name, value } = e.target;
    const updatedExamTemplate = { ...examTemplate, [name]: value };
    setExamTemplate(updatedExamTemplate);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} padding={1}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={4} lg={4}>
            <TextField
              size="small"
              fullWidth
              id="examName"
              variant="outlined"
              label="Test Name"
              name="examName"
              InputLabelProps={{ shrink: true }}
              value={examTemplate.examName || ""}
              onChange={(e) => handleExamTemplateChange(e, 0)}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <TextField
              size="small"
              fullWidth
              id="examPattern"
              variant="outlined"
              label="Exam Pattern"
              name="examPattern"
              InputLabelProps={{ shrink: true }}
              value={examTemplate.examPattern || ""}
              onChange={(e) => handleExamTemplateChange(e, 0)}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <Button onClick={downloadPDF} sx={{ textTransform: "none" }}>
              Download Paper
            </Button>
            <Button
              onClick={printPDF}
              sx={{ textTransform: "none", marginLeft: 2 }}
            >
              Print Paper
            </Button>
          </Grid>
        </Grid>
      </Box>
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
                Added Questions
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
            {examTemplate.questionTypes && (
              <>
                <TableRow>
                  <TableCell align="center">Single Correct</TableCell>
                  <TableCell align="center">
                    {examTemplate.questionTypes.singleCorrect.totalQuestions}
                  </TableCell>
                  <TableCell align="center" style={{ color: "red" }}>
                    {examTemplate.questionTypes.singleCorrect.addedQuestions}
                  </TableCell>
                  <TableCell align="center">
                    {examTemplate.questionTypes.singleCorrect.positiveMarks}
                  </TableCell>
                  <TableCell align="center">
                    {examTemplate.questionTypes.singleCorrect.partialMarks}
                  </TableCell>
                  <TableCell align="center">
                    {examTemplate.questionTypes.singleCorrect.negativeMarks}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">Multi Correct</TableCell>
                  <TableCell align="center">
                    {examTemplate.questionTypes.multiCorrect.totalQuestions}
                  </TableCell>
                  <TableCell align="center" style={{ color: "red" }}>
                    {examTemplate.questionTypes.multiCorrect.addedQuestions}
                  </TableCell>
                  <TableCell align="center">
                    {examTemplate.questionTypes.multiCorrect.positiveMarks}
                  </TableCell>
                  <TableCell align="center">
                    {examTemplate.questionTypes.multiCorrect.partialMarks}
                  </TableCell>
                  <TableCell align="center">
                    {examTemplate.questionTypes.multiCorrect.negativeMarks}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center">Integer Type</TableCell>
                  <TableCell align="center">
                    {examTemplate.questionTypes.integerType.totalQuestions}
                  </TableCell>
                  <TableCell align="center" style={{ color: "red" }}>
                    {examTemplate.questionTypes.integerType.addedQuestions}
                  </TableCell>
                  <TableCell align="center">
                    {examTemplate.questionTypes.integerType.positiveMarks}
                  </TableCell>
                  <TableCell align="center">
                    {examTemplate.questionTypes.integerType.partialMarks}
                  </TableCell>
                  <TableCell align="center">
                    {examTemplate.questionTypes.integerType.negativeMarks}
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <h3>Questions</h3>
      <div className="div d-flex gap-3 row" id="questions">
        {examTemplate.questions &&
          examTemplate.questions.map((question, index) => (
            <Box sx={{ flexGrow: 1 }} padding={2} key={index}>
              <Grid
                container
                spacing={1}
                sx={{
                  marginTop: 1,
                  borderRadius: "5px",
                }}
              >
                <Grid
                  item
                  xs={12}
                  md={1}
                  lg={1}
                  style={{ fontWeight: "bold", textAlign: "center" }}
                >
                  {index + 1}
                </Grid>
                <Grid item xs={12} md={11} lg={11}>
                  <Typography
                    dangerouslySetInnerHTML={{ __html: question.questionText }}
                  />
                  <Grid
                    container
                    spacing={3}
                    direction="row"
                    justifyContent="space-around"
                    alignItems="flex-start"
                  >
                    <Grid item container xs="auto" alignItems="baseline">
                      <Grid item>
                        ({question.option1.isCorrect ? "*" : ""}A){" "}
                      </Grid>
                      <Grid item>
                        <Typography
                          dangerouslySetInnerHTML={{
                            __html: question.option1.text,
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid item container xs="auto" alignItems="baseline">
                      <Grid item>
                        ({question.option2.isCorrect ? "*" : ""}B){" "}
                      </Grid>
                      <Grid item>
                        <Typography
                          dangerouslySetInnerHTML={{
                            __html: question.option2.text,
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid item container xs="auto" alignItems="baseline">
                      <Grid item>
                        ({question.option3.isCorrect ? "*" : ""}C)
                      </Grid>
                      <Grid item>
                        <Typography
                          dangerouslySetInnerHTML={{
                            __html: question.option3.text,
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid item container xs="auto" alignItems="baseline">
                      <Grid item>
                        ({question.option4.isCorrect ? "*" : ""}D){" "}
                      </Grid>
                      <Grid item>
                        <Typography
                          dangerouslySetInnerHTML={{
                            __html: question.option4.text,
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          ))}
      </div>
    </>
  );
}
