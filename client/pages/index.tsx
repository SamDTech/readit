import Head from "next/head";
import { Post } from "../types";

import { DocumentContext } from "next/document";
import PostCard from "../components/PostCard";
import app from "../axiosConfig";
import useSWR from 'swr'
import { SWRConfig } from 'swr';

const Home: React.FC<{ posts: Post[] }> = ({ posts }) => {
  return (
    <>
      <Head>
        <title>Readit: The front page of the internet</title>
      </Head>
      <div className="container flex pt-4">
        {/* Post feeds */}
        <div className="w-160">
          {posts &&
            posts.map((post) => <PostCard post={post} key={post.identifier} />)}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async (context: DocumentContext) => {
  try {
    const { data } = await app.get(`/posts`, {
      headers: context?.req?.headers?.cookie
        ? { cookie: context.req.headers.cookie }
        : undefined,
    });

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
