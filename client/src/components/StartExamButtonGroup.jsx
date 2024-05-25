import React from "react";
import { Box, Button, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const ResponsiveButtonGroup = ({
  handlePreviousQuestion,
  handleNextQuestion,
  exam,
  questions,
  currentQuestionIndex,
}) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("xs"));
  const isSm = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const isMd = useMediaQuery(theme.breakpoints.between("sm", "md"));

  let gridColumns = 1; // Default to 1 column

  if (isMd) {
    gridColumns = 2; // 2 columns for medium screens
  } else if (isSm) {
    gridColumns = 1; // 1 column for small screens
  } else if (isXs) {
    gridColumns = 1; // 1 column for extra small screens
  } else {
    gridColumns = 4; // 4 columns for large screens
  }

  return (
    <Box sx={{ p: 2, marginBottom: 2 }}>
      <Grid container spacing={2} columns={gridColumns}>
        <Grid item xs={12 / gridColumns}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#000",
              color: "white",
              textTransform: "none",
              minWidth: 160,
            }}
          >
            Clear
          </Button>
        </Grid>
        <Grid item xs={12 / gridColumns}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#800080",
              color: "white",
              textTransform: "none",
              minWidth: 160,
            }}
          >
            Mark for review and Next
          </Button>
        </Grid>
        <Grid item xs={12 / gridColumns}>
          <Button
            variant="contained"
            sx={{ textTransform: "none", minWidth: 160 }}
          >
            Previous
          </Button>
        </Grid>
        <Grid item xs={12 / gridColumns}>
          <Button
            variant="contained"
            color="success"
            sx={{ textTransform: "none", minWidth: 160 }}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResponsiveButtonGroup;
