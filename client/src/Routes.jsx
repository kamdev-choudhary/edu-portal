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
import LecturePage from "./pages/lectures/LecturePage";

import Profile from "./components/Profile";

export const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    available: ["admin"],
    element: <AdminDashboard />,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    available: ["student"],
    element: <StudentDashboard />,
  },
  {
    path: "/question-bank",
    name: "Dashboard",
    available: ["admin"],
    element: <QuestionBank />,
  },
  {
    path: "/library",
    name: "Libary",
    available: ["admin"],
    element: <Library />,
  },
  {
    path: "/admin",
    name: "Admin",
    available: ["admin"],
    element: <AdminPage />,
  },
  {
    path: "/library/issue",
    name: "Libary",
    available: ["admin"],
    element: <BookIssue />,
  },
  {
    path: "/exams",
    name: "Exams",
    available: ["admin", "student"],
    element: <Exams />,
  },
  {
    path: "/profile",
    name: "Profile",
    available: ["admin", "student"],
    element: <Profile />,
  },
  {
    path: "/lectures",
    name: "Lectures",
    available: ["admin", "student"],
    element: <LecturePage />,
  },
];
