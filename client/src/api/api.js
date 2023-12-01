import axios from "axios";
// const local = "https://book-backend-ehmv.onrender.com";
const local = "https://bookbe.vercel.app";

const host = "";
// http://localhost:3000/
//https://book-store-server-chi.vercel.app/
const production = "";
const api = axios.create({
  baseURL: `${local}/api`,
  withCredentials: true,
});

export default api;
