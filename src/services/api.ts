const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error(
    "La variable VITE_API_URL no está configurada"
  );
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: {
    field: string;
    message: string;
  }[];
}

export class ApiError extends Error {
  status: number;

  errors?: {
    field: string;
    message: string;
  }[];

  constructor(
    message: string,
    status: number,
    errors?: {
      field: string;
      message: string;
    }[]
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

function obtenerToken(): string | null {
  return localStorage.getItem("token");
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = obtenerToken();

  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", "Bearer " + token);
  }

  const base = API_URL.replace(/\/+$/, "");

  let path = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  if (
    base.endsWith("/api") &&
    path.startsWith("/api")
  ) {
    path = path.replace(/^\/api/, "");
  }

  const response = await fetch(`${base}${path}`, {
    ...options,
    headers,
  });

  let resultado: ApiResponse<T>;

  try {
    resultado =
      (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError(
      "El servidor devolvió una respuesta inválida",
      response.status
    );
  }

  if (!response.ok || !resultado.success) {
    throw new ApiError(
      resultado.message || "Error en la petición",
      response.status,
      resultado.errors
    );
  }

  return resultado.data as T;
}

export const api = {
  get<T>(endpoint: string): Promise<T> {
    return request<T>(endpoint, {
      method: "GET",
    });
  },

  post<T>(
    endpoint: string,
    body?: unknown
  ): Promise<T> {
    return request<T>(endpoint, {
      method: "POST",
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    });
  },

  put<T>(
    endpoint: string,
    body?: unknown
  ): Promise<T> {
    return request<T>(endpoint, {
      method: "PUT",
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    });
  },

  delete<T>(endpoint: string): Promise<T> {
    return request<T>(endpoint, {
      method: "DELETE",
    });
  },

  upload<T>(
    endpoint: string,
    formData: FormData
  ): Promise<T> {
    return request<T>(endpoint, {
      method: "POST",
      body: formData,
    });
  },
};
