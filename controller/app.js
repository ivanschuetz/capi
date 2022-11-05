const wasmPromise = import("wasm");

export const initLog = async (statusMsg) => {
  try {
    const { init_log } = await wasmPromise;
    init_log();
  } catch (e) {
    statusMsg.error(e);
  }
};

export const updateMyShares = async (
  statusMsg,
  daoId,
  myAddress,
  setMyShares
) => {
  try {
    const { bridge_my_shares } = await wasmPromise;
    let mySharesRes = await bridge_my_shares({
      dao_id: daoId,
      my_address: myAddress,
    });
    console.log("mySharesRes: %o", mySharesRes);
    setMyShares(mySharesRes);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const updateMyBalance_ = async (
  statusMsg,
  myAddress,
  updateMyBalance
) => {
  try {
    const { bridge_balance } = await wasmPromise;
    const balance = await bridge_balance({ address: myAddress });
    console.log("Balance update res: %o", balance);
    await updateMyBalance(balance);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const updateMyDividend_ = async (
  statusMsg,
  daoId,
  myAddress,
  setMyDividend
) => {
  try {
    const { bridge_my_dividend } = await wasmPromise;
    let myDividendRes = await bridge_my_dividend({
      dao_id: daoId,
      investor_address: myAddress,
    });
    console.log("myDividendRes: %o", myDividendRes);
    setMyDividend(myDividendRes);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const updateDao_ = async (daoId, setDao, statusMsg) => {
  try {
    const { bridge_load_dao } = await wasmPromise;
    let dao = await bridge_load_dao(daoId);
    setDao(dao);
    // // these are overwritten when draining, so we keep them separate
    // // TODO drain here? is this comment up to date?
    // setFunds(viewDao.available_funds);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const fetchAvailableShares = async (
  statusMsg,
  daoId,
  setAvailableShares,
  setAvailableSharesNumber
) => {
  try {
    const { bridge_load_available_shares } = await wasmPromise;
    let res = await bridge_load_available_shares({
      dao_id: daoId,
    });
    setAvailableShares(res.available_shares);
    setAvailableSharesNumber(res.available_shares_number);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const loadRaisedFunds = async (
  statusMsg,
  daoId,
  setRaisedFunds,
  setRaisedFundsNumber,
  setState
) => {
  try {
    const { bridge_raised_funds } = await wasmPromise;
    let funds = await bridge_raised_funds({ dao_id: daoId });
    setRaisedFunds(funds.raised);
    setRaisedFundsNumber(funds.raised_number);
    setState(stateObj(funds.state, funds.goal_exceeded_percentage));
  } catch (e) {
    statusMsg.error(e);
  }
};

const stateObj = (state, exceeded) => {
  var text;
  var success;

  if (state === "Raising") {
    return null; // no message displayed when funds are still raising
  } else if (state === "GoalReached") {
    text = "The minimum target was reached";
    success = true;
    // "6BB9BD";
  } else if (state === "GoalNotReached") {
    text = "The minimum target was not reached";
    success = false;
    // success = "DE5C62";
  } else if (state === "GoalExceeded") {
    text = "The minumum target was exceeded by " + exceeded;
    success = true;
    // success = "6BB9BD";
  } else {
    throw Error("Invalid funds raise state: " + state);
  }

  return { text: text, success: success };
};

export const getWasmVersion = async (statusMsg, setWasmVersion) => {
  try {
    const { bridge_wasm_version } = await wasmPromise;
    setWasmVersion(await bridge_wasm_version());
  } catch (e) {
    statusMsg.error(e);
  }
};
