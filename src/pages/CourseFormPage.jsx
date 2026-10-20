import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Paper, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../lib/api";
import CourseForm from "../components/CourseForm";

// Teacher: create a course (/courses/new) or edit one (/courses/:id/edit)
export default function CourseFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    apiFetch(`/api/course/${id}`).then(setCourse).catch((e) => setError(e.message));
  }, [id, isEdit]);

  const handleSubmit = async (payload) => {
    if (isEdit) {
      await apiFetch(`/api/course/${id}`, { method: "PUT", body: payload });
      navigate(`/courses/${id}`);
    } else {
      const created = await apiFetch("/api/course", { method: "POST", body: payload });
      navigate(`/courses/${created._id}`);
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 760, mx: "auto" }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        {isEdit ? "Edit course" : "Create a new course"}
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {isEdit && !course && !error && <Box textAlign="center"><CircularProgress /></Box>}
      {(!isEdit || course) && (
        <CourseForm
          initial={course}
          submitLabel={isEdit ? "Save changes" : "Create course"}
          onSubmit={handleSubmit}
          onCancel={() => navigate(isEdit ? `/courses/${id}` : "/courses")}
        />
      )}
    </Paper>
  );
}
