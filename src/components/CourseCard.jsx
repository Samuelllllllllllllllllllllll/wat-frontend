import { Button, Card, CardActions, CardContent, Chip, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StatusChip from "./StatusChip";

// Card used by the student's course list and enrollments page
export default function CourseCard({ course, onEnroll, enrolling }) {
  const navigate = useNavigate();
  const canEnroll = course.status === "Open" && course.availableSeats > 0 && !course.isEnrolled;

  let enrollLabel = "Enroll";
  if (course.isEnrolled) enrollLabel = "Enrolled";
  else if (course.status !== "Open") enrollLabel = "Not open";
  else if (course.availableSeats === 0) enrollLabel = "Full";

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
          <Typography variant="h6" fontWeight={700}>{course.name}</Typography>
          <StatusChip status={course.status} />
        </Stack>
        <Typography color="text.secondary" mb={1.5}>by {course.teacherName}</Typography>
        <Typography variant="body2">
          {course.duration} days · Price {course.price.toLocaleString()}
        </Typography>
        <Typography variant="body2" mb={1.5}>
          Seats: {course.enrolledCount} / {course.maxStudent} taken
        </Typography>
        <Stack direction="row" gap={0.5} flexWrap="wrap">
          {course.topics.map((t) => <Chip key={t} label={t} size="small" variant="outlined" />)}
        </Stack>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button onClick={() => navigate(`/courses/${course._id}`)}>Details</Button>
        {onEnroll && (
          <Button variant="contained" disabled={!canEnroll || enrolling} onClick={() => onEnroll(course)}>
            {enrollLabel}
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
