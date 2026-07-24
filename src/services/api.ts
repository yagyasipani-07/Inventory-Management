const API_BASE = "/api";

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: <T>(url: string) => fetcher<T>(url),
  post: <T>(url: string, data: unknown) =>
    fetcher<T>(url, { method: "POST", body: JSON.stringify(data) }),
  patch: <T>(url: string, data: unknown) =>
    fetcher<T>(url, { method: "PATCH", body: JSON.stringify(data) }),
  delete: <T>(url: string) => fetcher<T>(url, { method: "DELETE" }),
};
