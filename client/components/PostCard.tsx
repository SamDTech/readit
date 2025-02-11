import React from "react";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Post } from "../types";
import axios from "axios";
import { classnames } from "tailwindcss-classnames";
import ActionButton from "./ActionButton";
import { useRouter } from "next/router";
import { useAuthState } from "../context/authContext";

dayjs.extend(relativeTime);

const PostCard: React.FC<{ post: Post; revalidate?: Function }> = ({
  post: {
    identifier,
    voteScore,
    title,
    commentCount,
    subName,
    body,
    username,
    createdAt,
    userVote,
    slug,
    url,
    sub,
  },
  revalidate,
}) => {
  const { authenticated } = useAuthState();
  const router = useRouter();

  const isInSubPage = router.pathname === "/r/[sub]";

  const vote = async (value: number) => {
    if (!authenticated) router.push("/login");

    if (value === userVote) value = 0;
    try {
      const { data } = await axios.post("/misc/vote", {
        identifier,
        slug,
        value,
      });
      if (revalidate) revalidate();
    } catch (error) {}
  };

  return (
    <div
      key={identifier}
      className="flex mb-4 bg-white rounded"
      id={identifier}
    >
      {/* Vote section */}
      <div className="w-10 py-3 text-center bg-gray-200 rounded-l">
        {/* upvote */}
        <div
          onClick={() => vote(1)}
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
        >
          <i
            className={`icon-arrow-up ${userVote === 1 && "text-red-500"}`}
          ></i>
        </div>
        <p className="text-xs font-bold">{voteScore}</p>
        {/* down vote */}

        <div
          onClick={() => vote(-1)}
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
        >
          <i
            className={`icon-arrow-down ${userVote === -1 && "text-blue-600"}`}
          ></i>
        </div>
      </div>
      {/* Post data section */}
      <div className="w-full p-2">
        <div className="flex items-center">
          {!isInSubPage && (
            <>
              <Link href={`/r/${subName}`}>
                <img
                  src={sub.imageUrl}
                  alt="default"
                  className="w-6 h-6 mr-1 rounded-full cursor-pointer"
                />
              </Link>
              <Link href={`/r/${subName}`}>
                <a className="text-xs font-bold cursor-pointer hover:underline">
                  /r/${subName}
                </a>
              </Link>{" "}
              <span className="mx-1 text-xs text-gray-500">•</span> Posted by
            </>
          )}
          <p className="text-xs text-gray-500">
            {" "}
            <Link href={`/u/${username}`}>
              <a className="mx-1 cursor-pointer hover:underline">
                /u/{username}
              </a>
            </Link>
            <Link href={`${url}`}>
              <a href="" className="mx-1 hover:underline">
                {dayjs(createdAt).fromNow()}
              </a>
            </Link>
          </p>
        </div>

        <Link href={url}>
          <a className="my-1 text-lg font-medium">{title}</a>
        </Link>
        {body && <p className="my-1 text-sm">{body}</p>}

        {/* Action Buttons */}
        <div className="flex">
          <Link href={url}>
            <a href="">
              <ActionButton>
                <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                <span className="font-bold">{commentCount} Comments</span>
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
  );
};

export default PostCard;
