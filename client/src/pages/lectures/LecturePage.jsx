import React, { useEffect, useState } from "react";
import YouTubeVideo from "../../components/YoutubeVideo";
import { useAuth } from "../../Auth";

import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

import {
  TextField,
  Modal,
  Skeleton,
  Stack,
  IconButton,
  Box,
  Grid,
  Select,
  Button,
  InputLabel,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  FormControl,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

function CollapsibleTable({ lectures, playLecture }) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead className="bg bg-primary ">
          <TableRow>
            <TableCell align="center" className="text-white">
              Chapter Name
            </TableCell>
            <TableCell align="center" className="text-white">
              Lecture #
            </TableCell>
            <TableCell align="center" className="text-white">
              Video
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lectures.map((lecture, lectureIndex) => (
            <TableRow key={lectureIndex}>
              <TableCell align="center">{lecture.chapterName}</TableCell>
              <TableCell align="center">{lecture.lectureNumber}</TableCell>
              <TableCell align="center">
                <Button
                  variant="outlined"
                  sx={{ borderRadius: 10 }}
                  color="error"
                  onClick={() => playLecture(lecture.videoId)}
                >
                  <i className="fa-brands fa-youtube"></i> &nbsp;Play
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function LecturePage() {
  const { isAdmin, isLoggedIn, userId, accountType } = useAuth();

  const [lectures, setLectures] = useState([]);
  const [error, setError] = useState(null);
  const [collapsedChapter, setCollapsedChapter] = useState(null);
  const [currVID, setCurrVID] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [selectedClass, setSelectedClass] = useState("IX");
  const [academic, setAcademic] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddLecturePopup, setShowAddLecturePopup] = useState(false);
  const [newLecture, setNewLecture] = useState({
    class: "",
    subject: "",
    chapterName: "",
    lectureNumber: "",
    videoId: "",
  });
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [showVideoBox, setShowVideoBox] = useState(false);

  const handleFilterTextChange = (e) => {
    setFilterText(e.target.value);
  };

  useEffect(() => {
    fetch(`${API_URL}/academic`)
      .then((response) => response.json())
      .then((data) => {
        setAcademic(data.academic[0]);
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (isLoggedIn && accountType === "student") {
      fetch(`${API_URL}/lectures/${selectedClass}`)
        .then((response) => response.json())
        .then((data) => {
          setLectures(data.lectures);
        })
        .catch((error) => console.log(error));
    } else {
      fetch(`${API_URL}/lectures`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          const sortedLectures = data.lectures.sort((a, b) => {
            if (a.class !== b.class) {
              return a.class.localeCompare(b.class);
            }
            if (a.subject !== b.subject) {
              return a.subject.localeCompare(b.subject);
            }
            return a.lectureNumber - b.lectureNumber;
          });
          setLectures(sortedLectures);
        })
        .catch((error) => setError(error.message));
    }
  }, [selectedClass]);

  useEffect(() => {
    if (isLoggedIn && accountType === "student") {
      fetch(`${API_URL}/auth/user/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setUser((prevUser) => ({ ...prevUser, ...data.user }));
          if (data.user.currentClass !== "") {
            setSelectedClass(data.user.currentClass);
          }
        })
        .catch((error) => console.log(error));
    }
  }, [isLoggedIn]);

  const filteredLecture = () => {
    return lectures.filter(
      (lecture) =>
        (lecture.class === selectedClass || lecture.class === "") &&
        (selectedSubject === "" || lecture.subject === selectedSubject) &&
        Object.values(lecture).some(
          (field) =>
            (typeof field === "string" || typeof field === "number") &&
            field.toString().toLowerCase().includes(filterText.toLowerCase())
        )
    );
  };

  const filteredLectures = filteredLecture();

  const toggleChapter = (chapterName) => {
    setCollapsedChapter(collapsedChapter === chapterName ? null : chapterName);
  };

  const lecturesByChapter = filteredLectures.reduce((acc, lecture) => {
    const { chapterName } = lecture;
    if (!acc[chapterName]) {
      acc[chapterName] = [];
    }
    acc[chapterName].push(lecture);
    return acc;
  }, {});

  const playLecture = (videoId) => {
    setCurrVID(videoId);
    setShowVideoPopup(true);
  };

  const handleAddNewLecture = () => {
    console.log("haha");
  };

  useEffect(() => {
    if (newLecture.class && newLecture.subject && academic.subjects) {
      const selectedSubjectData = academic.subjects.find(
        (subject) => subject.name === newLecture.subject
      );

      if (selectedSubjectData) {
        const filteredTopicss = selectedSubjectData.topics.filter(
          (topic) => topic.className === newLecture.class
        );
        setFilteredTopics(filteredTopicss);
      }
    }
  }, [newLecture.classes, newLecture.subject, academic.subjects]);

  const addLectureStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
  };

  const playLectureAdmin = (videoId) => {
    setCurrVID(videoId);
    setShowVideoBox(true);
  };

  if (isLoading) {
    return (
      <>
        <Grid container spacing={2}>
          <Grid item xs={6} md={6} lg={3}>
            <Skeleton
              sx={{ borderRadius: 10 }}
              variant="rectangular"
              height={40}
            />
          </Grid>
          <Grid item xs={6} md={6} lg={3}>
            <Skeleton
              sx={{ borderRadius: 10 }}
              variant="rectangular"
              height={40}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Skeleton
              sx={{ borderRadius: 10 }}
              variant="rectangular"
              height={40}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: "#28844f" }}>
                  <TableRow>
                    <TableCell sx={{ color: "#fff" }}>subject</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Chapter Name</TableCell>
                    <TableCell sx={{ color: "#fff" }}># of Lectures</TableCell>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </>
    );
  }

  if (academic && isAdmin) {
    const handleDeleteLecture = (id) => {
      console.log(id);
    };
    return (
      <>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={6} lg={3} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Class</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="selectedClass"
                  name="selectedClass"
                  label="Class"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  {academic &&
                    academic.classes &&
                    academic.classes.map((classes, index) => (
                      <MenuItem key={index} value={classes}>
                        {"Class : "}
                        {classes}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} lg={3} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Subject</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="selectedSubject"
                  name="selectedSubject"
                  label="Subject"
                  value={selectedSubject === "all" ? "All" : selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {academic &&
                    academic.subjects &&
                    academic.subjects.map((subject, index) => (
                      <MenuItem key={index} value={subject.name}>
                        {subject.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} lg={4} md={6}>
              <FormControl fullWidth size="small">
                <OutlinedInput
                  sx={{ borderRadius: 10 }}
                  onChange={handleFilterTextChange}
                  startAdornment={
                    <InputAdornment position="start">
                      Search <SearchIcon />
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} lg={2} md={2}>
              <Button
                variant="outlined"
                sx={{ textTransform: "none" }}
                onClick={() => setShowAddLecturePopup(true)}
              >
                Add Lectures
              </Button>
            </Grid>
          </Grid>
        </Box>
        <div>
          <Modal
            open={showAddLecturePopup}
            onClose={() => setShowAddLecturePopup(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={addLectureStyle}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12} lg={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">Class</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="class"
                      name="class"
                      label="Class"
                      value={selectedClass}
                      onChange={(e) =>
                        setNewLecture({ ...newLecture, class: e.target.value })
                      }
                    >
                      {academic &&
                        academic.classes &&
                        academic.classes.map((classes, index) => (
                          <MenuItem key={index} value={classes}>
                            {"Class : "}
                            {classes}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">
                      Subject
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="subject"
                      label="Subject"
                      value={newLecture.subject}
                      onChange={(e) =>
                        setNewLecture({
                          ...newLecture,
                          subject: e.target.value,
                        })
                      }
                    >
                      {academic &&
                        academic.subjects &&
                        academic.subjects.map((subject, index) => (
                          <MenuItem key={index} value={subject.name}>
                            {subject.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">Topic</InputLabel>
                    <Select
                      labelId="Topic Selection"
                      id="selectTopic"
                      name="chapterName"
                      label="Chapter Name"
                      value={newLecture.chapterName}
                      onChange={(e) =>
                        setNewLecture({
                          ...newLecture,
                          chapterName: e.target.value,
                        })
                      }
                    >
                      {filteredTopics &&
                        filteredTopics.map((topics, index) => (
                          <MenuItem key={index} value={topics.name}>
                            {topics.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <TextField
                    id="outlined-basic"
                    label="Lecture Number"
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={newLecture.lectureNumber}
                    onChange={(e) =>
                      setNewLecture({
                        ...newLecture,
                        lectureNumber: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <TextField
                    id="outlined-basic"
                    label="Video ID"
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={newLecture.videoId}
                    onChange={(e) =>
                      setNewLecture({
                        ...newLecture,
                        videoId: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid
                  item
                  container
                  justifyContent="center"
                  alignItems="center"
                >
                  <Button
                    onClick={handleAddNewLecture}
                    variant="contained"
                    color="success"
                    sx={{ borderRadius: 10 }}
                  >
                    Save Lecture
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Modal>
        </div>
        <Box sx={{ marginTop: 2 }}>
          <TableContainer sx={{ maxHeight: "80vh" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>SN</TableCell>
                  <TableCell align="center">Class</TableCell>
                  <TableCell align="center">Subject</TableCell>
                  <TableCell align="center">Chapter Name</TableCell>
                  <TableCell align="center">Lecture #</TableCell>
                  <TableCell align="center">Video ID</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody
                style={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}
              >
                {filteredLectures &&
                  filteredLectures.map((lecture, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell align="center">{lecture.class}</TableCell>
                      <TableCell align="center">{lecture.subject}</TableCell>
                      <TableCell align="center">
                        {lecture.chapterName}
                      </TableCell>
                      <TableCell align="center">
                        {lecture.lectureNumber}
                      </TableCell>
                      <TableCell align="center">{lecture.videoId}</TableCell>
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ justifyContent: "center" }}
                        >
                          <IconButton
                            onClick={() => handleDeleteLecture(lecture._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                          <IconButton>
                            {/* <EditIcon onClick={() => showEditVideo(lecture)} /> */}
                          </IconButton>
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ borderRadius: 10 }}
                            color="error"
                            onClick={() => playLectureAdmin(lecture.videoId)}
                          >
                            <i className="fa-brands fa-youtube"></i> &nbsp;Play
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Modal
          open={showVideoBox}
          onClose={() => setShowVideoBox(false)}
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
              boxShadow: 24,
              borderRadius: 3,
            }}
          >
            <YouTubeVideo videoId={currVID} />
          </Box>
        </Modal>
      </>
    );
  }

  return (
    <>
      {error && <div> Error: {error}</div>}
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={6} lg={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Class</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="selectedClass"
                name="selectedClass"
                label="Class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                {academic &&
                  academic.classes &&
                  academic.classes.map((classes, index) => (
                    <MenuItem key={index} value={classes}>
                      {"Class : "}
                      {classes}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} lg={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Subject</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="selectedSubject"
                name="selectedSubject"
                label="Subject"
                value={selectedSubject === "all" ? "All" : selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {academic &&
                  academic.subjects &&
                  academic.subjects.map((subject, index) => (
                    <MenuItem key={index} value={subject.name}>
                      {subject.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} lg={6}>
            <FormControl fullWidth size="small">
              <OutlinedInput
                sx={{ borderRadius: 10 }}
                onChange={handleFilterTextChange}
                startAdornment={
                  <InputAdornment position="start">
                    Search <SearchIcon />
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ marginTop: 2 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} lg={6} sx={{ order: { xs: 1, lg: 2 } }}>
            {showVideoPopup && (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ marginBottom: 1 }}
                  color="error"
                  onClick={() => setShowVideoPopup(false)}
                >
                  Close
                </Button>
                <Box sx={{ padding: 1 }}>
                  <YouTubeVideo videoId={currVID} />
                </Box>
              </>
            )}
          </Grid>
          <Grid item xs={12} lg={6} sx={{ order: { xs: 2, lg: 1 } }}>
            <TableContainer component={Paper} style={{ maxHeight: "80vh" }}>
              <Table aria-label="simple table">
                <TableHead className="bg bg-success sticky-top">
                  <TableRow>
                    <TableCell align="center" className="text-white">
                      Subject
                    </TableCell>
                    <TableCell align="center" className="text-white">
                      Chapter
                    </TableCell>
                    <TableCell align="center" className="text-white">
                      # of Lectures
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(lecturesByChapter).map((chapterName, index) => (
                    <React.Fragment key={index}>
                      {(index === 0 ||
                        chapterName !==
                          Object.keys(lecturesByChapter)[index - 1]) && (
                        <TableRow onClick={() => toggleChapter(chapterName)}>
                          <TableCell align="center">
                            {lecturesByChapter[chapterName][0].subject}
                          </TableCell>
                          <TableCell align="center">
                            {lecturesByChapter[chapterName][0].chapterName}
                          </TableCell>
                          <TableCell align="center">
                            {lecturesByChapter[chapterName].length}
                          </TableCell>
                        </TableRow>
                      )}
                      {collapsedChapter === chapterName && (
                        <TableRow key={index + "-collapse"}>
                          <TableCell colSpan="4">
                            <CollapsibleTable
                              lectures={lecturesByChapter[chapterName]}
                              playLecture={playLecture}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
