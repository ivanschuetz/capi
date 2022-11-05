import MyAlgoConnect from "@randlabs/myalgo-connect";
import { Algodv2, makePaymentTxnWithSuggestedParams } from "algosdk";
import { makeAlgod } from "./deps";

/*Warning: Browser will block pop-up if user doesn't trigger myAlgoWallet.connect() with a button interation */
export async function signTransaction() {
  const myAlgoWallet = new MyAlgoConnect();

  const algod = makeAlgod();

  const suggestedParams = await algod.getTransactionParams().do();

  try {
    const txn = makePaymentTxnWithSuggestedParams(
      "7ZLNWP5YP5DCCCLHAYYETZQLFH4GTBEKTBFQDHA723I7BBZ2FKCOZCBE4I",
      "7ZLNWP5YP5DCCCLHAYYETZQLFH4GTBEKTBFQDHA723I7BBZ2FKCOZCBE4I",
      1000000,
      undefined,
      undefined,
      suggestedParams
    );

    const signedTxn = await myAlgoWallet.signTransaction(txn.toByte());

    const response = await algod.sendRawTransaction(signedTxn.blob).do();
    console.log(response);
  } catch (err) {
    console.error(err);
  }
}
