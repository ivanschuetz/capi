import {
  Algodv2,
  encodeAddress,
  makeApplicationCallTxnFromObject,
  OnApplicationComplete,
} from "algosdk";

export const claim = async (
  algod: Algodv2,
  claimer: string,
  appId: number,
  fundsAsset: number
) => {
  const params = await algod.getTransactionParams().do();

  const tx = makeApplicationCallTxnFromObject({
    suggestedParams: params,
    from: claimer,
    appIndex: appId,
    foreignAssets: [fundsAsset],
    onComplete: OnApplicationComplete.NoOpOC,
  });

  let encoded = encodeAddress(tx.from.publicKey);
  console.log("!!! encoded: " + encoded);

  tx.fee = tx.fee * 2;

  return tx;
};

export const submit = (algod: Algodv2, tx: Uint8Array | Uint8Array[]) => {
  algod.sendRawTransaction(tx).do();

  return;
};
