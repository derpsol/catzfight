import axios from "axios";

export const baseURL = "http://localhost:8001";

const instance = axios.create({
  baseURL: baseURL,
});

export default instance;