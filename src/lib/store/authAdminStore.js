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
            isAuthenticated: false,
            loading: true,
            error: null,
            login: async (credentials) => {
                try {
                    set({ loading: true, error: null });

                    const res = await api.post("/crm/login", credentials);
                    set({
                        token: encodeToken(res.token),
                        user: res.admin,
                        isAuthenticated: true,
                        loading: false,
                    });
                } catch (err) {
                    set({
                        error:
                            err.response?.data?.message ||
                            "Login failed. Please try again.",
                        loading: false,
                    });
                }
            },
            logout: () => {
                set({
                    token: null,
                    user: null,
                    isAuthenticated: false,
                    loading: false,
                    error: null,
                });
            },
            setUser: (user) => {
                set({ user });
            },
            resetError: () => {
                set({ error: null });
            },
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
                    set({
                        user: res.admin,
                        isAuthenticated: true,
                        loading: false,
                    });
                } catch (err) {
                    set({
                        error: "Failed to refresh user data.",
                        loading: false,
                    });
                }
            },
        }),
        {
            name: "admin-auth",
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
            
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.loading = false;
                }
            },
        }
    )
);
