import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Toaster } from "react-hot-toast";

// Page Imports
import AuthPage from "../web/authpage/page";
import DashboardPage from "../web/user/dashboard/page";
import ChartPage from "@/web/user/chart/page";
import UploadPage from "@/web/user/upload/page";
import FilesPage from "@/web/user/files/page";
import ChartsHistoryPage from "@/web/user/charthistory/page";
import AIInsightsPage from "@/web/user/aiinsights/page";
import UserHelpPage from "@/web/user/help/page";
import UserSettings from "@/web/user/settings/page";

// Admin Imports
import AdminDashboardPage from "@/web/admin/dashboard/page";
import AdminUsersPage from "@/web/admin/users/page";
import AdminHelpPage from "@/web/admin/help/page";
import AdminSettings from "@/web/admin/settings/page";

// Route Guards
import { AdminRouteGuard } from "@/components/admin-route-guard";

// Helper to check for authentication
const isAuthenticated = () => {
    return localStorage.getItem("token") ? true : false;
};

// Protected Route Component for standard users
const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/" replace />;
    }
    return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<AuthPage />} />

        {/* User Routes - All are protected */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/chart/:id" element={<ProtectedRoute><ChartPage /></ProtectedRoute>} />
        <Route path="/dashboard/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
        <Route path="/dashboard/files" element={<ProtectedRoute><FilesPage /></ProtectedRoute>} />
        <Route path="/dashboard/charts" element={<ProtectedRoute><ChartsHistoryPage /></ProtectedRoute>} />
        <Route path="/dashboard/insights" element={<ProtectedRoute><AIInsightsPage /></ProtectedRoute>} />
        <Route path="/dashboard/settings" element={<ProtectedRoute><UserSettings/></ProtectedRoute>}/>
        <Route path="/help" element={<ProtectedRoute><UserHelpPage /></ProtectedRoute>} />

        {/* Admin & Superadmin Routes - Protected by the AdminRouteGuard */}
        <Route path="/admin" element={<AdminRouteGuard><AdminDashboardPage /></AdminRouteGuard>} />
        <Route path="/admin/users" element={<AdminRouteGuard><AdminUsersPage /></AdminRouteGuard>} />
        <Route path="/admin/settings" element={<AdminRouteGuard><AdminSettings/></AdminRouteGuard>}/>
        <Route path="/admin/help" element={<AdminRouteGuard><AdminHelpPage /></AdminRouteGuard>} />
        
        {/* Fallback Route to redirect any unknown paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

// The following code should be in your main.jsx, but including it here to be thorough.
// If your main.jsx already has this, you don't need to change it.
const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
         <Toaster position="top-right" reverseOrder={false} />
        <App />
      </StrictMode>,
    );
}

export default App;