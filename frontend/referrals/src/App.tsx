// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/Login";
import DashboardPage from "./Pages/DashboardPage";
import PrivateRoute from "./lib/PrivateRoute";
import DisputesPage from "./Pages/DisputesPage";
import ReportsPage from "./Pages/ReportsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <ReportsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/disputes"
          element={
            <PrivateRoute>
              <DisputesPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
