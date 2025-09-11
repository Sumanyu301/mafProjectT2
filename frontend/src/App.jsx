import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";  
import AdminProjects from "./pages/AdminProjects";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage"; 

import ProtectedRoute from "./pages/ProtectedRoute";
import Layout from "./pages/Layout";

import EmployeeProfile from "./pages/EmployeeProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route element={<Layout />}>
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-project"
            element={
              <ProtectedRoute>
                <AdminProjects />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/edit-project/:id" 
            element={
              <ProtectedRoute>
                <AdminProjects />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<ProjectsPage />} />
        </Route>
        
        <Route path="/projects/:id" element={<ProjectDetailsPage />} />

        <Route path="/profile" element={<EmployeeProfile />} />

      </Routes>
    </Router>
  );
}

export default App;
