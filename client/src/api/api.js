import axios from "axios";
// const local = "https://book-backend-ehmv.onrender.com";
const local = "http://localhost:5000";
const production = "https://bookbe.vercel.app"

const host = "";
// http://localhost:3000/
//https://book-store-server-chi.vercel.app/
const api = axios.create({
  baseURL: `${production}/api`,
  withCredentials: true,
});
export default api;
