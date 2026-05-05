import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const axiosClient = axios.create({
    // baseURL: "http://localhost:5194",
    baseURL: "https://9817-113-161-67-60.ngrok-free.app",
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