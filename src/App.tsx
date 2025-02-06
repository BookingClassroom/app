import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./pages/AuthForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Accueil</h1>} />
        <Route path="/auth" element={<AuthForm />} />
      </Routes>
    </Router>
  );
}

export default App;
