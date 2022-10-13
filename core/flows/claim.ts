import {
  Address,
  Algodv2,
  makeApplicationCallTxnFromObject,
  OnApplicationComplete,
} from "algosdk";
import { encodeAddress } from "../common/address";
import { AppId, FundsAsset } from "../common/types";
import { from } from "../infra/newtype";

export const claim = async (
  algod: Algodv2,
  claimer: Address,
  appId: AppId,
  fundsAsset: FundsAsset
) => {
  const params = await algod.getTransactionParams().do();

  const tx = makeApplicationCallTxnFromObject({
    suggestedParams: params,
    from: encodeAddress(claimer),
    appIndex: from(appId),
    foreignAssets: [from(fundsAsset)],
    onComplete: OnApplicationComplete.NoOpOC,
  });

  tx.fee = tx.fee * 2;

  return tx;
};

export const submit = (algod: Algodv2, tx: Uint8Array | Uint8Array[]) => {
  algod.sendRawTransaction(tx).do();

  return;
};
