import arrowUp from "../images/svg/green-arrow.svg";
import arrowDown from "../images/svg/arrow.svg";
import { ready } from "../functions/common_ts_tmp";

const wasmPromise = import("wasm");

export const updateInvestmentData_ = async (
  statusMsg,
  myAddress,
  daoId,
  setInvestmentData
) => {
  try {
    const wasm = await ready(wasmPromise);

    if (myAddress) {
      let data = await wasm.bridge_load_investment({
        dao_id: daoId,
        investor_address: myAddress,
      });
      console.log("Investment data: %o", data);
      setInvestmentData(data);
    }
  } catch (e) {
    statusMsg.error(e);
  }
};

export const retrieveProfits = async (
  myAddress,
  showProgress,
  statusMsg,
  updateMyBalance,
  daoId,
  updateInvestmentData,
  updateFunds,
  updateMyDividend,
  wallet
) => {
  try {
    const wasm = await ready(wasmPromise);
    statusMsg.clear();

    showProgress(true);
    let claimRes = await wasm.bridge_claim({
      dao_id: daoId,
      investor_address: myAddress,
    });
    console.log("claimRes: " + JSON.stringify(claimRes));
    showProgress(false);

    let claimResSigned = await wallet.signTxs(claimRes.to_sign);
    console.log("claimResSigned: " + JSON.stringify(claimResSigned));

    showProgress(true);
    let submitClaimRes = await wasm.bridge_submit_claim({
      investor_address_for_diagnostics: myAddress,
      dao_id_for_diagnostics: daoId,

      txs: claimResSigned,
      pt: claimRes.pt,
    });
    console.log("submitClaimRes: " + JSON.stringify(submitClaimRes));

    await updateInvestmentData(daoId, myAddress);
    await updateFunds(daoId);
    await updateMyDividend(daoId, myAddress);

    statusMsg.success("Dividend claimed");
    showProgress(false);

    await updateMyBalance(myAddress);
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};

export const shortedAddress = (address) => {
  console.log("shortening address: " + address);

  const short_chars = 3;
  const leading = address.substring(0, short_chars);
  const trailing = address.substring(address.length - short_chars);
  return leading + "..." + trailing;
};

export const updateFunds_ = async (
  daoId,
  setFunds,
  setFundsChange,
  statusMsg
) => {
  /// We don't have a function in WASM yet to fetch only the funds so we re-fetch the dao.
  /// TODO: optimize: fetch only the funds (probably pass dao as input), so request is quicker.
  try {
    const wasm = await ready(wasmPromise);
    let viewDao = await wasm.bridge_view_dao({
      dao_id: daoId,
    });
    // setViewDao(viewDao);
    // these are overwritten when draining, so we keep them separate
    // TODO drain here? is this comment up to date?
    setFunds(viewDao.available_funds);

    // all this (updateFunds_) can be optimized, the implementation of this fetches the dao again (when requesting withdrawals)
    let balance_change_res = await wasm.get_balance_change({
      dao_id: daoId,
    });
    setFundsChange(balance_change_res.change);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const changeArrow = (change) => {
  if (change === "up") {
    return (
      <div className="arrow-container">
        <img src={arrowUp.src} alt="arrow up" />
      </div>
    );
  } else if (change === "down") {
    return (
      <div className="arrow-container">
        <img src={arrowDown.src} alt="arrow down" />
      </div>
    );
  } else {
    return null;
  }
};
