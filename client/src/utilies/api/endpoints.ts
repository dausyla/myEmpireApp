const API_BASE = "/api";

export const ENDPOINTS = {
  // AUTH
  AUTH: {
    LOGIN: `${API_BASE}/auth/login`,
    SIGNUP: `${API_BASE}/auth/signup`,
    GOOGLE: `${API_BASE}/auth/google`,
    LOGOUT: `${API_BASE}/auth/logout`,
    // /wallet/me because it's using backend middleware from wallet routes
    ME: `${API_BASE}/wallets/me`,
  },

  // WALLETS
  WALLETS: {
    LIST: `${API_BASE}/wallets/getWallets`,
    GET: (id: string) => `${API_BASE}/wallets/${id}`,
    CREATE: `${API_BASE}/wallets/createWallet`,
    BATCH: (id: string) => `${API_BASE}/wallets/${id}/batch`,
    EXPORT: (id: string) => `${API_BASE}/wallets/${id}/export`,
  },

  // DATES
  DATES: {
    ADD: (walletId: string) => `${API_BASE}/wallets/${walletId}/dates`,
  },
} as const;
