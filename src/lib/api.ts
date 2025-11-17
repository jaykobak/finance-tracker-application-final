// API Base URL - change this if your backend runs on a different port
const API_BASE_URL = "http://localhost:5000/api";

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("finance_tracker_token");
};

// Helper function to make authenticated requests
const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// Authentication API
export const authAPI = {
  signup: async (name: string, email: string, password: string) => {
    const data = await authFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    // Store token
    if (data.token) {
      localStorage.setItem("finance_tracker_token", data.token);
    }

    return data;
  },

  login: async (email: string, password: string) => {
    const data = await authFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // Store token
    if (data.token) {
      localStorage.setItem("finance_tracker_token", data.token);
    }

    return data;
  },

  getProfile: async () => {
    return await authFetch("/auth/me");
  },

  logout: () => {
    localStorage.removeItem("finance_tracker_token");
  },
};

// Transactions API
export const transactionsAPI = {
  getAll: async () => authFetch("/transactions"),
  getById: async (id: string) => authFetch(`/transactions/${id}`),
  create: async (transaction: {
    type: "income" | "expense";
    amount: number;
    description: string;
    category: string;
    date: string;
    accountId?: string;
  }) =>
    authFetch("/transactions", {
      method: "POST",
      body: JSON.stringify(transaction),
    }),
  update: async (
    id: string,
    transaction: Partial<{
      type: "income" | "expense";
      amount: number;
      description: string;
      category: string;
      date: string;
      accountId?: string;
    }>
  ) =>
    authFetch(`/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(transaction),
    }),
  delete: async (id: string) =>
    authFetch(`/transactions/${id}`, { method: "DELETE" }),
  getSummary: async () => authFetch("/transactions/summary"),
};

// Accounts API
export const accountsAPI = {
  getAll: async () => authFetch("/accounts"),
  create: async (account: {
    name: string;
    type: "cash" | "bank" | "credit" | "investment" | "savings" | "other";
    accountNumber?: string;
    icon?: string;
    initialBalance?: number;
  }) =>
    authFetch("/accounts", {
      method: "POST",
      body: JSON.stringify(account),
    }),
  update: async (
    id: string | number,
    update: Partial<{
      name: string;
      type: "cash" | "bank" | "credit" | "investment" | "savings" | "other";
      accountNumber?: string;
      icon?: string;
      initialBalance?: number;
    }>
  ) =>
    authFetch(`/accounts/${id}`, {
      method: "PUT",
      body: JSON.stringify(update),
    }),
  delete: async (id: string | number) =>
    authFetch(`/accounts/${id}`, { method: "DELETE" }),
};

// Health check
export const checkServerHealth = async () => {
  try {
    const response = await fetch("http://localhost:5000/health");
    return response.ok;
  } catch {
    return false;
  }
};
