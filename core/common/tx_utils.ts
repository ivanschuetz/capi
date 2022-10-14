import { Algodv2 } from "algosdk";

export const sendAndRetrieveAssetId = async (
  algod: Algodv2,
  signedTx: Uint8Array
): Promise<number> => {
  const pendingTx = await submitAndRetrievePendingTx(algod, signedTx);
  return pendingTx["asset-index"];
};

export const sendAndRetrieveAppId = async (
  algod: Algodv2,
  signedTx: Uint8Array
): Promise<number> => {
  const pendingTx = await submitAndRetrievePendingTx(algod, signedTx);
  return pendingTx["application-index"];
};

export const submitAndRetrievePendingTx = async (
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

export const submit = (algod: Algodv2, tx: Uint8Array | Uint8Array[]) => {
  return algod.sendRawTransaction(tx).do();
};
