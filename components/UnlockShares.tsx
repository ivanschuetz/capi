import { useState } from "react"
import { DaoJs } from "wasm/wasm"
import { Deps } from "../context/AppContext"
import { showError } from "../functions/utils"
import { SetBool } from "../type_alias"
import { LockOrUnlockShares } from "./LockOrUnlockShares"

export const UnlockShares = ({
  deps,
  dao,
  daoId,
}: {
  deps: Deps
  dao: DaoJs
  daoId: string
}) => {
  const [submitting, setSubmitting] = useState(false)

  return (
    <LockOrUnlockShares
      dao={dao}
      investmentData={deps.investmentData}
      // currently only unlocking all shares is allowed
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

const unlock = async (deps: Deps, showProgress: SetBool, daoId: string) => {
  try {
    showProgress(true)
    let unlockRes = await deps.wasm.unlock({
      dao_id: daoId,
      investor_address: deps.myAddress,
    })
    console.log("unlockRes: " + JSON.stringify(unlockRes))
    showProgress(false)

    let unlockResSigned = await deps.wallet.signTxs(unlockRes.to_sign)
    console.log("unlockResSigned: " + JSON.stringify(unlockResSigned))

    showProgress(true)
    let submitUnlockRes = await deps.wasm.submitUnlock({
      txs: unlockResSigned,
    })
    console.log("submitUnlockRes: " + JSON.stringify(submitUnlockRes))

    deps.notification.success("Shares unlocked")
    await deps.updateInvestmentData(daoId, deps.myAddress)
    showProgress(false)

    await deps.updateMyBalance(deps.myAddress)
    await deps.updateMyShares(daoId, deps.myAddress)
    // await updateMyDividend(daoId, deps.myAddress);
  } catch (e) {
    showError(deps.notification, e)
    showProgress(false)
  }
}
