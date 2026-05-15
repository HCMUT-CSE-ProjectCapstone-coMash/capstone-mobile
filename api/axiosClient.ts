import axios from "axios";
import * as SecureStore from "expo-secure-store";

const baseURL = process.env.NODE_ENV === "production"
    ? "https://capstone-backend-production-037b.up.railway.app"
    : "http://localhost:5194";
    // : "https://884c-113-22-177-180.ngrok-free.app";

export const axiosClient = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    }
});

axiosClient.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});