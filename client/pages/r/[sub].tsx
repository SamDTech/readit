import React from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import PostCard from "../../components/PostCard";
import Head from "next/head";
import Image from "next/image";
import { Sub } from "../../types";

const sub = () => {
  const router = useRouter();
  const subName = router.query.sub;

  const { data: sub, error } = useSWR<Sub>(subName ? `/subs/${subName}` : null);

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

  return (
    <div>
      <Head>
        <title>{sub?.title}</title>
      </Head>
      {sub && (
        <>
          {/* sub info and images */}
          <div>
            {/* Banner Image */}
            <div className="bg-blue-500">
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
              <div className="container flex ">
                <Image
                  src={sub?.imageUrl}
                  alt="Sub"
                  className="rounded-full"
                  width={80}
                  height={80}
                />
              </div>
            </div>
          </div>

          {/* Post and Sidebar */}
          <div className="container flex pt-5">
            <div className="w-160">{postMarkup}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default sub;
