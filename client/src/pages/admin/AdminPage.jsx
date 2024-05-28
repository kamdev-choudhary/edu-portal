import React, { useState } from "react";

// MUI components
import { Box } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";

// Admin Sections
import Users from "./Users";
import ExamMaster from "./ExamMaster";
import ErrorPage from "../ErrorPage";
import Academic from "./Academic";

const sections = [
  { name: "User", id: "user", icon: <PersonIcon />, page: <Users /> },
  { name: "Exam", id: "exam", icon: <DescriptionIcon />, page: <ExamMaster /> },
  {
    name: "Academic",
    id: "academic",
    icon: <SchoolIcon />,
    page: <Academic />,
  },
  {
    name: "Batch",
    id: "batch",
    icon: <GroupsIcon />,
    page: <ErrorPage />,
  },
];

const AdminPage = () => {
  const [currSection, setCurrSection] = useState("user");
  return (
    <>
      <Box
        sx={{
          border: "1px solid rgba(0,0,0,0.2)",
          height: "85vh",
          display: "flex",
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            borderRight: "1px solid rgba(0,0,0,0.2)",
            height: "100%",
            width: 300,
            padding: 2,
          }}
        >
          <Box
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            <List>
              {sections.map((section, index) => (
                <ListItem
                  disablePadding
                  key={index}
                  sx={{
                    backgroundColor:
                      section.id === currSection ? "#28844f" : "#fff",
                    borderRadius: 3,
                  }}
                >
                  <ListItemButton
                    sx={{ borderRadius: 3 }}
                    onClick={() => setCurrSection(section.id)}
                  >
                    <ListItemIcon
                      sx={{
                        color: section.id === currSection ? "#fff" : "#000",
                      }}
                    >
                      {section.icon}
                    </ListItemIcon>
                    <ListItemText
                      sx={{
                        color: section.id === currSection ? "#fff" : "#000",
                      }}
                      primary={section.name}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
        <Box
          fullWidth
          sx={{ padding: 2, width: "100%", height: "100%", overflow: "auto" }}
        >
          {sections
            .filter((section) => section.id === currSection)
            .map((section) => section.page)}
        </Box>
      </Box>
    </>
  );
};

export default AdminPage;
