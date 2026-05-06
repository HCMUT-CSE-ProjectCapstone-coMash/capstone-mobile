import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const axiosClient = axios.create({
    // baseURL: "http://localhost:5194",
    baseURL: "https://0909-2001-ee0-4f85-f8e0-3861-974a-68f1-a4fd.ngrok-free.app",
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