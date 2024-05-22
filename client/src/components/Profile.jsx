import React, { useEffect, useState } from "react";
import { useAuth } from "../Auth";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Container,
  IconButton,
  Typography,
  Box,
} from "@mui/material";

const UserProfileCard = () => {
  const { username, userId, role, batchId } = useAuth();
  const [user, setUser] = useState([]);
  const [batch, setBatch] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/auth/user/${userId}`)
      .then((response) => response.json())
      .then((data) => setUser(data.user))
      .catch((error) => console.log(error));

    if (role === "student") {
      fetch(`${API_URL}/batch/${batchId}`)
        .then((response) => response.json())
        .then((data) => setBatch(data.batch))
        .catch((error) => console.log(error));
    }
  }, []);

  return (
    <Container maxWidth="md">
      <Card>
        <CardHeader
          avatar={<Avatar aria-label="user avatar">{user.initials}</Avatar>}
          title={user.name}
          //   action={
          //     <IconButton onClick={handleEditClick}>
          //       <EditIcon />
          //     </IconButton>
          //   }
        />
        <CardContent>
          <Box
            sx={{
              display: "grid",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Typography variant="body">Email: {user.email}</Typography>
            <Typography variant="body">Phone number: {user.mobile}</Typography>
            {role === "student" && (
              <>
                <Typography variant="body">
                  Batch Name: {batch.batchName}
                </Typography>
                <Typography variant="body">
                  Batch Class: {batch.batchClass}
                </Typography>
                <Typography variant="body">
                  Batch Strength: {batch?.scholars?.length}
                </Typography>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserProfileCard;
