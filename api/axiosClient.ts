import axios from "axios";

export const axiosClient = axios.create({
    // baseURL: "http://localhost:5194",
    baseURL: "https://encephalomyelitic-klara-trickiest.ngrok-free.dev",
    headers: {
        "Content-Type": "application/json",
    }
});