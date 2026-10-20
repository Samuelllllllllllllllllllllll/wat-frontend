import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Grid, InputAdornment, Snackbar, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { apiFetch } from "../lib/api";
import CourseCard from "../components/CourseCard";

// Student: all non-cancelled courses, filter by course name or teacher name
export default function StudentCoursesPage() {
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [enrollingId, setEnrollingId] = useState(null);

  // Debounced server-side filtering
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      apiFetch(`/api/course?search=${encodeURIComponent(search.trim())}`)
        .then((data) => { if (!cancelled) { setCourses(data); setError(""); } })
        .catch((e) => { if (!cancelled) setError(e.message); });
    }, 300);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [search]);

  const enroll = async (course) => {
    setEnrollingId(course._id);
    try {
      const res = await apiFetch(`/api/course/${course._id}/enroll`, { method: "POST" });
      setCourses((list) => list.map((c) => (c._id === course._id ? res.course : c)));
      setToast(`Enrolled in "${course.name}"`);
    } catch (e) {
      setToast(e.message);
      // refresh in case the course changed (full / closed) since the list loaded
      apiFetch(`/api/course?search=${encodeURIComponent(search.trim())}`).then(setCourses).catch(() => {});
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <>
      <Typography variant="h4" fontWeight={700} mb={3}>Courses</Typography>
      <TextField
        fullWidth
        placeholder="Search by course name or teacher name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3, bgcolor: "background.paper" }}
        slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> } }}
      />
      {error && <Alert severity="error">{error}</Alert>}
      {!courses && !error && <Box textAlign="center" mt={6}><CircularProgress /></Box>}
      {courses && courses.length === 0 && <Alert severity="info">No courses match your search.</Alert>}
      {courses && (
        <Grid container spacing={3}>
          {courses.map((c) => (
            <Grid key={c._id} size={{ xs: 12, sm: 6, md: 4 }}>
              <CourseCard course={c} onEnroll={enroll} enrolling={enrollingId === c._id} />
            </Grid>
          ))}
        </Grid>
      )}
      <Snackbar open={!!toast} autoHideDuration={4000} onClose={() => setToast("")} message={toast} />
    </>
  );
}
