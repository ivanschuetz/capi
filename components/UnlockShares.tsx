import React, { useState } from "react"
import { Deps } from "../context/AppContext"
import { LockOrUnlockShares } from "./LockOrUnlockShares"

export const UnlockShares = ({ deps, dao, daoId }) => {
  const [submitting, setSubmitting] = useState(false)

  return (
    <LockOrUnlockShares
      dao={dao}
      investmentData={deps.investmentData}
      // currently we allow only to unlock all the shares
      showInput={false}
      title={"Unlock shares"}
      buttonLabel={"Unlock"}
      submitting={submitting}
      onSubmit={async () => {
        if (!deps.wasm) {
          // should be unlikely, as wasm should initialize quickly
          console.error("Click while wasm isn't ready. Ignoring.")
          return
        }

        await unlock(deps, setSubmitting, daoId)
      }}
    />
  )
}

const unlock = async (deps: Deps, showProgress, daoId) => {
  try {
    deps.statusMsg.clear()

    showProgress(true)
    let unlockRes = await deps.wasm.bridge_unlock({
      dao_id: daoId,
      investor_address: deps.myAddress,
    })
    console.log("unlockRes: " + JSON.stringify(unlockRes))
    showProgress(false)

    let unlockResSigned = await deps.wallet.signTxs(unlockRes.to_sign)
    console.log("unlockResSigned: " + JSON.stringify(unlockResSigned))

    showProgress(true)
    let submitUnlockRes = await deps.wasm.bridge_submit_unlock({
      txs: unlockResSigned,
      pt: unlockRes.pt,
    })
    console.log("submitUnlockRes: " + JSON.stringify(submitUnlockRes))

    deps.statusMsg.success("Shares unlocked")
    await deps.updateInvestmentData(daoId, deps.myAddress)
    showProgress(false)

    await deps.updateMyBalance(deps.myAddress)
    await deps.updateMyShares(daoId, deps.myAddress)
    // await updateMyDividend(daoId, deps.myAddress);
  } catch (e) {
    deps.statusMsg.error(e)
    showProgress(false)
  }
}
