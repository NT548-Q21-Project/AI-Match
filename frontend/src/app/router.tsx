import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { CandidateLayout, RecruiterLayout, AuthLayout } from "../layouts/Layouts";

// Auth Pages
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

// Candidate Pages
import CandidateHomePage from "../pages/candidate/CandidateHomePage";
import CandidateCVPage from "../pages/candidate/CandidateCVPage";
import CandidateJobDetailPage from "../pages/candidate/CandidateJobDetailPage";
import CandidateApplicationsPage from "../pages/candidate/CandidateApplicationsPage";

// Recruiter Pages
import RecruiterJobsPage from "../pages/recruiter/RecruiterJobsPage";
import RecruiterCreateJobPage from "../pages/recruiter/RecruiterCreateJobPage";
import RecruiterJobDetailPage from "../pages/recruiter/RecruiterJobDetailPage";

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />

        {/* Candidate Routes */}
        <Route
          path="/candidate/*"
          element={
            <ProtectedRoute allowedRole="candidate">
              <CandidateLayout>
                <Routes>
                  <Route path="home" element={<CandidateHomePage />} />
                  <Route path="jobs/:jobId" element={<CandidateJobDetailPage />} />
                  <Route path="cvs" element={<CandidateCVPage />} />
                  <Route path="applications" element={<CandidateApplicationsPage />} />
                  <Route path="jobs" element={<Navigate to="/candidate/home" replace />} />
                  <Route path="*" element={<Navigate to="home" replace />} />
                </Routes>
              </CandidateLayout>
            </ProtectedRoute>
          }
        />

        {/* Recruiter Routes */}
        <Route
          path="/recruiter/*"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <RecruiterLayout>
                <Routes>
                  <Route path="jobs" element={<RecruiterJobsPage />} />
                  <Route path="jobs/create" element={<RecruiterCreateJobPage />} />
                  <Route path="jobs/:jobId" element={<RecruiterJobDetailPage />} />
                  <Route path="*" element={<Navigate to="jobs" replace />} />
                </Routes>
              </RecruiterLayout>
            </ProtectedRoute>
          }
        />

        {/* Default Redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
