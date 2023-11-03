import axios from "axios";
const local = "http://localhost:5000";
//https://book-store-server-chi.vercel.app/
// http://localhost:5000/

const production = "https://book-backend-ehmv.onrender.com";
const api = axios.create({
  baseURL: `${local}/api`,
  // withCredentials: true,
});
export default api;
