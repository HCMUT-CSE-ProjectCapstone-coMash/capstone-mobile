import axios from "axios";
import * as SecureStore from "expo-secure-store";

const baseURL = "https://capstone-backend-production-037b.up.railway.app";

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