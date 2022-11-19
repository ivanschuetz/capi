import { StatusMsgUpdaterType } from "../components/StatusMsgUpdater"
import { safe } from "../functions/utils"

export const initLog = async (wasm, statusMsg: StatusMsgUpdaterType) => {
  try {
    wasm.init_log()
  } catch (e) {
    statusMsg.error(e)
  }
}

export const updateMyShares = async (
  wasm,
  statusMsg: StatusMsgUpdaterType,
  daoId,
  myAddress,
  setMyShares
) => {
  safe(statusMsg, async () => {
    let mySharesRes = await wasm.bridge_my_shares({
      dao_id: daoId,
      my_address: myAddress,
    })
    console.log("mySharesRes: %o", mySharesRes)
    setMyShares(mySharesRes)
  })
}

export const updateMyBalance_ = async (
  wasm,
  statusMsg: StatusMsgUpdaterType,
  myAddress,
  updateMyBalance
) => {
  safe(statusMsg, async () => {
    const balance = await wasm.bridge_balance({ address: myAddress })
    console.log("Balance update res: %o", balance)
    await updateMyBalance(balance)
  })
}

export const updateMyDividend_ = async (
  wasm,
  statusMsg: StatusMsgUpdaterType,
  daoId,
  myAddress,
  setMyDividend
) => {
  safe(statusMsg, async () => {
    let myDividendRes = await wasm.bridge_my_dividend({
      dao_id: daoId,
      investor_address: myAddress,
    })
    console.log("myDividendRes: %o", myDividendRes)
    setMyDividend(myDividendRes)
  })
}

export const updateDao_ = async (
  wasm,
  daoId,
  setDao,
  statusMsg: StatusMsgUpdaterType
) => {
  safe(statusMsg, async () => {
    let dao = await wasm.bridge_load_dao(daoId)
    setDao(dao)
    // // these are overwritten when draining, so we keep them separate
    // // TODO drain here? is this comment up to date?
    // setFunds(viewDao.available_funds);
  })
}

export const fetchAvailableShares = async (
  wasm,
  statusMsg: StatusMsgUpdaterType,
  daoId,
  setAvailableShares,
  setAvailableSharesNumber
) => {
  safe(statusMsg, async () => {
    let res = await wasm.bridge_load_available_shares({
      dao_id: daoId,
    })
    setAvailableShares(res.available_shares)
    setAvailableSharesNumber(res.available_shares_number)
  })
}

export const loadRaisedFunds = async (
  wasm,
  statusMsg: StatusMsgUpdaterType,
  daoId,
  setRaisedFunds,
  setRaisedFundsNumber,
  setState
) => {
  safe(statusMsg, async () => {
    let funds = await wasm.bridge_raised_funds({ dao_id: daoId })
    setRaisedFunds(funds.raised)
    setRaisedFundsNumber(funds.raised_number)
    setState(stateObj(funds.state, funds.goal_exceeded_percentage))
  })
}

const stateObj = (state, exceeded) => {
  var text
  var success

  if (state === "Raising") {
    return null // no message displayed when funds are still raising
  } else if (state === "GoalReached") {
    text = "The minimum target was reached"
    success = true
    // "6BB9BD";
  } else if (state === "GoalNotReached") {
    text = "The minimum target was not reached"
    success = false
    // success = "DE5C62";
  } else if (state === "GoalExceeded") {
    text = "The minumum target was exceeded by " + exceeded
    success = true
    // success = "6BB9BD";
  } else {
    throw Error("Invalid funds raise state: " + state)
  }

  return { text: text, success: success }
}

export const getWasmVersion = async (
  wasm,
  statusMsg: StatusMsgUpdaterType,
  setWasmVersion
) => {
  safe(statusMsg, async () => {
    setWasmVersion(await wasm.bridge_wasm_version())
  })
}
