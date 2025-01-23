import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Authentication/Login/Login";
import VerifyOTP from "./pages/Authentication/VerifyOtp/VerifyOTP";
import ResetPassword from "./pages/Authentication/ResetPassword/ResetPassword";
import RecoverPassword from "./pages/Authentication/RecoverPassword/RecoverPassword";
import Dashboard from "./pages/Dashboard/Dashboard";
import Campaigns from "./pages/Campaigns/CampaignList";
import CampaignForm from "./pages/Campaigns/CampaignForm";
import Dispute from "./pages/Disputes/Dispute";
import Reports from "./pages/Reports/Reports";
import ReferralTable from "./pages/Referrals/ReferralStatusTable";
import Settings from "./pages/Settings/Settings";
import AdminSettings from "./pages/Settings/AdminSettings";
import NotFound from "./pages/NotFound/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/recover-password" element={<RecoverPassword />} />

      {/* Protected Route for Dashboard and Campaigns */}
      <Route>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/campaigns"
          element={
            <ProtectedRoute>
              <Campaigns />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-campaign"
          element={
            <ProtectedRoute>
              <CampaignForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/disputes"
          element={
            <ProtectedRoute>
              <Dispute />
            </ProtectedRoute>
          }
        />
        <Route
          path="/referrals"
          element={
            <ProtectedRoute>
              <ReferralTable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-settings"
          element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route
        path="/reset-password"
        element={
          <ProtectedRoute>
            <ResetPassword />
          </ProtectedRoute>
        }
      />

      {/* 404 Not Found Route */}
      <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
    </Routes>
  );
};

export default AppRoutes;
