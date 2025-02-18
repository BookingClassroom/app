import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import AuthPage from "./pages/AuthFormPage";
import ClassroomPage from "./pages/ClassroomPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import RlyImportantComponent from "./components/RlyImportantComponent";
import LogoutButton from "./components/LogoutButton";
import HomePage from "./pages/HomePage";
import ClassroomDetailsPage from "./pages/ClassroomDetailsPage";
import ManageClassroomsButton from "./components/AdminButton";
import ReservationPage from "./pages/ReservationPage";
import ClassroomListPage from "./pages/ClassroomListPage";
import MyReservationsPage from "./pages/MyReservationPage";

const AppContent = () => {
  const location = useLocation();
  const token = localStorage.getItem("access_token");

  return (
    <>
      <Toaster position="top-right" />
      <RlyImportantComponent />
      {token && location.pathname !== "/auth" && (
        <div className="p-6 flex justify-end gap-4">
          <ManageClassroomsButton />
          <LogoutButton />
        </div>
      )}

      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/classrooms"
          element={
            <ProtectedRoute>
              <ClassroomPage />
            </ProtectedRoute>
          }
        />
        <Route path="/my-reservations" element={<MyReservationsPage />} />
        <Route path="/classroom/:id" element={<ClassroomDetailsPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/classroom" element={<ClassroomListPage />} />
        <Route path="/reservation" element={<ReservationPage />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
