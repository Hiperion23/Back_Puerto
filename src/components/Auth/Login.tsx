import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, ApiError } from "../../services/api";

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

export function Login() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const navigate =
    useNavigate();

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  setError("");
  setLoading(true);

  try {
    const resultado = await api.post<LoginResponse>(
      "/auth/login",
      {
        email,
        password,
      }
    );

    localStorage.setItem(
      "token",
      resultado.session.access_token
    );

    navigate("/admin/platos", {
      replace: true,
    });
  } catch (error) {
    console.error("Error iniciando sesión:", error);

    if (error instanceof ApiError) {
      if (
        error.status === 401 ||
        error.status === 403
      ) {
        setError("Correo o contraseña incorrectos");
      } else {
        setError(
          error.message || "Error al iniciar sesión"
        );
      }
    } else {
      setError("No se pudo conectar con el servidor");
    }
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="mb-6 text-center text-2xl font-semibold text-gray-900">
          Panel Admin — Primer Puerto
        </h1>

        <form
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="mb-3 w-full rounded border px-3 py-2 transition-colors focus:border-gray-900 focus:outline-none"
            autoComplete="email"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="mb-3 w-full rounded border px-3 py-2 transition-colors focus:border-gray-900 focus:outline-none"
            autoComplete="current-password"
            required
          />

          {error && (
            <p className="mb-3 text-sm text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-gray-900 py-2 text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Ingresando..."
              : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}