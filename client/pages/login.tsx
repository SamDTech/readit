import { FormEvent, useEffect, useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import InputGroup from "../components/InputGroup";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("/auth/login", {
        password,
        username,
      }, {withCredentials:true});

      setPassword("");
      setUsername("");

      router.push("/");
    } catch (error) {
      console.log(error)
       toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex">
      <Head>
        <title>Login</title>

      </Head>

      <div
        className="h-screen bg-center bg-cover w-36"
        style={{ backgroundImage: "url('/images/tiles.jpg')" }}
      ></div>

      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Sign Up</h1>
          <p className="mb-10 text-sm ">
            By continuing, you agree to our User Agreement and Privacy Policy.
          </p>

          <form action="" onSubmit={handleSubmit}>
            <InputGroup
              type="text"
              placeholder="Username"
              value={username}
              setValue={setUsername}
            />
            <InputGroup
              type="password"
              placeholder="Password"
              value={password}
              setValue={setPassword}
            />

            <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border-blue-500 rounded">
              Login
            </button>
          </form>
          <small>
            Don't have an account?
            <Link href="/register">
              <a className="ml-1 text-blue-500 uppercase"> Register</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
