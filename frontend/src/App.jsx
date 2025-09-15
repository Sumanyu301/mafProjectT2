import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Signup from "./pages/Signup";  
import AdminProjects from "./pages/AdminProjects";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage"; 
import ProtectedRoute from "./pages/ProtectedRoute";
import Layout from "./pages/Layout";
import EmployeeProfile from "./pages/EmployeeProfile";
import { ProjectProvider } from "./contexts/ProjectContext";

function App() {
  return (
    <ProjectProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
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
            <Route 
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <ProjectsPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/projects/:id"
              element={
                <ProtectedRoute>
                  <ProjectDetailsPage />
                </ProtectedRoute>
              }
            />

            <Route 
              path="/profile"
              element={
                <ProtectedRoute>
                  <EmployeeProfile />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <EmployeeProfile />
                </ProtectedRoute>
              } 
            />
          </Route>
          
        </Routes>

        {/* ✅ Global Toast Notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            success: {
              style: { background: "#4ade80", color: "#fff" }, // green
            },
            error: {
              style: { background: "#ef4444", color: "#fff" }, // red
            },
          }}
        />
      </Router>
    </ProjectProvider>
  );
}

export default App;
