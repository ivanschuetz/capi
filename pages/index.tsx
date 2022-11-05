import Head from "next/head";
import MyApp from "../components/MyApp";
import { WASMExample } from "../components/WASMExample";

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <WASMExample />
        <MyApp />
      </main>
    </div>
  );
}
