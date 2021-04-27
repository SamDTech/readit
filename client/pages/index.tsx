import Head from "next/head";
import axios from "axios";
import Link from "next/link";
import { Post } from "../types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { DocumentContext } from "next/document";
import { GetServerSideProps } from "next";

dayjs.extend(relativeTime);

const Home: React.FC<{ posts: Post[] }> = ({ posts }) => {
  return (
    <div className="pt-12 ">
      <Head>
        <title>Readit: The front page of the internet</title>
      </Head>
      <div className="container flex pt-4">
        {/* Post feeds */}
        <div className="w-160">
          {posts &&
            posts.map((post) => (
              <div key={post.identifier} className="flex mb-4 bg-white rounded">
                {/* Vote section */}
                <div className="w-10 text-center bg-gray-200 rounded-l">
                  <p>V</p>
                </div>
                {/* Post data section */}
                <div className="w-full p-2">
                  <div className="flex items-center">
                    <Link href={`/r/${post.subName}`}>
                      <>
                        <img
                          src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                          alt="default"
                          className="w-6 h-6 mr-1 rounded-full cursor-pointer"
                        />
                        <a className="text-xs font-bold cursor-pointer hover:underline">
                          /r/${post.subName}
                        </a>
                      </>
                    </Link>
                    <p className="text-xs text-gray-500">
                      {" "}
                      <span className="mx-1">•</span> Posted by
                      <Link href={`/u/${post.username}`}>
                        <a className="mx-1 cursor-pointer hover:underline">
                          /u/{post.username}
                        </a>
                      </Link>
                      <Link href={`${post.url}`}>
                        <a href="" className="mx-1 hover:underline">
                          {dayjs(post.createdAt).fromNow()}
                        </a>
                      </Link>
                    </p>
                  </div>

                  <Link href={post.url}>
                    <a className="my-1 text-lg font-medium">{post.title}</a>
                  </Link>
                  {post.body && <p className="my-1 text-sm">{post.body}</p>}
                  <div className="flex">
                    <Link href={post.url}>
                      <a href="">
                        <div className="px-1 py-1 mr-2 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                          <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                          <span className="font-bold">20 Comments</span>
                        </div>
                      </a>
                    </Link>

                    <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                      <i className="mr-1 fas fa-share fa-xs"></i>
                      <span className="font-bold">Share</span>
                    </div>

                    <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                      <i className="mr-1 fas fa-bookmark fa-xs"></i>
                      <span className="font-bold">Save</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: DocumentContext
) => {
  try {
    const { data } = await axios.get(`/posts`);

    if (!data) {
      return {
        notFound: true,
      };
    }

    return {
      props: { posts: data }, // will be passed to the page component as props
    };
  } catch (error) {
    return {
      props: { error: "Something went wrong" },
    };
  }
};

export default Home;
