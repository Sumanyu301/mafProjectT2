import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminProjects from "./pages/AdminProjects";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* later: <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/admin" element={<AdminProjects />} />
      </Routes>
    </Router>
  );
}

export default App;
