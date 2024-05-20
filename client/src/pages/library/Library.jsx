import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// MUI Components
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Box,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Modal,
} from "@mui/material";

import { Search as SearchIcon } from "@mui/icons-material";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const Library = () => {
  const navigate = useNavigate();

  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [bookList, setBookList] = useState([]);
  const [filterData, setFilterData] = useState({
    subject: "",
  });
  return (
    <>
      <Box sx={{ marginBottom: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={3}>
            <FormControl fullWidth size="small" sx={{ borderRadius: 2 }}>
              <InputLabel id="demo-simple-select-label">Subject</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filterData.subject}
                label="Subject"
                onChange={(e) =>
                  setFilterData({ ...filterData, subject: e.target.value })
                }
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="physics">Physics</MenuItem>
                <MenuItem value="chemistry">Chemistry</MenuItem>
                <MenuItem value="mathematics">Mathematics</MenuItem>
                <MenuItem value="biology">Biology</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} lg={3}></Grid>
          <Grid item xs={12} md={6} lg={3}></Grid>
          <Grid item xs={12} md={6} lg={3}></Grid>
        </Grid>
      </Box>
      {/* Search Bar */}
      <Box sx={{ marginBottom: 2 }}>
        <Grid container flexGrow={1} spacing={2}>
          <Grid item xs={12} md={6} lg={7}>
            <FormControl fullWidth size="small">
              <OutlinedInput
                sx={{ borderRadius: 10 }}
                id="outlined-adornment-amount"
                startAdornment={
                  <InputAdornment position="start">
                    Search <SearchIcon />
                  </InputAdornment>
                }
                // value={searchInput}
                // onChange={handleSearchInputChange}
              />
            </FormControl>
          </Grid>
          <Grid item>
            <Button
              onClick={() => setShowAddBookModal(true)}
              variant="contained"
              sx={{ textTransform: "none" }}
            >
              Add New Book
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => navigate("/library/issue")}
              variant="contained"
              sx={{ textTransform: "none" }}
            >
              Issue Book
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => navigate("/library/return")}
              variant="contained"
              sx={{ textTransform: "none" }}
            >
              Return Book
            </Button>
          </Grid>
        </Grid>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>SN</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Subject</TableCell>
              <TableCell align="right">Publishing Year</TableCell>
              <TableCell align="right">Total Quantity</TableCell>
              <TableCell align="right">Total Issued</TableCell>
              <TableCell align="right">Total Available</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookList.map((book) => (
              <TableRow
                key={book._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {book.name}
                </TableCell>
                <TableCell align="right">{book.calories}</TableCell>
                <TableCell align="right">{book.fat}</TableCell>
                <TableCell align="right">{book.carbs}</TableCell>
                <TableCell align="right">{book.protein}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        open={showAddBookModal}
        onClose={() => setShowAddBookModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            border: "1px solid rgba(0,0,0,0.2)",
            borderRadius: 2,
            boxShadow: 10,
            p: 2,
          }}
        >
          <p style={{ position: "fixed", top: 0, left: 20, fontSize: 25 }}>
            Add Book
          </p>
          <Box
            fullWidth
            sx={{ display: "flex", justifyContent: "right", marginBottom: 2 }}
          >
            <Button
              onClick={() => setShowAddBookModal(false)}
              variant="contained"
              color="error"
              sx={{ textTransform: "none", borderRadius: 10 }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Library;
