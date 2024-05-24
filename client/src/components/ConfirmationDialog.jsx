import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Grid,
} from "@mui/material";

const ConfirmationDialog = ({
  open,
  handleClose,
  handleConfirm,
  message,
  header,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} sx={{ padding: 4 }}>
      <DialogTitle>{header}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions sx={{ padding: 3 }}>
        <Button variant="contained" color="error" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleConfirm} color="success">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
