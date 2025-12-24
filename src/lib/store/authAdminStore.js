"use client";
import api from "@/utils/axiosInstance";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const encodeToken = (token) => (token ? btoa(token) : null);
const decodeToken = (encoded) => (encoded ? atob(encoded) : null);

export const useAdminAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      permissions: null,
      isAuthenticated: false,
      loading: true,
      error: null,
      
      login: async (credentials) => {
        try {
          set({ loading: true, error: null });
          const res = await api.post("/crm/login", credentials);
          
          const { permissions, ...userWithoutPermissions } = res.admin;
          
          set({
            token: encodeToken(res.token),
            user: userWithoutPermissions,
            permissions: permissions,
            isAuthenticated: true,
            loading: false,
          });
        } catch (err) {
          set({
            error: err.response?.data?.message || "Login failed",
            loading: false,
          });
        }
      },
      
      logout: () => {
        set({
          token: null,
          user: null,
          permissions: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      },
      
      setUser: (user) => set({ user }),
      
      setPermissions: (permissions) => set({ permissions }),
      
  hasPermission: (permissionKey) => {
  const { permissions } = get();
  if (!permissions) return false;
  
  const permissionValue = permissions[permissionKey];
  
  return permissionValue === true || 
         permissionValue === 1 || 
         permissionValue === '1' || 
         permissionValue === 'true';
},
      
      resetError: () => set({ error: null }),
      
      getToken: () => {
        const encoded = get().token;
        return decodeToken(encoded);
      },

      refreshUser: async () => {
  try {
    const token = get().getToken();
    if (!token) return;
    
    set({ loading: true, error: null });
    const res = await api.get("/crm/me");
    
    const { permissions, ...userWithoutPermissions } = res.admin;
    
    set({
      user: userWithoutPermissions,
      permissions: permissions,
      isAuthenticated: true,
      loading: false,
    });
  } catch (err) {
    set({
      error: "Failed to refresh user data",
      loading: false,
      isAuthenticated: false,
    });
  }
},
    }),
    {
      name: "admin-auth",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated,
      }),
      
      onRehydrateStorage: () => (state) => {
        if (state) state.loading = false;
      },
    }
  )
);