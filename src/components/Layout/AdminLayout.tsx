import {
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Navbar } from "./Navbar";

export function AdminLayout() {
  const {
    loading,
    isAuthenticated,
  } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300">
          Cargando...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 dark:text-gray-100">
      <Navbar />

      <div
        key={window.location.pathname}
        className="animate-fade-in"
      >
        <Outlet />
      </div>
    </div>
  );
}