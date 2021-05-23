import Head from "next/head";
import { Post, Sub } from "../types";
import PostCard from "../components/PostCard";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { useAuthState } from "../context/authContext";

const Home: React.FC<{ posts: Post[] }> = () => {
  const { data: topSubs } = useSWR<Sub[]>("/misc/top-subs");
  const { data: posts } = useSWR<Post[]>("/posts");

  const { authenticated } = useAuthState();
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
              topSubs.map((sub) => (
                <div
                  key={sub.name}
                  className="flex items-center px-4 py-2 text-xs border-b"
                >
                  <Link href={`/r/${sub.name}`}>
                    <a>
                      <Image
                        className="rounded-full cursor-pointer "
                        height={(6 * 16) / 4}
                        width={(6 * 16) / 4}
                        src={sub.imageUrl}
                        alt="Sub"
                      />
                    </a>
                  </Link>

                  <Link href={`/r/${sub.name}`}>
                    <a className="ml-2 font-bold hover:cursor-pointer">
                      /r/${sub.name}
                    </a>
                  </Link>

                  <p className="ml-auto font-medium">{sub.postCount}</p>
                </div>
              ))}
          </div>
          {authenticated && (
            <div className="p-4 bg-white border-t-2">
              <Link href="/subs/create">
                <a className="w-full px-2 py-1 blue button">Create Community</a>
              </Link>
            </div>
          )}
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
