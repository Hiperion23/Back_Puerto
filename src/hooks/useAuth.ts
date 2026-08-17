import { useCallback, useEffect, useState } from "react";

export interface AuthUser {
  id?: string;
  email?: string;
}

function obtenerToken(): string | null {
  return localStorage.getItem("token");
}

function obtenerUsuarioDesdeToken(
  token: string | null
): AuthUser | null {
  if (!token) {
    return null;
  }

  try {
    const partes = token.split(".");

    if (partes.length !== 3) {
      return null;
    }

    const payloadBase64 = partes[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const payload = JSON.parse(
      atob(payloadBase64)
    );

    return {
      id: payload.id,
      email: payload.email,
    };
  } catch (error) {
    console.error(
      "Error leyendo token:",
      error
    );

    return null;
  }
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(
    () => obtenerToken()
  );

  const [user, setUser] = useState<AuthUser | null>(
    () =>
      obtenerUsuarioDesdeToken(
        obtenerToken()
      )
  );

  const [loading] = useState(false);

  const comprobarSesion = useCallback(() => {
    const tokenActual = obtenerToken();

    if (!tokenActual) {
      setToken(null);
      setUser(null);
      return;
    }

    const usuario =
      obtenerUsuarioDesdeToken(
        tokenActual
      );

    if (!usuario) {
      localStorage.removeItem("token");

      setToken(null);
      setUser(null);
      return;
    }

    setToken(tokenActual);
    setUser(usuario);
  }, []);

  useEffect(() => {
    window.addEventListener(
      "storage",
      comprobarSesion
    );

    return () => {
      window.removeEventListener(
        "storage",
        comprobarSesion
      );
    };
  }, [comprobarSesion]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");

    setToken(null);
    setUser(null);
  }, []);

  return {
    token,
    user,
    loading,
    isAuthenticated: Boolean(token),
    logout,
  };
}