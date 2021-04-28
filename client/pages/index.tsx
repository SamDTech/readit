import Head from "next/head";
import axios from "axios";
import Link from "next/link";
import { Post } from "../types";


import { DocumentContext } from "next/document";
import PostCard from "../components/PostCard";




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
              <PostCard post={post} key={post.identifier} />
            ))}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async (
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
