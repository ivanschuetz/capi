import { decodeAddress } from "algosdk";
import Head from "next/head";
import { useEffect } from "react";
import { Foo } from "../components/foo";
import MyApp from "../components/MyApp";
import { claim } from "../core/flows/claim";
import MyAlgoConnect from "@randlabs/myalgo-connect";
import { signTransaction } from "../core/foo";
import { toAppId, toFundsAsset } from "../core/common/types";
import { makeAlgod } from "../core/deps";
import { submit } from "../core/common/tx_utils";
import { createAssetsFlow } from "../core/flows/create_assets/createAssetsFlow";
import { WASMExample } from "../components/WASMExample";

const testAlgo = async () => {
  const algod = makeAlgod();

  //   console.log("testing algo!!");

  //   (async () => {
  //     // console.log(await client.status().do());
  //     console.log(await client.getTransactionParams().do());
  //   })().catch((e) => {
  //     console.log(e);
  //   });

  let tx = await claim(
    algod,
    decodeAddress("7ZLNWP5YP5DCCCLHAYYETZQLFH4GTBEKTBFQDHA723I7BBZ2FKCOZCBE4I"),
    toAppId(123),
    toFundsAsset(123)
  );

  console.log("tx: %o", tx);
};

const signTx = async () => {
  const myAlgoWallet = new MyAlgoConnect();
  const algod = makeAlgod();

  let tx = await claim(
    algod,
    decodeAddress("7ZLNWP5YP5DCCCLHAYYETZQLFH4GTBEKTBFQDHA723I7BBZ2FKCOZCBE4I"),
    toAppId(123),
    toFundsAsset(123)
  );

  const accounts = await myAlgoWallet.connect();
  const addresses = accounts.map((account) => account.address);
  console.log("addresses: %o", addresses);

  const signedTxn = await myAlgoWallet.signTransaction(tx.toByte());

  const response = submit(algod, signedTxn.blob);

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
        <WASMExample />
        <Foo />
        {/* <button onClick={() => signTx()}>{"Sign a tx"}</button> */}
        <button onClick={() => signTransaction()}>{"Sign a tx"}</button>
        <button onClick={() => createAssetsFlow()}>{"Create assets"}</button>

        <MyApp />
      </main>
    </div>
  );
}
