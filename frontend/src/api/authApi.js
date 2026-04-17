import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
const TOKEN_KEY = "authToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";

const authAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const saveAuthPayload = (payload) => {
  if (payload?.token) {
    localStorage.setItem(TOKEN_KEY, payload.token);
  }

  if (payload?.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, payload.refreshToken);
  }

  const user = {
    id: payload?.id ?? null,
    username: payload?.username ?? "",
    email: payload?.email ?? "",
    fullName: payload?.fullName ?? "",
    profilePictureUrl: payload?.profilePictureUrl ?? "",
    roles: Array.isArray(payload?.roles)
      ? payload.roles
      : payload?.roles
      ? [...payload.roles]
      : [],
  };

  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
};

const clearAuthPayload = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const getErrorMessage = (error, fallbackMessage) => {
  return (
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    fallbackMessage
  );
};

authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

authAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/register") ||
      originalRequest?.url?.includes("/auth/oauth/google") ||
      originalRequest?.url?.includes("/auth/refresh-token");

    if (
      error?.response?.status === 401 &&
      refreshToken &&
      !originalRequest?._retry &&
      !isAuthEndpoint
    ) {
      try {
        originalRequest._retry = true;
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });

        if (response?.data?.token) {
          localStorage.setItem(TOKEN_KEY, response.data.token);
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          return authAPI(originalRequest);
        }
      } catch (refreshError) {
        clearAuthPayload();
        return Promise.reject(refreshError);
      }
    }

    if (error?.response?.status === 401) {
      clearAuthPayload();
    }

    return Promise.reject(error);
  }
);

export const authService = {
  register: async (username, email, password, fullName) => {
    try {
      const response = await authAPI.post("/auth/register", {
        username,
        email,
        password,
        fullName,
      });
      saveAuthPayload(response.data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Registration failed"));
    }
  },

  login: async (email, password) => {
    try {
      const response = await authAPI.post("/auth/login", { email, password });
      saveAuthPayload(response.data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Login failed"));
    }
  },

  googleLogin: async (credential) => {
    try {
      const response = await authAPI.post("/auth/oauth/google", { credential });
      saveAuthPayload(response.data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Google login failed"));
    }
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      throw new Error("Refresh token is missing");
    }

    try {
      const response = await authAPI.post("/auth/refresh-token", { refreshToken });
      if (response?.data?.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
      }
      return response.data;
    } catch (error) {
      clearAuthPayload();
      throw new Error(getErrorMessage(error, "Token refresh failed"));
    }
  },

  fetchCurrentUser: async () => {
    try {
      const response = await authAPI.get("/auth/me");
      saveAuthPayload({
        ...response.data,
        token: localStorage.getItem(TOKEN_KEY),
        refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
      });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Could not fetch user profile"));
    }
  },

  logout: () => {
    clearAuthPayload();
  },

  getCurrentUser: () => {
    const value = localStorage.getItem(USER_KEY);
    return value ? JSON.parse(value) : null;
  },

  isAuthenticated: () => Boolean(localStorage.getItem(TOKEN_KEY)),
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
};

export default authAPI;