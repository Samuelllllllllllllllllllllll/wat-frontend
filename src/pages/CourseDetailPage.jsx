import { useCallback, useEffect, useState } from "react";
import {
  Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, Divider, Grid, Paper, Snackbar, Stack, Table, TableBody, TableCell, TableHead,
  TableRow, Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { useUser } from "../hooks/useUser";
import StatusChip from "../components/StatusChip";

function Field({ label, children }) {
  return (
    <Grid size={{ xs: 6, sm: 3 }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography fontWeight={600} component="div">{children}</Typography>
    </Grid>
  );
}

// Course details. Teachers also see the enrolled students; students get an Enroll button.
export default function CourseDetailPage() {
  const { id } = useParams();
  const { isTeacher } = useUser();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    apiFetch(`/api/course/${id}`).then(setCourse).catch((e) => setError(e.message));
  }, [id]);
  useEffect(load, [load]);

  const enroll = async () => {
    setBusy(true);
    try {
      const res = await apiFetch(`/api/course/${id}/enroll`, { method: "POST" });
      setCourse(res.course);
      setToast("You are enrolled in this course");
    } catch (e) {
      setToast(e.message);
      load();
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setConfirmDelete(false);
    try {
      await apiFetch(`/api/course/${id}`, { method: "DELETE" });
      navigate("/courses");
    } catch (e) {
      setToast(e.message);
    }
  };

  if (error) {
    return (
      <>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/courses")}>Back to courses</Button>
      </>
    );
  }
  if (!course) return <Box textAlign="center" mt={6}><CircularProgress /></Box>;

  const canEnroll = course.status === "Open" && course.availableSeats > 0 && !course.isEnrolled;
  let enrollHint = "";
  if (course.isEnrolled) enrollHint = "You are already enrolled in this course.";
  else if (course.status !== "Open") enrollHint = "This course is not open for enrollment.";
  else if (course.availableSeats === 0) enrollHint = "This course is full.";

  return (
    <>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>Back</Button>
      <Paper sx={{ p: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h4" fontWeight={700}>{course.name}</Typography>
            <Typography color="text.secondary">Taught by {course.teacherName}</Typography>
          </Box>
          <StatusChip status={course.status} />
        </Stack>

        <Divider sx={{ my: 3 }} />
        <Grid container spacing={3}>
          <Field label="Duration">{course.duration} days</Field>
          <Field label="Price">{course.price.toLocaleString()}</Field>
          <Field label="Enrolled">{course.enrolledCount} / {course.maxStudent}</Field>
          <Field label="Seats left">{course.availableSeats}</Field>
        </Grid>

        <Typography variant="caption" color="text.secondary" display="block" mt={3} mb={1}>Topics</Typography>
        <Stack direction="row" gap={1} flexWrap="wrap">
          {course.topics.map((t) => <Chip key={t} label={t} variant="outlined" />)}
        </Stack>

        {isTeacher ? (
          <>
            <Stack direction="row" spacing={2} mt={4}>
              <Button variant="contained" onClick={() => navigate(`/courses/${id}/edit`)}>Edit course</Button>
              <Button
                color="error"
                variant="outlined"
                disabled={course.enrolledCount > 0}
                onClick={() => setConfirmDelete(true)}
              >
                Delete course
              </Button>
            </Stack>
            {course.enrolledCount > 0 && (
              <Typography variant="body2" color="text.secondary" mt={1}>
                A course with enrolled students cannot be deleted.
              </Typography>
            )}

            <Divider sx={{ my: 4 }} />
            <Typography variant="h6" fontWeight={700} mb={2}>
              Enrolled students ({course.students?.length ?? 0})
            </Typography>
            {course.students?.length ? (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {course.students.map((s, i) => (
                    <TableRow key={s._id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{s.username}</TableCell>
                      <TableCell>{s.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Alert severity="info">No students have enrolled yet.</Alert>
            )}
          </>
        ) : (
          <Box mt={4}>
            <Button variant="contained" size="large" disabled={!canEnroll || busy} onClick={enroll}>
              {course.isEnrolled ? "Enrolled" : busy ? "Enrolling..." : "Enroll in this course"}
            </Button>
            {enrollHint && <Typography variant="body2" color="text.secondary" mt={1}>{enrollHint}</Typography>}
          </Box>
        )}
      </Paper>

      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Delete course?</DialogTitle>
        <DialogContent>
          <DialogContentText>"{course.name}" will be permanently deleted.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button color="error" onClick={remove}>Delete</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={!!toast} autoHideDuration={4000} onClose={() => setToast("")} message={toast} />
    </>
  );
}
