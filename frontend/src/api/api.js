import axios from "axios";
import { config } from "../config";

const api = axios.create({
  baseURL: config.backendUrl,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}` || "",
  },
});

export { api };
