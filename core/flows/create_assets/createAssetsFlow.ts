import MyAlgoConnect from "@randlabs/myalgo-connect";
import { decodeAddress } from "algosdk";
import { fetchAppTeal } from "../../api/api";
import { MAX_RAISABLE_AMOUNT, PRECISION } from "../../common/constants";
import {
  sendAndRetrieveAppId,
  sendAndRetrieveAssetId,
} from "../../common/tx_utils";
import {
  FundsAmount,
  toFundsAmount,
  toInteger,
  toShareAmount,
  toTimestamp,
} from "../../common/types";
import { makeAlgod } from "../../deps";
import { to } from "../../infra/newtype";
import { toCapiAddress } from "../../models/capi_deps";
import { toSharePercentage } from "../../models/SharesPercentage";
import { createAssetsTxs } from "./createAssetsTxs";

export const createAssetsFlow = async () => {
  const myAlgoWallet = new MyAlgoConnect();
  const algod = makeAlgod();

  let teal = await fetchAppTeal();

  let txs = await createAssetsTxs(
    algod,
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

  const appId = await sendAndRetrieveAppId(algod, signedCreateApp.blob);
  const assetId = await sendAndRetrieveAssetId(algod, signedCreateShares.blob);

  console.log("appId: %o", appId);
  console.log("assetId: %o", assetId);
};
