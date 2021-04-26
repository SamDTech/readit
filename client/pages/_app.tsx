import { AppProps } from "next/app";
import "../styles/globals.css";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.baseURL = 'http://localhost:4000/api'
axios.defaults.withCredentials= true

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <ToastContainer />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
