import axios from "axios";

export const baseURL = "http://3.27.163.201";

const instance = axios.create({
  baseURL: baseURL,
});

export default instance;