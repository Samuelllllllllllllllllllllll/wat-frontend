//src/App.jsx

import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import CourseFormPage from "./pages/CourseFormPage";
import MyCoursesPage from "./pages/MyCoursesPage";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/new" element={<ProtectedRoute role="Teacher"><CourseFormPage /></ProtectedRoute>} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/courses/:id/edit" element={<ProtectedRoute role="Teacher"><CourseFormPage /></ProtectedRoute>} />
          <Route path="/my-courses" element={<ProtectedRoute role="Student"><MyCoursesPage /></ProtectedRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/courses" replace />} />
      </Routes>
    </HashRouter>
  );
}
