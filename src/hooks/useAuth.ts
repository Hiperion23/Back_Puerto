import { useMemo, useSyncExternalStore } from "react";

export interface AuthUser {
  id?: string;
  email?: string;
}

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback); // sincroniza entre pestañas

  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): string | null {
  return localStorage.getItem("token");
}

function notificar() {
  listeners.forEach((listener) => listener());
}

function login(token: string) {
  localStorage.setItem("token", token);
  notificar();
}

function logout() {
  localStorage.removeItem("token");
  notificar();
}

function obtenerUsuarioDesdeToken(token: string | null): AuthUser | null {
  if (!token) return null;

  try {
    const partes = token.split(".");
    if (partes.length !== 3) return null;

    const payloadBase64 = partes[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(payloadBase64));

    return { id: payload.id, email: payload.email };
  } catch (error) {
    console.error("Error leyendo token:", error);
    return null;
  }
}

export function useAuth() {
  const token = useSyncExternalStore(subscribe, getSnapshot);
  const user = useMemo(() => obtenerUsuarioDesdeToken(token), [token]);

  return {
    token,
    user,
    loading: false,
    isAuthenticated: Boolean(token),
    login,
    logout,
  };
}