import React from "react";

// Admin
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import QuestionBank from "./pages/questions/QuestionBank";
import Library from "./pages/library/Library";
import AdminPage from "./pages/admin/AdminPage";
import BookIssue from "./pages/library/BookIssue";

// Scholar
import StudentDashboard from "./pages/dashboard/ScholarDashboard";
import Exams from "./pages/exams/Exams";

export const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    available: ["admin"],
    element: <AdminDashboard />, // Use JSX element here
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    available: ["student"],
    element: <StudentDashboard />, // Use JSX element here
  },
  {
    path: "/question-bank",
    name: "Dashboard",
    available: ["admin"],
    element: <QuestionBank />, // Use JSX element here
  },
  {
    path: "/library",
    name: "Libary",
    available: ["admin"],
    element: <Library />, // Use JSX element here
  },
  {
    path: "/admin",
    name: "Admin",
    available: ["admin"],
    element: <AdminPage />, // Use JSX element here
  },
  {
    path: "/library/issue",
    name: "Libary",
    available: ["admin"],
    element: <BookIssue />, // Use JSX element here
  },
  {
    path: "/exams",
    name: "Exams",
    available: ["admin", "student"],
    element: <Exams />, // Use JSX element here
  },
];
