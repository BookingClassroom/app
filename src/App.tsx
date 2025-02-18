import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthFormPage";
import ClassroomPage from "./pages/ClassroomPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import RlyImportantComponent from "./components/RlyImportantComponent";
import Navbar from "./components/ui/Navbar";
import HomePage from "./pages/HomePage";
import ClassroomDetailsPage from "./pages/ClassroomDetailsPage";
import ReservationPage from "./pages/ReservationPage";
import ClassroomListPage from "./pages/ClassroomListPage";
import MyReservationsPage from "./pages/MyReservationPage";

const AppContent = () => {
  return (
    <>
      <Navbar />
      <Toaster position="top-right" />
      <RlyImportantComponent />

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
