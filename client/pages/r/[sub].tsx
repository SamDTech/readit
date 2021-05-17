import React, { useState, useEffect, createRef, ChangeEvent } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import PostCard from "../../components/PostCard";
import Head from "next/head";
import Image from "next/image";
import { Sub } from "../../types";
import { useAuthState } from "../../context/authContext";
import classNames from "classnames";
import axios from "axios";
import Sidebar from "../../components/Sidebar";

const SubName = () => {
  const [ownSub, setOwnSub] = useState(false);
  const router = useRouter();
  const subName = router.query.sub;

  const fileInputRef = createRef<HTMLInputElement>();

  const {
    data: sub,
    error,
    revalidate,
  } = useSWR<Sub>(subName ? `/subs/${subName}` : null);

  const { authenticated, user } = useAuthState();

  if (error) router.push("/");

  let postMarkup: any;

  if (!sub) {
    postMarkup = <p className="text-lg text-center">Loading ...</p>;
  } else if (sub.posts.length === 0) {
    postMarkup = <p className="text-lg text-center">No Post Submitted Yet</p>;
  } else {
    postMarkup = sub.posts.map((post) => (
      <PostCard key={post.identifier} post={post} />
    ));
  }

  useEffect(() => {
    if (!sub) {
      return;
    }

    setOwnSub(authenticated && user.username === sub.username);
  }, [sub]);

  const openFileInput = (type: string) => {
    if (!ownSub) {
      return;
    }

    fileInputRef.current.name = type;

    fileInputRef.current.click();
  };

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];

    const formData = new FormData();

    formData.append("file", file);
    formData.append("type", fileInputRef.current.name);

    try {
      await axios.post<Sub>(`/subs/${sub.name}/image`, formData, {
        headers: { "Content-Type": "multipart/formData" },
      });

      revalidate();
    } catch (error) {}
  };

  return (
    <div>
      <Head>
        <title>{sub?.title}</title>
      </Head>
      {sub && (
        <>
          <input
            type="file"
            name=""
            hidden
            id=""
            ref={fileInputRef}
            onChange={uploadImage}
          />
          {/* sub info and images */}
          <div>
            {/* Banner Image */}
            <div
              className={classNames("bg-blue-500", {
                "cursor-pointer": ownSub,
              })}
              onClick={() => openFileInput("banner")}
            >
              {sub.bannerUrl ? (
                <div
                  className="h-56 bg-blue-500"
                  style={{
                    backgroundImage: `url(${sub.bannerUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center ",
                  }}
                ></div>
              ) : (
                <div className="h-20 bg-blue-500"></div>
              )}
            </div>
            {/* Sub Meta data */}
            <div className="h-20 bg-w">
              <div className="container relative flex">
                <div className="absolute" style={{ top: -15 }}>
                  <Image
                    src={sub?.imageUrl}
                    alt="Sub"
                    className={`rounded-full ${ownSub && "cursor-pointer"}`}
                    width={70}
                    height={70}
                    onClick={() => openFileInput("image")}
                  />
                </div>
                <div className="pt-1 pl-24">
                  <div className="flex items-center">
                    <h1 className="mb-1 text-3xl font-bold">{sub.title}</h1>
                  </div>
                  <p className="text-sm font-bold text-gray-500">
                    /r/${sub.name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Post and Sidebar */}
          <div className="container flex pt-5">
            <div className="w-160">{postMarkup}</div>
            <Sidebar sub={sub} />
          </div>
        </>
      )}
    </div>
  );
};

export default SubName;
