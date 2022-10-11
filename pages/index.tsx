import algosdk from "algosdk";
import Head from "next/head";
import { useEffect } from "react";
import { Foo } from "../components/foo";
import { claim } from "../core/claim";

const testAlgo = async () => {
  const token =
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  const server = "http://127.0.0.1";
  const port = 4001;
  const client = new algosdk.Algodv2(token, server, port);

  //   console.log("testing algo!!");

  //   (async () => {
  //     // console.log(await client.status().do());
  //     console.log(await client.getTransactionParams().do());
  //   })().catch((e) => {
  //     console.log(e);
  //   });

  let tx = await claim(
    client,
    "DNQPINWK4K5QZYLCK7DVJFEWRUXPXGW36TEUIHNSNOFYI2RMPG2BZPQ7DE",
    123,
    123
  );

  console.log("tx: %o", tx);
};

export default function Home() {
  useEffect(() => {
    testAlgo();
  }, []);

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div>{"Hello Algorand!"}</div>
        <Foo />
      </main>
    </div>
  );
}
