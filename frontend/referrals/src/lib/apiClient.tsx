
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:4000/api", // Backend base URL
  timeout: 5000,
});

export default apiClient;
