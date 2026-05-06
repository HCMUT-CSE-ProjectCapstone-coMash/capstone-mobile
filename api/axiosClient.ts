import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const axiosClient = axios.create({
    // baseURL: "http://localhost:5194",
    baseURL: "https://2234-2402-9d80-388-833-f80c-43b8-2d86-69ac.ngrok-free.app",
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