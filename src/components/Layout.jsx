import { AppBar, Box, Button, Chip, Container, Toolbar, Typography } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link as RouterLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

export default function Layout() {
  const { user, logout, isTeacher } = useUser();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const links = isTeacher
    ? [{ to: "/courses", label: "My Courses" }, { to: "/courses/new", label: "Create Course" }]
    : [{ to: "/courses", label: "All Courses" }, { to: "/my-courses", label: "My Enrollments" }];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.100" }}>
      <AppBar position="static">
        <Toolbar sx={{ gap: 1, flexWrap: "wrap" }}>
          <SchoolIcon />
          <Typography variant="h6" sx={{ mr: 2 }}>
            Online Course Service
          </Typography>
          {links.map((l) => (
            <Button
              key={l.to}
              color="inherit"
              component={RouterLink}
              to={l.to}
              sx={{ fontWeight: pathname === l.to ? 700 : 400, borderBottom: pathname === l.to ? "2px solid white" : "none", borderRadius: 0 }}
            >
              {l.label}
            </Button>
          ))}
          <Box sx={{ flexGrow: 1 }} />
          <Chip label={`${user.username} · ${user.role}`} color="secondary" size="small" />
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
