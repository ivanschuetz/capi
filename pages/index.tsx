import Head from "next/head";
import MyApp from "../components/MyApp";

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <MyApp />
      </main>
    </div>
  );
}
