import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// REASON: Importing all page and component files needed for routing.
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import DashboardHome from './pages/DashboardHome';
import ChartsPage from './pages/ChartsPage';
import ThreeDChartPage from './pages/ThreeDChartPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    // REASON: The Router component enables client-side routing.
    <Router>
      {/* REASON: This component allows you to show pop-up notifications anywhere in the app. */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* REASON: The Routes component is where you define all the possible routes for your application. */}
      <Routes>
        {/* --- Public Routes --- */}
        {/* REASON: These routes are accessible to anyone, even if they are not logged in. */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- Private User Dashboard Routes --- */}
        {/* REASON: The 'PrivateRoute' component wraps all the dashboard pages. If a user is not logged in,
            it will redirect them to the login page instead of showing the dashboard. */}
        <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>}>
          {/* REASON: 'index' makes DashboardHome the default page when the URL is exactly '/dashboard'. */}
          <Route index element={<DashboardHome />} />
          {/* REASON: Defines the route for the 2D charts page, which is a child of the dashboard layout. */}
          <Route path="charts" element={<ChartsPage />} />
          {/* REASON: Defines the route for the new 3D charts feature. */}
          <Route path="3d-chart" element={<ThreeDChartPage />} />
          {/* REASON: Defines the route for the new file history feature. */}
          <Route path="history" element={<HistoryPage />} />
          {/* REASON: Defines the route for the user profile page. */}
          <Route path="profile" element={<ProfilePage />} />
          {/* REASON: Defines the route for the new, fully implemented Admin Dashboard. */}
          <Route path="admin" element={<AdminDashboard />} />
        </Route>

        {/* --- Fallback Route --- */}
        {/* REASON: The '*' path is a wildcard that catches any URL that doesn't match the routes above, showing a 'Not Found' page. */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;