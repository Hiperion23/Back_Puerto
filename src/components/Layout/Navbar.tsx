import { NavLink, useNavigate } from "react-router-dom";
import { Sun, Moon, LogOut } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";

const links = [
  {
    to: "/admin/platos",
    label: "Platos",
  },
  {
    to: "/admin/configuracion",
    label: "Configuración",
  },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="relative flex items-center justify-between gap-2 px-3 py-3 sm:px-6 sm:py-4">
      <div className="flex min-w-0 items-center gap-4 sm:gap-8">
        <h2 className="hidden text-xl font-semibold text-stone-900 dark:text-stone-50 sm:block">
          Cocina
        </h2>

        <div className="flex">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-sm transition-colors duration-200 sm:gap-2 sm:px-4 ${
                  isActive
                    ? "font-semibold text-stone-900 dark:text-stone-50"
                    : "text-stone-400 hover:text-stone-700 dark:text-stone-500 dark:hover:text-stone-300"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? "scale-100 bg-rose-700 dark:bg-rose-500"
                        : "scale-0 bg-transparent"
                    }`}
                  />

                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Cambiar tema"
          className="relative flex h-7 w-14 shrink-0 items-center rounded-full bg-stone-100 px-1 transition-colors duration-300 dark:bg-stone-800"
        >
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full bg-white text-stone-700 shadow-sm transition-transform duration-300 dark:bg-stone-950 dark:text-stone-200 ${
              theme === "dark" ? "translate-x-7" : "translate-x-0"
            }`}
          >
            {theme === "dark" ? <Moon size={12} /> : <Sun size={12} />}
          </span>
        </button>

        <span className="hidden h-5 w-px bg-stone-200 dark:bg-stone-800 sm:block" />

        <button
          type="button"
          onClick={handleLogout}
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-stone-500 transition-colors duration-200 hover:border-rose-700/30 hover:text-rose-700 dark:border-stone-800 dark:text-stone-400 dark:hover:border-rose-500/30 dark:hover:text-rose-500 sm:h-auto sm:w-auto sm:gap-1.5 sm:px-3.5 sm:py-1.5 sm:text-xs sm:font-medium"
        >
          <LogOut size={14} className="sm:hidden" />
          <span className="hidden whitespace-nowrap sm:inline">
            Cerrar sesión
          </span>
        </button>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          backgroundImage:
            theme === "dark"
              ? "repeating-linear-gradient(to right, #292524 0, #292524 4px, transparent 4px, transparent 9px)"
              : "repeating-linear-gradient(to right, #d6d3d1 0, #d6d3d1 4px, transparent 4px, transparent 9px)",
        }}
      />
    </nav>
  );
}