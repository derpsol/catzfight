import axios from "axios";

export const baseURL = "http://35.91.17.10";

const instance = axios.create({
  baseURL: baseURL,
});

export default instance;