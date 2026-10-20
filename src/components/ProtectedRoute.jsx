import { Box, CircularProgress } from "@mui/material";
import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

// Frontend route guard (UX only - the backend enforces the real rules).
export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/courses" replace />;
  return children;
}
