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

const AppContent = () => {
  const location = useLocation();
  const token = localStorage.getItem("access_token");

  return (
    <>
      <Toaster position="top-right" />
      <RlyImportantComponent />

      {/* ✅ Cache la div complète si on est sur /auth ou si l'utilisateur n'est pas connecté */}
      {token && location.pathname !== "/auth" && (
        <div className="p-6 flex justify-end">
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
        <Route path="/" element={<h1>Accueil</h1>} />
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
