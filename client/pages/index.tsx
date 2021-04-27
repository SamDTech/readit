import Head from "next/head";

export default function Home() {
  return (
    <div className='pt-12 '>
      <Head>
        <title>Readit: The front page of the internet</title>
      </Head>
      <div className="container ">
        <h1>Recent posts</h1>
      </div>
    </div>
  );
}
