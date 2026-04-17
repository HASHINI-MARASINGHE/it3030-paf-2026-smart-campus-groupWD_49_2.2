import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../api/authApi";

const AuthContext = createContext(null);

const normalizeRoles = (roles) => {
  if (Array.isArray(roles)) return roles;
  if (roles && typeof roles === "object") return Object.values(roles);
  return [];
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const storedUser = authService.getCurrentUser();

        if (!authService.isAuthenticated()) {
          setUser(storedUser);
          setIsAuthenticated(false);
          return;
        }

        const profile = await authService.fetchCurrentUser();
        setUser({ ...profile, roles: normalizeRoles(profile.roles) });
        setIsAuthenticated(true);
      } catch (error) {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    const normalized = { ...response, roles: normalizeRoles(response.roles) };
    setUser(normalized);
    setIsAuthenticated(true);
    return normalized;
  };

  const register = async (username, email, password, fullName) => {
    const response = await authService.register(username, email, password, fullName);
    const normalized = { ...response, roles: normalizeRoles(response.roles) };
    setUser(normalized);
    setIsAuthenticated(true);
    return normalized;
  };

  const googleLogin = async (credential) => {
    const response = await authService.googleLogin(credential);
    const normalized = { ...response, roles: normalizeRoles(response.roles) };
    setUser(normalized);
    setIsAuthenticated(true);
    return normalized;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasRole = (role) => normalizeRoles(user?.roles).includes(role);
  const hasAnyRole = (roles) => roles.some((role) => hasRole(role));

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      login,
      register,
      googleLogin,
      logout,
      hasRole,
      hasAnyRole,
    }),
    [user, loading, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};