import axios from "axios";
import * as SecureStore from "expo-secure-store";

const baseURL = process.env.NODE_ENV === "production"
    ? "https://capstone-backend-production-037b.up.railway.app"
    // : "http://localhost:5194";
    : "https://0697-2402-9d80-c6b-294f-693b-3dfe-4aab-293f.ngrok-free.app";

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