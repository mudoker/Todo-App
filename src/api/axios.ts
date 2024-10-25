// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api", // base URL for backend on port 8080
});

export default axiosInstance;
