import { useState } from "react"
import { Deps } from "../context/AppContext"
import { toErrorMsg } from "../functions/validation"
import { LockOrUnlockShares } from "./LockOrUnlockShares"

export const LockShares = ({ deps, dao, daoId, onLockOpt }) => {
  const [submitting, setSubmitting] = useState(false)

  return (
    <LockOrUnlockShares
      dao={dao}
      investmentData={deps.investmentData}
      showInput={true}
      title={"Lock shares"}
      inputLabel={"Lock shares"}
      buttonLabel={"Lock"}
      submitting={submitting}
      onSubmit={async (input, setInputError) => {
        if (!deps.wasm) {
          // should be unlikely, as wasm should initialize quickly
          console.error("Click while wasm isn't ready. Ignoring.")
          return
        }

        await lock(
          deps,
          setSubmitting,
          daoId,
          dao,
          input,
          onLockOpt,
          setInputError
        )
      }}
    />
  )
}

export const lock = async (
  deps: Deps,
  showProgress,
  daoId,
  dao,
  lockSharesCount,
  onLockOpt,
  setInputError
) => {
  try {
    ///////////////////////////////////
    // TODO refactor invest/lock
    // 1. sign tx for app opt-in
    showProgress(true)
    let optInToAppsRes = await deps.wasm.optInToAppsIfNeeded({
      app_id: "" + dao.app_id,
      investor_address: deps.myAddress,
    })
    console.log("optInToAppsRes: " + JSON.stringify(optInToAppsRes))
    var optInToAppsSignedOptional = null
    if (optInToAppsRes.to_sign != null) {
      showProgress(false)
      optInToAppsSignedOptional = await deps.wallet.signTxs(
        optInToAppsRes.to_sign
      )
    }
    console.log(
      "optInToAppsSignedOptional: " + JSON.stringify(optInToAppsSignedOptional)
    )
    ///////////////////////////////////

    showProgress(true)
    // 2. buy the shares (requires app opt-in for local state)
    // TODO write which local state

    let lockRes = await deps.wasm.lock({
      dao_id: daoId,
      investor_address: deps.myAddress,
      share_count: lockSharesCount,
    })
    console.log("lockRes: " + JSON.stringify(lockRes))
    showProgress(false)

    let lockResSigned = await deps.wallet.signTxs(lockRes.to_sign)
    console.log("lockResSigned: " + JSON.stringify(lockResSigned))

    showProgress(true)

    let submitLockRes = await deps.wasm.submitLock({
      app_opt_ins: optInToAppsSignedOptional,
      txs: lockResSigned,
    })
    console.log("submitLockRes: " + JSON.stringify(submitLockRes))
    showProgress(false)

    deps.notification.success(
      "Congratulations! you locked " + lockSharesCount + " shares."
    )

    await deps.updateInvestmentData(daoId, deps.myAddress)
    await deps.updateMyBalance(deps.myAddress)
    await deps.updateMyShares(daoId, deps.myAddress)

    if (onLockOpt) {
      onLockOpt()
    }
  } catch (e) {
    if (e.id === "validation") {
      console.error("%o", e)
      setInputError(toErrorMsg(e.details))
    } else {
      deps.notification.error(e)
    }
    showProgress(false)
  }
}
