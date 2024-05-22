import { useState, useEffect } from "react";
import React from "react";

import ViewExamTemplate from "./ViewExamTemplate";
import CreateExamTemplate from "./CreateExamTemplate";

import SearchIcon from "@mui/icons-material/Search";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditIcon from "@mui/icons-material/Edit";

import axios from "axios";

import {
  Box,
  Skeleton,
  OutlinedInput,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export default function ExamMasterOnline() {
  const [showAddExamTemplate, setShowAddExamTemplate] = useState(false);
  const [examTemplates, setExamTemplates] = useState([]);
  const [error, setError] = useState("");
  const [tabValue, setTabValue] = useState("online");
  const [isLoading, setIsLoading] = useState(true);
  const [currTemplate, setCurrTemplate] = useState([]);
  const [newAssignData, setNewAssignData] = useState({
    batchName: "",
    batchId: "",
    examDate: "",
    examStartTime: "",
    examEndTime: "",
  });
  const [showExamTemplateModal, setShowExamTemplateModal] = useState(false);
  const [batch, setBatch] = useState([]);
  const [batches, setBatches] = useState([]);
  const [academic, setAcademic] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [showAssignedExam, setShowAssignedExam] = useState(false);
  const [showAssignToBatch, setShowAssignToBatch] = useState(false);
  const [showEditAssignedExam, setShowEditAssignedExam] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/batch`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setBatches(data.batches))
      .catch((error) => setError(error.message));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/academic`)
      .then((response) => response.json())
      .then((data) => {
        setAcademic(data.academic[0]);
      });
  }, []);

  const handleShowExamTemplateModal = () => {
    setShowExamTemplateModal(!showExamTemplateModal);
  };

  const handleShowExamTemplate = (examTemplate) => {
    handleShowExamTemplateModal();
    if (examTemplate) {
      setCurrTemplate(examTemplate);
    }
  };

  useEffect(() => {
    fetch(`${API_URL}/exams`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setExamTemplates(data.examTemplates);
        setIsLoading(false);
      })
      .catch((error) => setError(error.message));
  }, []);

  const handleChangeAssignData = (e) => {
    if (e.target.name === "batchName") {
      const selectedBatch = batches.find(
        (batch) => batch.batchName === e.target.value
      );
      setNewAssignData({
        ...newAssignData,
        batchName: selectedBatch.batchName,
        batchId: selectedBatch._id,
      });
    } else {
      setNewAssignData({ ...newAssignData, [e.target.name]: e.target.value });
    }
  };

 const handleAssignExamToBatch = async () => {
   const currTempId = currTemplate._id;
   const url = `${API_URL}/exams/assigntobatch/${currTempId}`;
   const options = {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(newAssignData),
   };

   try {
     const response = await fetch(url, options);
     if (response.ok) {
       // equivalent to response.status === 200
       const data = await response.json();
       console.log(data.msg);
       setShowAssignToBatch(false);
     }
   } catch (error) {
     console.error("Error:", error);
   }
 };


  if (isLoading) {
    return (
      <>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={9}>
            <Skeleton
              sx={{ borderRadius: 10 }}
              variant="rectangular"
              height={40}
            />
          </Grid>
          <Grid item xs={12} lg={3}>
            <Skeleton
              sx={{ borderRadius: 10 }}
              variant="rectangular"
              height={40}
            />
          </Grid>
        </Grid>
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 2,
            }}
          ></Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead className="bg bg-success ">
                <TableRow>
                  <TableCell align="center" className="text-white">
                    Exam ID
                  </TableCell>
                  <TableCell align="center" className="text-white">
                    Template Name
                  </TableCell>
                  <TableCell align="center" className="text-white">
                    Created At
                  </TableCell>
                  <TableCell align="center" className="text-white">
                    Pattern
                  </TableCell>
                  <TableCell align="center" className="text-white">
                    Details
                  </TableCell>
                  <TableCell align="center" className="text-white">
                    Delete
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(10)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    {/* Add more skeleton cells as needed */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </>
    );
  }

  return (
    <>
      <Grid container spacing={1}>
        <Grid item sx={6} md={6} lg={9}>
          <FormControl fullWidth size="small">
            <OutlinedInput
              sx={{ borderRadius: 10 }}
              onChange={(e) => setSearchInput(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  Search <SearchIcon />
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
        <Grid item sx={6} md={6} lg={3}>
          <Button
            fullWidth
            variant="contained"
            sx={{ borderRadius: 10 }}
            onClick={() => setShowAddExamTemplate(true)}
          >
            Create New Template
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ marginTop: 2, height: "70vh", overflow: "auto" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead className="bg bg-success ">
              <TableRow>
                <TableCell align="center" className="text-white">
                  Exam ID
                </TableCell>
                <TableCell align="center" className="text-white">
                  Template Name
                </TableCell>
                <TableCell align="center" className="text-white">
                  Created At
                </TableCell>
                <TableCell align="center" className="text-white">
                  Stream
                </TableCell>
                <TableCell align="center" className="text-white">
                  Assigned to
                </TableCell>
                <TableCell align="center" className="text-white">
                  Details
                </TableCell>
                <TableCell align="center" className="text-white">
                  Delete
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {examTemplates.map((examtemplate, index) => (
                <TableRow
                  key={examtemplate._id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell align="center">{examtemplate.examId}</TableCell>
                  <TableCell align="center">{examtemplate.examName}</TableCell>
                  <TableCell align="center">{examtemplate.createdAt}</TableCell>
                  <TableCell align="center">
                    {examtemplate.examPattern}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => {
                        setShowAssignedExam(true);
                        setCurrTemplate(examtemplate);
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="sm"
                      onClick={() => handleShowExamTemplate(examtemplate)}
                    >
                      View
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton>
                      <DeleteRoundedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Modal for template create */}
      <Modal
        open={showAddExamTemplate}
        onClose={() => setShowAddExamTemplate(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            backgroundColor: "#fff",
            height: "95vh",
            margin: "2.5vh 2.5vw",
            width: "95vw",
            padding: 2,
            overflow: "auto",
            borderRadius: 2,
            position: "relative",
          }}
        >
          <Box sx={{ position: "absolute", right: 15, top: 15 }}>
            <Button
              onClick={() => setShowAddExamTemplate(false)}
              color="error"
              variant="contained"
              sx={{ borderRadius: 10 }}
            >
              Close
            </Button>
          </Box>
          <CreateExamTemplate />
        </Box>
      </Modal>

      {/* Modal for show Exam Template */}
      <Modal
        open={showExamTemplateModal}
        onClose={() => setShowExamTemplateModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            backgroundColor: "#fff",
            height: "95vh",
            margin: "2.5vh 2.5vw",
            width: "95vw",
            padding: 2,
            overflow: "auto",
            borderRadius: 2,
            position: "relative",
          }}
        >
          <Box sx={{ position: "absolute", right: 15, top: 15 }}>
            <Button
              onClick={() => setShowExamTemplateModal(false)}
              color="error"
              variant="contained"
              sx={{ borderRadius: 10 }}
            >
              Close
            </Button>
          </Box>
          <ViewExamTemplate currTemplate={currTemplate} />
        </Box>
      </Modal>

      {/* Modal for Assign Exam to Batch */}
      <Modal
        open={showAssignedExam}
        onClose={() => setShowAssignedExam(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            bgcolor: "background.paper",
            border: "1px solid rgba(0,0,0,0.5)",
            boxShadow: 12,
            borderRadius: 2,
            p: 2,
          }}
        >
          <Box sx={{ position: "absolute", right: 15, top: 15 }}>
            <Button
              onClick={() => setShowAssignedExam(false)}
              color="error"
              variant="contained"
              sx={{ borderRadius: 10 }}
            >
              Close
            </Button>
          </Box>
          <Box>
            <Typography variant="h5">Assign to Batch</Typography>
            <hr />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "right" }}>
            <Button onClick={() => setShowAssignToBatch(true)}>
              Assign to Another Batch
            </Button>
          </Box>
          <Box>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">SN</TableCell>
                    <TableCell align="center">Batch Name</TableCell>
                    <TableCell align="center">Exam Date</TableCell>
                    <TableCell align="center">Exam Start Time</TableCell>
                    <TableCell align="center">Exam End Time</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currTemplate?.examAssigned?.map((assign, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center" scope="row">
                        {assign.batchName}
                      </TableCell>
                      <TableCell align="center" scope="row">
                        {assign.examDate}
                      </TableCell>
                      <TableCell align="center" scope="row">
                        {assign.examStartTime}
                      </TableCell>
                      <TableCell align="center" scope="row">
                        {assign.examEndTime}
                      </TableCell>
                      <TableCell align="center" scope="row">
                        <IconButton
                          onClick={() => setShowEditAssignedExam(true)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton>
                          <DeleteRoundedIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Modal>
      {/* Assign Exam to Batch Modal */}
      <Modal
        open={showAssignToBatch}
        onClose={() => setShowAssignToBatch(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "1px solid rgba(0,0,0,0.5)",
            boxShadow: 12,
            borderRadius: 2,
            p: 2,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography>Add Exam to Batch</Typography>
          </Box>
          <hr />
          <Box sx={{ display: "grid", gap: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">
                Select Batch
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="batchName"
                value={newAssignData.batchName}
                onChange={handleChangeAssignData}
                label="Select Batch"
              >
                {batches.map((batch, index) => (
                  <MenuItem key={index} value={batch.batchName}>
                    {batch.batchName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <OutlinedInput
              onChange={handleChangeAssignData}
              type="date"
              name="examDate"
              size="small"
              fullWidth
            />
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <OutlinedInput
                onChange={handleChangeAssignData}
                type="time"
                name="examStartTime"
                value={newAssignData.examStartTime}
                size="small"
                fullWidth
              />
              <Typography>to</Typography>
              <OutlinedInput
                onChange={handleChangeAssignData}
                type="time"
                name="examEndTime"
                value={newAssignData.examEndTime}
                size="small"
                fullWidth
              />
            </Box>
            <Button onClick={handleAssignExamToBatch} variant="contained">
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
