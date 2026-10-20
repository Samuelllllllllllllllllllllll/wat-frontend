import { useCallback, useEffect, useState } from "react";
import {
  Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, IconButton, Paper, Snackbar, Stack, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Tooltip, Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";
import StatusChip from "../components/StatusChip";

// Teacher's own course list (with view / edit / delete actions)
export default function TeacherCoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState(null);
  const [error, setError] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const [toast, setToast] = useState("");

  const load = useCallback(() => {
    apiFetch("/api/course")
      .then(setCourses)
      .catch((e) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  const confirmDelete = async () => {
    const course = toDelete;
    setToDelete(null);
    try {
      await apiFetch(`/api/course/${course._id}`, { method: "DELETE" });
      setToast(`"${course.name}" deleted`);
      load();
    } catch (e) {
      setToast(e.message); // e.g. "Cannot delete a course that already has enrolled students"
    }
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>My Courses</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/courses/new")}>
          Create course
        </Button>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}
      {!courses && !error && <Box textAlign="center" mt={6}><CircularProgress /></Box>}
      {courses && courses.length === 0 && (
        <Alert severity="info">You have not created any courses yet.</Alert>
      )}
      {courses && courses.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course</TableCell>
                <TableCell align="right">Duration (days)</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Enrolled / Max</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((c) => (
                <TableRow key={c._id} hover>
                  <TableCell>
                    <Typography fontWeight={600}>{c.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{c.topics.join(", ")}</Typography>
                  </TableCell>
                  <TableCell align="right">{c.duration}</TableCell>
                  <TableCell align="right">{c.price.toLocaleString()}</TableCell>
                  <TableCell align="right">{c.enrolledCount} / {c.maxStudent}</TableCell>
                  <TableCell><StatusChip status={c.status} /></TableCell>
                  <TableCell align="right">
                    <Tooltip title="View details & students">
                      <IconButton onClick={() => navigate(`/courses/${c._id}`)}><VisibilityIcon /></IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => navigate(`/courses/${c._id}/edit`)}><EditIcon /></IconButton>
                    </Tooltip>
                    <Tooltip title={c.enrolledCount > 0 ? "Cannot delete: students are enrolled" : "Delete"}>
                      <span>
                        <IconButton color="error" disabled={c.enrolledCount > 0} onClick={() => setToDelete(c)}>
                          <DeleteIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={!!toDelete} onClose={() => setToDelete(null)}>
        <DialogTitle>Delete course?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            "{toDelete?.name}" will be permanently deleted. This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToDelete(null)}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={!!toast} autoHideDuration={4000} onClose={() => setToast("")} message={toast} />
    </>
  );
}
