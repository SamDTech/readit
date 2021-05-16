import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import Sidebar from "../../../../components/Sidebar";
import { Post, Comment } from "../../../../types";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAuthState } from "../../../../context/authContext";
import ActionButton from "../../../../components/ActionButton";

dayjs.extend(relativeTime);

const PostPage = () => {
  const router = useRouter();
  const { slug, identifier, sub } = router.query;

  // Global State
  const { authenticated } = useAuthState();
  const { data: post, error } = useSWR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null
  );

   const { data: comments } = useSWR<Comment[]>(
     identifier && slug ? `/posts/${identifier}/${slug}/comments` : null
   );

  if (error) router.push("/");

  const vote = async (value: number) => {
    // If not loggedIn, go to login
    if (!authenticated) router.push("/login");

    // If vote is the same, reset vote
    if (value === post.userVote) value = 0;
    try {
      const { data } = await axios.post("/misc/vote", {
        identifier,
        slug,
        value,
      });
      console.log(data);
    } catch (error) {}
  };

  return (
    <>
      <Head>
        <title>{post && post.title}</title>
      </Head>
      <Link href={`/r/${sub}`}>
        <a>
          <div className="flex items-center w-full h-20 p-8 bg-blue-500">
            <div className="container flex">
              {post && (
                <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                  <Image
                    src={post.sub.imageUrl}
                    height={(8 * 16) / 4}
                    width={(8 * 16) / 4}
                  />
                </div>
              )}

              <p className="text-xl font-semibold text-white">/r/${sub}</p>
            </div>
          </div>
        </a>
      </Link>
      <div className="container flex pt-5 ">
        {/* Post */}
        <div className="w-160">
          <div className="bg-white rounded">
            {post && (
              <div className="flex">
                {/* Vote Section */}
                <div className="w-10 py-3 text-center rounded-l">
                  {/* upvote */}
                  <div
                    onClick={() => vote(1)}
                    className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                  >
                    <i
                      className={`icon-arrow-up ${
                        post.userVote === 1 && "text-red-500"
                      }`}
                    ></i>
                  </div>
                  <p className="text-xs font-bold">{post.voteScore}</p>
                  {/* down vote */}

                  <div
                    onClick={() => vote(-1)}
                    className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
                  >
                    <i
                      className={`icon-arrow-down ${
                        post.userVote === -1 && "text-blue-600"
                      }`}
                    ></i>
                  </div>
                </div>
                <div className="p-2">
                  <div className="flex items-center">
                    <p className="text-xs text-gray-500">
                      {" "}
                      Posted by
                      <Link href={`/u/${post.username}`}>
                        <a className="mx-1 cursor-pointer hover:underline">
                          /u/{post.username}
                        </a>
                      </Link>
                      <Link href={`${post.url}`}>
                        <a className="mx-1 hover:underline">
                          {dayjs(post.createdAt).fromNow()}
                        </a>
                      </Link>
                    </p>
                  </div>

                  <h1 className="my-1 text-xl font-medium">{post.title}</h1>
                  {/* Post Body */}

                  <p className="my-3 text-sm">{post.body}</p>

                  <div className="flex">
                    <Link href={post.url}>
                      <a href="">
                        <ActionButton>
                          <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                          <span className="font-bold">
                            {post.commentCount} Comments
                          </span>
                        </ActionButton>
                      </a>
                    </Link>

                    <ActionButton>
                      <i className="mr-1 fas fa-share fa-xs"></i>
                      <span className="font-bold">Share</span>
                    </ActionButton>

                    <ActionButton>
                      <i className="mr-1 fas fa-bookmark fa-xs"></i>
                      <span className="font-bold">Save</span>
                    </ActionButton>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        {post && <Sidebar sub={post.sub} />}
      </div>
    </>
  );
};

export default PostPage;
