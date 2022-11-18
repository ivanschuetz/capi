// Note: no locking for the embedded view because there's no design yet

import { toErrorMsg } from "../functions/validation";

export const lock = async (
  wasm,
  statusMsg,
  myAddress,
  wallet,
  updateInvestmentData,
  updateMyBalance,
  updateMyShares,

  showProgress,
  daoId,
  dao,
  lockSharesCount,
  onLockOpt,
  setInputError
) => {
  try {
    statusMsg.clear();
    ///////////////////////////////////
    // TODO refactor invest/lock
    // 1. sign tx for app opt-in
    showProgress(true);
    let optInToAppsRes = await wasm.bridge_opt_in_to_apps_if_needed({
      app_id: "" + dao.app_id,
      investor_address: myAddress,
    });
    console.log("optInToAppsRes: " + JSON.stringify(optInToAppsRes));
    var optInToAppsSignedOptional = null;
    if (optInToAppsRes.to_sign != null) {
      showProgress(false);
      optInToAppsSignedOptional = await wallet.signTxs(optInToAppsRes.to_sign);
    }
    console.log(
      "optInToAppsSignedOptional: " + JSON.stringify(optInToAppsSignedOptional)
    );
    ///////////////////////////////////

    showProgress(true);
    // 2. buy the shares (requires app opt-in for local state)
    // TODO write which local state

    let lockRes = await wasm.bridge_lock({
      dao_id: daoId,
      investor_address: myAddress,
      share_count: lockSharesCount,
    });
    console.log("lockRes: " + JSON.stringify(lockRes));
    showProgress(false);

    let lockResSigned = await wallet.signTxs(lockRes.to_sign);
    console.log("lockResSigned: " + JSON.stringify(lockResSigned));

    showProgress(true);

    let submitLockRes = await bridge_submit_lock({
      app_opt_ins: optInToAppsSignedOptional,
      txs: lockResSigned,
    });
    console.log("submitLockRes: " + JSON.stringify(submitLockRes));
    showProgress(false);

    statusMsg.success(
      "Congratulations! you locked " + lockSharesCount + " shares."
    );

    await updateInvestmentData(daoId, myAddress);
    await updateMyBalance(myAddress);
    await updateMyShares(daoId, myAddress);

    if (onLockOpt) {
      onLockOpt();
    }
  } catch (e) {
    if (e.id === "validation") {
      console.error("%o", e);
      setInputError(toErrorMsg(e.details));
    } else {
      statusMsg.error(e);
    }
    showProgress(false);
  }
};
