import axios from "axios";
import { useAdminAuthStore } from "@/lib/store/authAdminStore";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "https://live.atdmoney.com/api/",
    timeout: 10000,
});

api.interceptors.request.use(
    (config) => {
        const token = useAdminAuthStore.getState().getToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        config.headers["X-App-Version"] = "1.0.0";
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                useAdminAuthStore.getState().logout();

                if (typeof window !== "undefined") {
                    window.location.href = "/crm";
                }
            } else if (error.response.status === 500) {
                console.error("Server error:", error.response.data.message);
            }
        } else {
            console.error("Network error:", error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
