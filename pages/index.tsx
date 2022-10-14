import algosdk, { Algodv2, decodeAddress, SignedTransaction } from "algosdk";
import Head from "next/head";
import { useEffect } from "react";
import { Foo } from "../components/foo";
import { claim, submit } from "../core/flows/claim";
import MyAlgoConnect from "@randlabs/myalgo-connect";
import { signTransaction } from "../core/foo";
import {
  FundsAmount,
  toAppId,
  toFundsAmount,
  toFundsAsset,
  toInteger,
  toShareAmount,
  toTealSourceTemplate,
  toTimestamp,
  VersionedTealSourceTemplate,
} from "../core/common/types";
import { createAssetsTxs } from "../core/flows/create_assets";
import { MAX_RAISABLE_AMOUNT, PRECISION } from "../core/common/constants";
import { to } from "../core/infra/newtype";
import { toSharePercentage } from "../core/models/SharesPercentage";
import { toCapiAddress } from "../core/models/capi_deps";

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
    decodeAddress("7ZLNWP5YP5DCCCLHAYYETZQLFH4GTBEKTBFQDHA723I7BBZ2FKCOZCBE4I"),
    toAppId(123),
    toFundsAsset(123)
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
    decodeAddress("7ZLNWP5YP5DCCCLHAYYETZQLFH4GTBEKTBFQDHA723I7BBZ2FKCOZCBE4I"),
    toAppId(123),
    toFundsAsset(123)
  );

  const accounts = await myAlgoWallet.connect();
  const addresses = accounts.map((account) => account.address);
  console.log("addresses: %o", addresses);

  const signedTxn = await myAlgoWallet.signTransaction(tx.toByte());

  const response = submit(client, signedTxn.blob);

  console.log("response: %o", response);
};

type LastVersions = {
  app_approval: number;
  app_clear: number;
};

type AppTealTemplates = {
  approval: VersionedTealSourceTemplate;
  clear: VersionedTealSourceTemplate;
};

const fetchAppTeal = async (): Promise<AppTealTemplates> => {
  const apiUrl = "http://localhost:8000";

  const lastVersionsResponse = await fetch(`${apiUrl}/teal/versions`);
  const lastVersions: LastVersions = await lastVersionsResponse.json();

  console.log("last teal versions: %o", lastVersions);

  const approvalResponse = await fetch(
    `${apiUrl}/teal/approval/${lastVersions.app_approval}`
  );
  const approval = await approvalResponse.blob();
  //   console.log("approval: %o", approval);

  const clearResponse = await fetch(
    `${apiUrl}/teal/clear/${lastVersions.app_clear}`
  );
  const clear = await clearResponse.blob();
  //   console.log("clear: %o", clear);

  return {
    approval: {
      version: toInteger(lastVersions.app_approval),
      template: toTealSourceTemplate(
        new Uint8Array(await approval.arrayBuffer())
      ),
    },
    clear: {
      version: toInteger(lastVersions.app_clear),
      template: toTealSourceTemplate(new Uint8Array(await clear.arrayBuffer())),
    },
  };
};

const createAssets = async () => {
  const myAlgoWallet = new MyAlgoConnect();
  const token =
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  const server = "http://127.0.0.1";
  const port = 4001;
  const client = new algosdk.Algodv2(token, server, port);

  let teal = await fetchAppTeal();

  let txs = await createAssetsTxs(
    client,
    decodeAddress("7ZLNWP5YP5DCCCLHAYYETZQLFH4GTBEKTBFQDHA723I7BBZ2FKCOZCBE4I"),
    {
      name: "My project",
      shares: {
        tokenName: "Foo",
        supply: toShareAmount(100),
      },
      investorsShare: toSharePercentage(0.7),
      sharePrice: toFundsAmount(10),
      socialMediaUrl: "https://twitter.com/capi_fin",
      sharesForInvestors: toShareAmount(80),
      raiseEndDate: toTimestamp(1670958056),
      raiseMinTarget: toFundsAmount(200),
      minInvestAmount: toShareAmount(2),
      maxInvestAmount: toShareAmount(5),
    },
    teal.approval,
    teal.clear,
    toInteger(PRECISION),
    {
      escrow_percentage: toSharePercentage(0.05),
      address: toCapiAddress(
        decodeAddress(
          "7ZLNWP5YP5DCCCLHAYYETZQLFH4GTBEKTBFQDHA723I7BBZ2FKCOZCBE4I"
        )
      ),
    },
    to<FundsAmount>(MAX_RAISABLE_AMOUNT)
  );

  const signedCreateApp = await myAlgoWallet.signTransaction(
    txs.createApp.toByte()
  );
  const signedCreateShares = await myAlgoWallet.signTransaction(
    txs.createShares.toByte()
  );

  const appId = await sendAndRetrieveAppId(client, signedCreateApp.blob);
  const assetId = await sendAndRetrieveAssetId(client, signedCreateShares.blob);

  console.log("appId: %o", appId);
  console.log("assetId: %o", assetId);
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
        {/* <button onClick={() => signTx()}>{"Sign a tx"}</button> */}
        <button onClick={() => signTransaction()}>{"Sign a tx"}</button>
        <button onClick={() => createAssets()}>{"Create assets"}</button>
      </main>
    </div>
  );
}

const sendAndRetrieveAssetId = async (
  algod: Algodv2,
  signedTx: Uint8Array
): Promise<number> => {
  const pendingTx = await submitAndRetrievePendingTx(algod, signedTx);
  return pendingTx["asset-index"];
};

const sendAndRetrieveAppId = async (
  algod: Algodv2,
  signedTx: Uint8Array
): Promise<number> => {
  const pendingTx = await submitAndRetrievePendingTx(algod, signedTx);
  return pendingTx["application-index"];
};

const submitAndRetrievePendingTx = async (
  algod: Algodv2,
  signedTx: Uint8Array
): Promise<any> => {
  // any: untyped in the sdk
  const response = await submit(algod, signedTx);
  const pendingTx = await algod
    .pendingTransactionInformation(response.txId)
    .do();
  console.log("pendingTx: %o", pendingTx);
  return pendingTx;
};
