import { Notification } from "../components/Notification"

export const updateInvestmentData_ = async (
  wasm,
  notification,
  myAddress,
  daoId,
  setInvestmentData
) => {
  try {
    if (myAddress) {
      let data = await wasm.loadInvestment({
        dao_id: daoId,
        investor_address: myAddress,
      })
      console.log("Investment data: %o", data)
      setInvestmentData(data)
    }
  } catch (e) {
    notification.error(e)
  }
}

export const retrieveProfits = async (
  wasm,
  myAddress,
  showProgress,
  notification,
  updateMyBalance,
  daoId,
  updateInvestmentData,
  updateFunds,
  updateMyDividend,
  wallet
) => {
  try {
    showProgress(true)
    let claimRes = await wasm.claim({
      dao_id: daoId,
      investor_address: myAddress,
    })
    console.log("claimRes: " + JSON.stringify(claimRes))
    showProgress(false)

    let claimResSigned = await wallet.signTxs(claimRes.to_sign)
    console.log("claimResSigned: " + JSON.stringify(claimResSigned))

    showProgress(true)
    let submitClaimRes = await wasm.submitClaim({
      investor_address_for_diagnostics: myAddress,
      dao_id_for_diagnostics: daoId,

      txs: claimResSigned,
      pt: claimRes.pt,
    })
    console.log("submitClaimRes: " + JSON.stringify(submitClaimRes))

    await updateInvestmentData(daoId, myAddress)
    await updateFunds(daoId)
    await updateMyDividend(daoId, myAddress)

    notification.success("Dividend claimed")
    showProgress(false)

    await updateMyBalance(myAddress)
  } catch (e) {
    notification.error(e)
    showProgress(false)
  }
}

export const updateFunds_ = async (
  wasm,
  daoId,
  setFunds,
  setFundsChange,
  notification: Notification
) => {
  /// We don't have a function in WASM yet to fetch only the funds so we re-fetch the dao.
  /// TODO: optimize: fetch only the funds (probably pass dao as input), so request is quicker.
  try {
    let viewDao = await wasm.viewDao({
      dao_id: daoId,
    })
    // setViewDao(viewDao);
    // these are overwritten when draining, so we keep them separate
    // TODO drain here? is this comment up to date?
    setFunds(viewDao.available_funds)

    // all this (updateFunds_) can be optimized, the implementation of this fetches the dao again (when requesting withdrawals)
    let balance_change_res = await wasm.getBalanceChange({
      dao_id: daoId,
    })
    setFundsChange(balance_change_res.change)
  } catch (e) {
    notification.error(e)
  }
}
