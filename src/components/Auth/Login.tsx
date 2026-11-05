import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { api, ApiError } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

interface LoginResponse {
  user?: {
    id?: string;
    email?: string;
  };
  session: {
    access_token: string;
    refresh_token: string;
    expires_at?: number;
    expires_in?: number;
  };
}

const inputClass =
  "w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-stone-900 placeholder:text-stone-400 transition-colors focus:border-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-700/20 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-50 dark:placeholder:text-stone-600 dark:focus:border-rose-500 dark:focus:ring-rose-500/20";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const resultado = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      login(resultado.session.access_token);

      navigate("/admin/platos", {
        replace: true,
      });
    } catch (error) {
      console.error("Error iniciando sesión:", error);

      if (error instanceof ApiError) {
        if (error.status === 401 || error.status === 403) {
          setError("Correo o contraseña incorrectos");
        } else {
          setError(error.message || "Error al iniciar sesión");
        }
      } else {
        setError("No se pudo conectar con el servidor");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-stone-50 px-6 py-10 dark:bg-stone-950">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose-700 dark:bg-rose-500" />
          <span className="text-sm font-medium text-stone-500 dark:text-stone-400">
            Cocina
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
          Mi Primer Puerto
        </h1>

        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
          Inicia sesión para administrar la carta.
        </p>

        <div className="my-8 border-t border-dashed border-stone-300 dark:border-stone-800" />

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300"
            >
              Correo
            </label>
            <input
              id="email"
              type="email"
              placeholder="nombre@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-12`}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-stone-400 transition-colors hover:text-stone-700 dark:text-stone-500 dark:hover:text-stone-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-rose-700/20 bg-rose-700/5 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 py-3 text-base font-medium text-white transition-colors hover:bg-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-700 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-stone-50 dark:text-stone-900 dark:hover:bg-stone-200 dark:focus-visible:ring-rose-500 dark:focus-visible:ring-offset-stone-950"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </main>
  );
}