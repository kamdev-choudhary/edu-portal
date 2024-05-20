import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// MUI Components
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Container } from "@mui/material";

// custom components
import { useAuth } from "../Auth";
import { routes } from "../Routes";
import Navbar from "./Navbar";

export default function DefaultLayout() {
  const { role } = useAuth();

  return (
    <React.Fragment>
      <CssBaseline />
      <Navbar />
      <Container maxWidth="xl" sx={{ marginTop: 2 }}>
        <Routes>
          {routes
            .filter(
              (route) =>
                Array.isArray(route.available) && route.available.includes(role)
            )
            .map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </React.Fragment>
  );
}
