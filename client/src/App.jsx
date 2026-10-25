import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Login from './Login';
import Signup from './Signup';
import Hotels from './pages/Hotels';
import Offers from './pages/Offers';
import Destinations from './pages/Destinations';
import HotelDetails from './pages/HotelDetails';
import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';

// Shared layout wrapper — renders Navbar + Footer around all public/protected pages
const MainLayout = () => (
  <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth pages — no Navbar/Footer */}
        <Route path="/login"    element={<Login />} />
        <Route path="/sign-in"  element={<Login />} />
        <Route path="/signup"   element={<Signup />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/sign-up"  element={<Signup />} />

        {/* Admin — uses its own ProtectedRoute wrapper */}
        <Route
          path="/admin"
          element={
            <ErrorBoundary>
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            </ErrorBoundary>
          }
        />

        {/* All pages that share the Navbar/Footer layout */}
        <Route element={<MainLayout />}>
          <Route path="/"             element={<Home />} />
          <Route path="/hotels"       element={<Hotels />} />
          <Route path="/offers"       element={<Offers />} />
          <Route path="/destinations" element={<Destinations />} />

          <Route
            path="/hotel/:id"
            element={
              <ErrorBoundary>
                <ProtectedRoute>
                  <HotelDetails />
                </ProtectedRoute>
              </ErrorBoundary>
            }
          />

          <Route
            path="/booking"
            element={
              <ErrorBoundary>
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              </ErrorBoundary>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ErrorBoundary>
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              </ErrorBoundary>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
