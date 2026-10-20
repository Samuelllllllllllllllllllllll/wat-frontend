import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Grid, Typography } from "@mui/material";
import { apiFetch } from "../lib/api";
import CourseCard from "../components/CourseCard";

// Student: the courses the student is enrolled in
export default function MyCoursesPage() {
  const [courses, setCourses] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/api/course?enrolled=true").then(setCourses).catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <Typography variant="h4" fontWeight={700} mb={3}>My Enrollments</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {!courses && !error && <Box textAlign="center" mt={6}><CircularProgress /></Box>}
      {courses && courses.length === 0 && (
        <Alert severity="info">You have not enrolled in any course yet. Browse "All Courses" to get started.</Alert>
      )}
      {courses && (
        <Grid container spacing={3}>
          {courses.map((c) => (
            <Grid key={c._id} size={{ xs: 12, sm: 6, md: 4 }}>
              <CourseCard course={c} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
