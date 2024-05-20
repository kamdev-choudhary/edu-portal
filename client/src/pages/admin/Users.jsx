import { useEffect, useState } from "react";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  InputAdornment,
  FormControl,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  OutlinedInput,
  Box,
  Skeleton,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [accountTypeFilter, setAccountTypeFilter] = useState("admin");
  const [showStudentDashboard, setShowStudentDashboard] = useState(false);
  const [currUser, setCurrUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/admin/users`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data.users);
        setIsLoading(false);
      })
      .catch((error) => setError(error.message));
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      Object.values(user).some(
        (field) =>
          (typeof field === "string" || typeof field === "number") &&
          field.toString().toLowerCase().includes(searchInput.toLowerCase())
      ) && user?.role?.toLowerCase() === accountTypeFilter.toLowerCase()
  );

  if (isLoading) {
    return (
      <>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={6}>
            <Skeleton
              sx={{ borderRadius: 10 }}
              variant="rectangular"
              height={40}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Skeleton
              sx={{ borderRadius: 10 }}
              variant="rectangular"
              height={40}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Skeleton
              sx={{ borderRadius: 10 }}
              variant="rectangular"
              height={40}
            />
          </Grid>
          <Grid item xs={12} lg={12}>
            <Skeleton
              sx={{ borderRadius: 2 }}
              variant="rectangular"
              height={1}
            />
          </Grid>
          <Grid item xs={12} lg={12} md={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: "#28844f" }}>
                  <TableRow>
                    <TableCell sx={{ color: "#fff" }}>SN</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Name</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Email</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Mobile</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Account Type</TableCell>
                    <TableCell sx={{ color: "#fff" }}>Details</TableCell>
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
          </Grid>
        </Grid>
      </>
    );
  }

  return (
    <>
      <Box fullWidth>
        <Grid container spacing={2}>
          <Grid item xs={12} md={7} lg={7}>
            <Box>
              <FormControl fullWidth size="small">
                <OutlinedInput
                  sx={{ borderRadius: 10 }}
                  id="outlined-adornment-amount"
                  startAdornment={
                    <InputAdornment position="start">
                      Search <SearchIcon />
                    </InputAdornment>
                  }
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={6} md={3} lg={3}>
            <Box>
              <FormControl fullWidth size="small">
                <InputLabel id="account-type-label">Account Type</InputLabel>
                <Select
                  labelId="account-type-label"
                  id="account-type"
                  label="Account Type"
                  value={accountTypeFilter}
                  onChange={(e) => setAccountTypeFilter(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="student" selected>
                    Student
                  </MenuItem>
                  <MenuItem value="faculty">Faculty</MenuItem>
                  <MenuItem value="operator">Data Operator</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={6} md={2} lg={2}>
            <Button
              fullWidth
              variant="contained"
              color="info"
              sx={{ borderRadius: 10 }}
            >
              Add User
            </Button>
          </Grid>
        </Grid>
        {accountTypeFilter === "student" && (
          <Box sx={{ marginBottom: 1, marginTop: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3} lg={3}>
                <Box>
                  <FormControl fullWidth size="small">
                    <InputLabel id="account-type-label">
                      Account Type
                    </InputLabel>
                    <Select
                      labelId="account-type-label"
                      id="account-type"
                      label="Account Type"
                      value={accountTypeFilter}
                      onChange={(e) => setAccountTypeFilter(e.target.value)}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="student" selected>
                        Student
                      </MenuItem>
                      <MenuItem value="faculty">Faculty</MenuItem>
                      <MenuItem value="operator">Data Operator</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={6} md={2} lg={2}></Grid>
            </Grid>
          </Box>
        )}
        {/* Users */}
        <Box sx={{ marginTop: 2 }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead className="bg bg-success ">
                <TableRow>
                  <TableCell align="center" className="text-white">
                    SN
                  </TableCell>
                  <TableCell align="center" className="text-white">
                    Name
                  </TableCell>
                  <TableCell align="center" className="text-white">
                    Email
                  </TableCell>
                  <TableCell align="center" className="text-white">
                    Mobile
                  </TableCell>
                  <TableCell align="center" className="text-white">
                    Account Type
                  </TableCell>
                  <TableCell align="center" className="text-white">
                    Details
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow
                    key={user._id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{user.name}</TableCell>
                    <TableCell align="center">{user.email}</TableCell>
                    <TableCell align="center">{user.mobile}</TableCell>
                    <TableCell align="center">{user.role}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="sm"
                        onClick={() => {
                          setShowStudentDashboard(true);
                          setCurrUser(user);
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      {/* <Modal
        show={showStudentDashboard}
        onHide={() => setShowStudentDashboard(false)}
        dialogClassName="modal-xl"
      >
        <Modal.Header>Student DashBoard</Modal.Header>
        <Modal.Body>
          <StudentProfile user={currUser} />
        </Modal.Body>
      </Modal> */}
    </>
  );
}
