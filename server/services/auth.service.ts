import { supabase } from "../config/supabase.js";

export interface LoginData {
  email: string;
  password: string;
}

export async function loginAdmin({
  email,
  password,
}: LoginData) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    throw error;
  }

  if (!data.session || !data.user) {
    throw new Error(
      "No se pudo crear la sesión"
    );
  }

  return {
    user: {
      id: data.user.id,
      email: data.user.email,
    },
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
      expires_in: data.session.expires_in,
    },
  };
}