import React, { useEffect, useState } from "react";
import axios from "axios";

// MUI components
import Box from "@mui/material/Box";
import { Grid, Typography, IconButton } from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import DeleteIcon from "@mui/icons-material/Delete";

import AddIcon from "@mui/icons-material/Add";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const Academic = () => {
  const [academic, setAcademic] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState([]);
  const [filteredSubject, setFilteredSubject] = useState([]);
  const [filteredTopic, setFilteredTopic] = useState([]);

  const customStyleForList = {
    "&:hover": {
      backgroundColor: "#28844f",
      color: "#fff",
    },
    "&.Mui-selected": {
      backgroundColor: "#28844f",
      color: "#fff",
      "&:hover": {
        backgroundColor: "#28844e",
      },
    },
  };

  useEffect(() => {
    const getAcademicData = async () => {
      const response = await axios.get(`${API_URL}/academic`);
      if (response.status === 200) {
        setAcademic(response.data.academic);
        setSelectedClass("IX");
      }
    };
    getAcademicData();
  }, []);

  useEffect(() => {
    const subjects = academic?.subjects?.filter((subject) => {
      return subject.topics.some((topic) => topic.className === selectedClass);
    });

    setFilteredSubject(subjects);
  }, [selectedClass]);

  useEffect(() => {
    const filterTopics = () => {
      const filtered = academic?.subjects
        ?.filter((subject) => subject.name === selectedSubject)
        ?.flatMap((subject) =>
          subject.topics.filter((topic) => topic.className === selectedClass)
        );
      setFilteredTopic(filtered);
    };

    filterTopics();
  }, [selectedClass, selectedSubject]);

  // console.log(academic);
  // console.log(filteredSubject);

  return (
    <>
      <Box>
        <Grid container gap={2}>
          <Grid item xs={12} md={6} lg={2}>
            <Box
              sx={{
                width: "100%",
                maxWidth: 360,
              }}
            >
              <List
                sx={{ border: "1px solid rgba(0,0,0,0.2)", borderRadius: 2 }}
              >
                <Box
                  sx={{
                    padding: "0 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6">Classes</Typography>
                  <IconButton>
                    <AddIcon />
                  </IconButton>
                </Box>
                <Divider />
                {academic?.classes?.map((classNames, index) => (
                  <React.Fragment key={index}>
                    <ListItemButton
                      sx={customStyleForList}
                      selected={selectedClass === classNames}
                      onClick={() => setSelectedClass(classNames)}
                    >
                      <ListItemText primary={classNames} />
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemButton>
                  </React.Fragment>
                ))}
              </List>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Box
              sx={{
                width: "100%",
                maxWidth: 360,
              }}
            >
              <List
                sx={{ border: "1px solid rgba(0,0,0,0.2)", borderRadius: 2 }}
              >
                <Box
                  sx={{
                    padding: "0 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6">Subjects</Typography>
                  <IconButton>
                    <AddIcon />
                  </IconButton>
                </Box>
                <Divider />
                {filteredSubject?.map((subject, index) => (
                  <React.Fragment key={index}>
                    <ListItemButton
                      sx={customStyleForList}
                      selected={selectedSubject === subject.name}
                      onClick={() => setSelectedSubject(subject.name)}
                    >
                      <ListItemText primary={subject.name} />
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemButton>
                  </React.Fragment>
                ))}
              </List>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Box
              sx={{
                width: "100%",
                maxWidth: 360,
              }}
            >
              <List
                sx={{ border: "1px solid rgba(0,0,0,0.2)", borderRadius: 2 }}
              >
                <Box
                  sx={{
                    padding: "0 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6">Topics</Typography>
                  <IconButton>
                    <AddIcon />
                  </IconButton>
                </Box>
                <Divider />
                {filteredTopic?.map((topic, index) => (
                  <React.Fragment key={index}>
                    <ListItemButton
                      sx={customStyleForList}
                      selected={selectedTopic === topic}
                      onClick={() => setSelectedTopic(topic)}
                    >
                      <ListItemText primary={topic.name} />
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemButton>
                  </React.Fragment>
                ))}
              </List>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Box
              sx={{
                width: "100%",
                maxWidth: 360,
              }}
            >
              <List
                sx={{ border: "1px solid rgba(0,0,0,0.2)", borderRadius: 2 }}
              >
                <Box
                  sx={{
                    padding: "0 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6">Subjects</Typography>
                  <IconButton>
                    <AddIcon />
                  </IconButton>
                </Box>
                <Divider />
                {console.log(selectedTopic)}
                {selectedTopic?.subtopics?.map((subtopic, index) => (
                  <React.Fragment key={index}>
                    <ListItemButton
                      sx={customStyleForList}
                      // selected={selectedSubject === subject.name}
                      // onClick={() => setSelectedSubject(subtopic)}
                    >
                      <ListItemText primary={subtopic.name} />
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemButton>
                  </React.Fragment>
                ))}
              </List>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={3}></Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Academic;
