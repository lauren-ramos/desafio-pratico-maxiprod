// URL base da API .NET. Pode ser sobrescrita via variável de ambiente VITE_API_URL
// (ver frontend/.env.example), útil se o backend rodar em outra porta/host.
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5149";

/** Erro lançado quando a API responde com um status de erro, carregando a mensagem do backend. */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.mensagem ?? body?.title ?? `Erro ${response.status} ao chamar ${path}`;
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  delete: (path: string) => request<void>(path, { method: "DELETE" }),
};
