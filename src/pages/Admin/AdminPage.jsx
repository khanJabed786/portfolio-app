import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import { isAdminUser, watchAuth } from "../../config/adminAuth.js";

const AdminLogin = React.lazy(() => import("./AdminLogin.jsx"));
const AdminDashboard = React.lazy(() => import("./AdminDashboard.jsx"));

function RequireAdmin({ children }) {
  const [state, setState] = useState({ loading: true, ok: false });
  const location = useLocation();

  useEffect(() => {
    const unsub = watchAuth((user) => {
      setState({ loading: false, ok: isAdminUser(user) });
    });
    return () => unsub();
  }, []);

  if (state.loading) return <LoadingSpinner fullScreen />;

  if (!state.ok) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default function AdminPage() {
  return (
    <React.Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="login" element={<AdminLogin />} />
        <Route
          path="dashboard"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />
      </Routes>
    </React.Suspense>
  );
}