import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function createInstance() {
  const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });
  return instance;
}
export const baseInstance = createInstance();
