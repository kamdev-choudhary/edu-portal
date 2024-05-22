import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./Auth";
import { Suspense } from "react";
import { CircularProgress } from "@mui/material";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <React.StrictMode>
      <Suspense fallback={<CircularProgress />}>
        <App />
      </Suspense>
    </React.StrictMode>
  </AuthProvider>
);
