import Head from "next/head";
import { useState, useEffect } from "react";
import { Post, Sub } from "../types";
import PostCard from "../components/PostCard";
import useSWR, { useSWRInfinite } from "swr";
import Image from "next/image";
import Link from "next/link";
import { useAuthState } from "../context/authContext";

const Home: React.FC<{ posts: Post[] }> = () => {
  const [observePost, setObservePost] = useState("");

  const { data: topSubs } = useSWR<Sub[]>("/misc/top-subs");
  //const { data: posts } = useSWR<Post[]>("/posts");

  const { authenticated } = useAuthState();



  const { data, error, isValidating,  size: page, setSize: setPage, revalidate  } = useSWRInfinite(
  index => `/posts?page=${index}`
)
const isLoadingInitialData = !data && !error;

  const posts: Post[] = data ? [].concat(...data) : [];

  const description = "Reddit is a network of communities based on people's interests. Find communities you're interested in, and become part of an online community!"
    const title = "Readit: The front page of the internet";

  useEffect(() => {
    if (!posts || posts.length === 0) return;

    const id = posts[posts.length - 1].identifier;

    if (id !== observePost) {
      setObservePost(id);
      observeElement(document.getElementById(id))
    }
  }, [posts]);

  const observeElement = (element: HTMLElement) => {
    if (!element) return

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting === true) {
        console.log('Reached buttom of post')
        setPage(page + 1)
        observer.unobserve(element)
      }
    }, {threshold: 1})

    observer.observe(element)
  }

  return (
    <>
      <Head>
        <title>{ title}</title>
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:title" content={title} />
      </Head>
      <div className="container flex pt-4">
        {/* Post feeds */}
        <div className="w-full px-4 md:w-160 md:p-0">
          {isLoadingInitialData && (
            <p className="text-lg text-center">Loading..</p>
          )}
          {posts &&
            posts.map((post) => (
              <PostCard
                post={post}
                key={post.identifier}
                revalidate={revalidate}
              />
            ))}

          {isLoadingInitialData && posts.length > 0 && (
            <p className="text-lg text-center">Loading More..</p>
          )}
        </div>

        {/* Sidebars */}
        <div className="hidden ml-6 w-60 md:block">
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
