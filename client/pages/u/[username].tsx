import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

const user = () => {
  const router = useRouter();

  const { username } = router.query;
  const { data, error } = useSWR<any>(username ? `/users/${username}` : null);

  if (error) router.push("/");

  if (data) console.log(data);

  return <div></div>;
};

export default user;
