import axios from "axios";

export const BASE_URL = import.meta.env.NODE === "development" ? "http://localhost:5001" : "/api"

export const axiosInstance = axios.create({
    baseURL: import.meta.env.NODE === "development" ? `${BASE_URL}/api` : BASE_URL,
    withCredentials: true,
})