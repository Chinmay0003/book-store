// lib/auth.ts
export const getToken = () => localStorage.getItem("token");

export const clearToken = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = (): boolean => !!getToken();
