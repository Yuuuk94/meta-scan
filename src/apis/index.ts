import axios from "axios";

export const instance = axios.create({
  baseURL: process.env.META_SCAN_API,
});
