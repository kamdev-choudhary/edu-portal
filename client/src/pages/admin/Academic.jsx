import React, { useEffect, useState } from "react";
import axios from "axios";

// MUI components
import Box from "@mui/material/Box";
import { Grid, Typography, IconButton } from "@mui/material";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

import AddIcon from "@mui/icons-material/Add";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const Academic = () => {
  const [academic, setAcademic] = useState([]);
  const [selectedClass, setSelectedClass] = useState("IX");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSubSubject, setSelectedSubSubject] = useState([]);
  const [filteredSubject, setFilteredSubject] = useState([]);

  useEffect(() => {
    const getAcademicData = async () => {
      const response = await axios.get(`${API_URL}/academic`);
      if (response.status === 200) {
        setAcademic(response.data.academic);
      }
    };
    getAcademicData();
  }, []);

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
                component="nav"
                aria-label="secondary mailbox folder"
                sx={{ border: "1px solid rgba(0,0,0,0.2)", borderRadius: 2 }}
              >
                <Box
                  sx={{
                    padding: 1,
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
                      sx={{}}
                      selected={selectedClass === classNames}
                      onClick={() => setSelectedClass(classNames)}
                    >
                      <ListItemText primary={classNames} />
                    </ListItemButton>
                  </React.Fragment>
                ))}
              </List>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={3}></Grid>
          <Grid item xs={12} md={6} lg={3}></Grid>
          <Grid item xs={12} md={6} lg={3}></Grid>
          <Grid item xs={12} md={6} lg={3}></Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Academic;
