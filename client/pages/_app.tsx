import { AppProps } from "next/app";
import "../styles/tailwind.css";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { SWRConfig } from "swr";
import "react-toastify/dist/ReactToastify.css";
import Nav from "../components/Nav";
import { useRouter } from "next/router";
import "../styles/icons.css";
import { AuthProvider } from "../context/authContext";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api";
axios.defaults.withCredentials = true;



const fetcher = async (url: string) => {
  try {
    const { data } = await axios.get(url)

    return data
  } catch (error) {
    throw error.response.data
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  const authRoutes = ["/register", "/login"];
  const authRoute = authRoutes.includes(pathname);

  return (
    <SWRConfig
      value={{
        fetcher
      }}
    >
      <AuthProvider>
        <ToastContainer />
        {!authRoute && <Nav />}
        <div className={authRoute ? '' : 'pt-12'}>
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </SWRConfig>
  );
}

export default MyApp;
