const API_BASE = "/api";

export const ENDPOINTS = {
  // AUTH
  AUTH: {
    LOGIN: `${API_BASE}/auth/login`,
    SIGNUP: `${API_BASE}/auth/signup`,
    GOOGLE: `${API_BASE}/auth/google`,
    LOGOUT: `${API_BASE}/auth/logout`,
    ME: `${API_BASE}/auth/me`,
  },

  // WALLETS
  WALLETS: {
    LIST: `${API_BASE}/wallets`,
    GET: (id: string) => `${API_BASE}/wallets/${id}`,
    CREATE: `${API_BASE}/wallets`,
    BATCH: (id: string) => `${API_BASE}/wallets/${id}/batch`,
    EXPORT: (id: string) => `${API_BASE}/wallets/${id}/export`,
  },

  // DATES
  DATES: {
    ADD: (walletId: string) => `${API_BASE}/wallets/${walletId}/dates`,
  },
} as const;
