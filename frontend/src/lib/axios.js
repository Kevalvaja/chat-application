import axios from "axios";
console.log(import.meta.env.NODE)

// const LocalURLArr = ["development", undefined, "undefined"]
// export const BASE_URL = LocalURLArr.includes(import.meta.env.NODE) ? "http://localhost:5001" : "/"
export const BASE_URL = import.meta.env.NODE === "development" ? "http://localhost:5001" : "/"

export const axiosInstance = axios.create({
    // baseURL: LocalURLArr.includes(import.meta.env.NODE) ? `${BASE_URL}/api` : `${BASE_URL}api`,
    baseURL: import.meta.env.NODE === "development" ? `${BASE_URL}/api` : `${BASE_URL}api`,
    withCredentials: true,
})