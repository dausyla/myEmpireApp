// src/utils/api/api.ts
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = async <T>(
  endpoint: string | ((...args: any[]) => string),
  options: RequestInit = {},
  ...args: any[]
): Promise<T> => {
  const url = typeof endpoint === "function" ? endpoint(...args) : endpoint;

  const token = localStorage.getItem("token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_URL}${url}`, { ...options, headers });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);

    return data as T;
  } catch (err: any) {
    toast.error(err.message);
    throw err;
  }
};
