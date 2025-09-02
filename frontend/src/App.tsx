import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobList from "./components/JobList";
import PostJob from "./components/PostJob";
import MyJobs from "./components/MyJobs";
import AppliedJobs from "./components/AppliedJobs";

const AppContent: React.FC = () => {
  const { isAuthenticated, isEmployer, isDeveloper } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow pt-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <Register /> : <Navigate to="/" />}
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                isDeveloper ? (
                  <JobList />
                ) : (
                  <MyJobs />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/jobs"
            element={
              isAuthenticated && isDeveloper ? (
                <JobList />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/post-job"
            element={
              isAuthenticated && isEmployer ? (
                <PostJob />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/my-jobs"
            element={
              isAuthenticated && isEmployer ? (
                <MyJobs />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/applied-jobs"
            element={
              isAuthenticated && isDeveloper ? (
                <AppliedJobs />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Footer */}
      
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
