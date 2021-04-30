import { AppProps } from "next/app";
import "../styles/tailwind.css";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nav from "../components/Nav";
import { useRouter } from "next/router";
import "../styles/icons.css";
import { AuthProvider } from "../context/authContext";

axios.defaults.baseURL = "http://localhost:4000/api";
axios.defaults.withCredentials = true;

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  const authRoutes = ["/register", "/login"];
  const authRoute = authRoutes.includes(pathname);

  return (
    <AuthProvider>
      <ToastContainer />
      {!authRoute && <Nav />}
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
