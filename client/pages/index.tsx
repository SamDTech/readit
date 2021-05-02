import Head from "next/head";
import { Post, Sub } from "../types";
import { DocumentContext } from "next/document";
import PostCard from "../components/PostCard";
import app from "../axiosConfig";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";

const Home: React.FC<{ posts: Post[] }> = () => {
  const { data: topSubs } = useSWR("/misc/top-subs");
    const { data: posts } = useSWR("/posts");
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

        {/* Sidebars */}
        <div className="ml-6 w-60">
          <div className="bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-lg font-semibold text-center">
                Top Communities
              </p>
            </div>
            {topSubs &&
              topSubs.map((sub: Sub) => (
                <div
                  key={sub.name}
                  className="flex items-center px-4 py-2 text-xs border-b"
                >
                  <div className="mr-2 overflow-hidden rounded-full cursor-pointer">
                    <Link href={`/r/${sub.name}`}>
                      <Image
                        height={(6 * 16) / 4}
                        width={(6 * 16) / 4}
                        src={sub.imageUrl}
                        alt="Sub"
                      />
                    </Link>
                  </div>
                  <Link href={`/r/${sub.name}`}>
                    <a className="font-bold hover:cursor-pointer">
                      /r/${sub.name}
                    </a>
                  </Link>

                  <p className="ml-auto font-medium">{sub.postCount}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

// export const getServerSideProps = async (context: DocumentContext) => {
//   try {
//     const { data } = await app.get(`/posts`, {
//       headers: context?.req?.headers?.cookie
//         ? { cookie: context.req.headers.cookie }
//         : undefined,
//     });

//     if (!data) {
//       return {
//         notFound: true,
//       };
//     }

//     return {
//       props: { posts: data }, // will be passed to the page component as props
//     };
//   } catch (error) {
//     return {
//       props: { error: "Something went wrong" },
//     };
//   }
// };

export default Home;
