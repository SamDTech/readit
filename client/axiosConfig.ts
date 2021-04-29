import axios from "axios";

const app = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});



export default app;
