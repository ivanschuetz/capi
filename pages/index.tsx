import algosdk from "algosdk";
import Head from "next/head";
import { useEffect } from "react";
import { Foo } from "../components/foo";
import { claim, submit } from "../core/claim";
import MyAlgoConnect from "@randlabs/myalgo-connect";
import { signTransaction } from "../core/foo";

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
    "7ZLNWP5YP5DCCCLHAYYETZQLFH4GTBEKTBFQDHA723I7BBZ2FKCOZCBE4I",
    123,
    123
  );

  console.log("tx: %o", tx);
};

const signTx = async () => {
  const myAlgoWallet = new MyAlgoConnect();
  const token =
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  const server = "http://127.0.0.1";
  const port = 4001;
  const client = new algosdk.Algodv2(token, server, port);
  let tx = await claim(
    client,
    "7ZLNWP5YP5DCCCLHAYYETZQLFH4GTBEKTBFQDHA723I7BBZ2FKCOZCBE4I",
    123,
    123
  );

  const accounts = await myAlgoWallet.connect();
  const addresses = accounts.map((account) => account.address);
  console.log("addresses: %o", addresses);

  const signedTxn = await myAlgoWallet.signTransaction(tx.toByte());

  const response = submit(client, signedTxn.blob);

  console.log("response: %o", response);
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
        <button onClick={() => signTx()}>{"Sign a tx"}</button>
      </main>
    </div>
  );
}
