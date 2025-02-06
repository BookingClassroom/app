import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthFormPage";
import ClassroomPage from "./pages/ClassroomPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import RlyImportantComponent from "./components/RlyImportantComponent";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <RlyImportantComponent />
      <Router>
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
      </Router>
    </>
  );
}

export default App;
