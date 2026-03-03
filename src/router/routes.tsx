import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import { Loading } from "../components";
import { MainLayout } from "../layouts";

// Lazy load pages for code splitting
const Login = lazy(() => import("../pages/Login"));
const SignUp = lazy(() => import("../pages/SignUp"));
const MarketOverview = lazy(() => import("../pages/MarketOverview"));
const CompanyInsights = lazy(() => import("../pages/CompanyInsights"));
const Watchlist = lazy(() => import("../pages/Watchlist"));
const Portfolio = lazy(() => import("../pages/Portfolio"));
const Screener = lazy(() => import("../pages/Screener"));
const Settings = lazy(() => import("../pages/Settings"));
const NotFound = lazy(() => import("../pages/NotFound"));

// Suspense wrapper for lazy loaded pages
const LazyPage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<Loading fullScreen message="Loading..." />}>
    {children}
  </Suspense>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LazyPage><Login /></LazyPage>} />
      <Route path="/signup" element={<LazyPage><SignUp /></LazyPage>} />

      {/* Protected Routes with MainLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to="/market" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/market"
        element={
          <ProtectedRoute>
            <MainLayout>
              <LazyPage><MarketOverview /></LazyPage>
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/:symbol"
        element={
          <ProtectedRoute>
            <MainLayout>
              <LazyPage><CompanyInsights /></LazyPage>
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/watchlist"
        element={
          <ProtectedRoute>
            <MainLayout>
              <LazyPage><Watchlist /></LazyPage>
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/portfolio"
        element={
          <ProtectedRoute>
            <MainLayout>
              <LazyPage><Portfolio /></LazyPage>
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/screener"
        element={
          <ProtectedRoute>
            <MainLayout>
              <LazyPage><Screener /></LazyPage>
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <MainLayout>
              <LazyPage><Settings /></LazyPage>
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<LazyPage><NotFound /></LazyPage>} />
    </Routes>
  );
};

export default AppRoutes;

