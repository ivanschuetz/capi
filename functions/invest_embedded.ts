import { DaoJs, FrError } from "wasm/wasm"
import { Notification } from "../components/Notification"
import { SetBool, SetString, Wasm } from "../type_alias"
import { Wallet } from "../wallet/Wallet"
import {
  isNotEnoughFundsAssetError,
  isValidationError,
  toDefaultErrorMsg,
} from "./errors"
import { toValidationErrorMsg } from "./validation"

export const calculateSharesPrice = async (
  wasm,
  availableSharesNumber,
  shareCount,
  dao,
  lockedShares
) => {
  try {
    let res = await wasm.calculateSharesPrice({
      shares_amount: shareCount,
      available_shares: availableSharesNumber,

      share_supply: dao.share_supply_number,
      investors_share: dao.investors_share,
      share_price: dao.share_price_number_algo,
      locked_shares: lockedShares,
    })

    console.log("res: %o", res)

    return res
  } catch (e) {
    // for now disabled - we don't want to show validation messages while typing, to be consistent with other inputs
    // deps.notification.error(e);
    console.error("calculateSharesPrice error (ignored): %o", e)
  }
}

export const invest = async (
  wasm: Wasm,

  notification: Notification,
  myAddress: string,
  wallet: Wallet,
  updateMyBalance: (myAddress: string) => void,
  updateMyShares: (daoId: string, myAddress: string) => void,
  updateFunds: (daoId: string) => void,
  updateInvestmentData: (daoId: string, myAddress: string) => void,
  updateAvailableShares: (daoId: string) => void,
  updateRaisedFunds: (daoId: string) => void,
  updateCompactFundsActivity: (daoId: string) => void,
  updateSharesDistr: (dao: DaoJs) => void,

  showProgress: SetBool,
  daoId: string,
  dao: DaoJs,
  availableSharesNumber: string,
  buySharesCount: string,
  setShareAmountError: SetString,
  setShowBuyCurrencyInfoModal: (info: BuyCurrencyModalInfo) => void,
  totalCostNumber: string
) => {
  try {
    setShareAmountError(null)

    ///////////////////////////////////
    // TODO refactor invest/lock
    // 1. sign tx for app opt-in
    showProgress(true)
    let optInToAppsRes = await wasm.optInToAppsIfNeeded({
      app_id: "" + dao.app_id,
      investor_address: myAddress,
    })
    console.log("optInToAppsRes: " + JSON.stringify(optInToAppsRes))
    var optInToAppsSignedOptional = null
    if (optInToAppsRes.to_sign != null) {
      showProgress(false)
      optInToAppsSignedOptional = await wallet.signTxs(optInToAppsRes.to_sign)
    }
    console.log(
      "optInToAppsSignedOptional: " + JSON.stringify(optInToAppsSignedOptional)
    )
    ///////////////////////////////////

    showProgress(true)
    // 2. buy the shares (requires app opt-in for local state)
    // TODO write which local state
    let buyRes = await wasm.buyShares({
      dao_id: daoId,
      share_count: buySharesCount,
      available_shares: availableSharesNumber,
      investor_address: myAddress,
      app_opt_ins: optInToAppsSignedOptional,
      signed_prospectus: dao.prospectus,
    })
    console.log("buyRes: " + JSON.stringify(buyRes))
    showProgress(false)

    let buySharesSigned = await wallet.signTxs(buyRes.to_sign)
    console.log("buySharesSigned: " + JSON.stringify(buySharesSigned))

    showProgress(true)
    let submitBuySharesRes = await wasm.submitBuyShares({
      investor_address: myAddress,
      buy_total_cost: totalCostNumber,
      txs: buySharesSigned,
      pt: buyRes.pt,
    })
    console.log("submitBuySharesRes: " + JSON.stringify(submitBuySharesRes))
    showProgress(false)

    await updateMyBalance(myAddress)

    notification.success(
      "Congratulations! you bought " + buySharesCount + " shares."
    )

    await updateMyShares(daoId, myAddress)
    await updateFunds(daoId)
    await updateInvestmentData(daoId, myAddress)
    await updateAvailableShares(daoId)
    await updateRaisedFunds(daoId)
    await updateCompactFundsActivity(daoId)
    await updateSharesDistr(dao)
  } catch (eAny) {
    const e: FrError = eAny

    if (isValidationError(e)) {
      setShareAmountError(toValidationErrorMsg(e.validation))
      // show a general message additionally, just in case
      notification.error("Please fix the errors")
    } else if (isNotEnoughFundsAssetError(e)) {
      setShowBuyCurrencyInfoModal({ amount: e.notEnoughFundsAsset.to_buy })
    } else {
      notification.error(toDefaultErrorMsg(e))
    }

    showProgress(false)
  }
}

export type BuyCurrencyModalInfo = {
  amount: string
}
