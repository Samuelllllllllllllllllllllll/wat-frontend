import { useUser } from "../hooks/useUser";
import TeacherCoursesPage from "./TeacherCoursesPage";
import StudentCoursesPage from "./StudentCoursesPage";

// /courses shows a different list depending on the logged-in role
export default function CoursesPage() {
  const { isTeacher } = useUser();
  return isTeacher ? <TeacherCoursesPage /> : <StudentCoursesPage />;
}
