import { FormEvent, useEffect, useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import InputGroup from "../components/InputGroup";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [agreement, setAgreement] = useState(false);
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!agreement) {
      toast.error("You must agree to T&Cs");
      return;
    }

    try {
      await axios.post("/auth/register", {
        email,
        password,
        username,
      });
      setEmail("");
      setPassword("");
      setUsername("");

      router.push("/login");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex">
      <Head>
        <title>Register</title>
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
            <div className="mb-6">
              <input
                type="checkbox"
                className="mr-1 cursor-pointer"
                id="agreement"
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
              />
              <label htmlFor="agreement" className="text-xs cursor-pointer">
                I agree to get emails and cool stuffs from Readit
              </label>
            </div>

            <InputGroup
              type="email"
              placeholder="Email"
              value={email}
              setValue={setEmail}
            />
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
              Sign Up
            </button>
          </form>
          <small>
            Already a readitor?
            <Link href="/login">
              <a className="ml-1 text-blue-500 uppercase"> Login</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
