import { useEffect, useState } from "react"
import { DaoJs } from "wasm/wasm"
import { Deps } from "../context/AppContext"
import { safe } from "../functions/utils"
import { useDaoId } from "../hooks/useDaoId"
import pencil from "../images/svg/pencil.svg"
import { SetBool } from "../type_alias"
import { Funds } from "./Funds"
import { LabeledCurrencyInput, LabeledTextArea } from "./labeled_inputs"
import Progress from "./Progress"
import { SubmitButton } from "./SubmitButton"

export const Withdraw = ({ deps }: { deps: Deps }) => {
  let daoId = useDaoId()

  const [withdrawalAmount, setWithdrawalAmount] = useState("10")
  const [withdrawalDescr, setWithdrawalDescr] = useState("Type the reason")
  const [dao, setDao] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  updateDao(deps, daoId, setDao)

  const view = () => {
    if (dao) {
      return (
        <div className="box-container mt-80">
          <div className="title">{"Withdraw Funds from project"}</div>
          <Funds
            funds={deps.funds}
            showWithdrawLink={false}
            daoId={daoId}
            containerClassNameOpt="dao_funds__cont_in_withdraw"
          />
          <LabeledCurrencyInput
            label={"How much?"}
            inputValue={withdrawalAmount}
            onChange={(input) => setWithdrawalAmount(input)}
          />
          <LabeledTextArea
            className="textarea-withdraw"
            label={"For what?"}
            img={pencil}
            inputValue={withdrawalDescr}
            onChange={(input) => setWithdrawalDescr(input)}
            maxLength={200} // NOTE: has to match WASM
            rows={3}
          />

          <SubmitButton
            label={"Withdraw"}
            className="button-primary"
            isLoading={submitting}
            disabled={deps.myAddress === ""}
            onClick={async () => {
              if (!deps.wasm) {
                // should be unlikely, as wasm should initialize quickly
                console.error("Click while wasm isn't ready. Ignoring.")
                return
              }

              await withdraw(
                deps,
                setSubmitting,
                daoId,
                withdrawalAmount,
                withdrawalDescr
              )
            }}
          />
        </div>
      )
    } else {
      return <Progress />
    }
  }

  return <div>{view()}</div>
}

const updateDao = (deps: Deps, daoId: string, setDao: (dao: DaoJs) => void) => {
  useEffect(() => {
    safe(deps.notification, async () => {
      // TODO can't we just use the dao in deps
      setDao(await deps.wasm.loadDao(daoId))
    })
  }, [deps.wasm, daoId, setDao, deps.notification])
}

const withdraw = async (
  deps: Deps,
  showProgress: SetBool,
  daoId: string,
  withdrawalAmount: string,
  withdrawalDescr: string
) => {
  try {
    showProgress(true)
    let withdrawRes = await deps.wasm.withdraw({
      dao_id: daoId,
      sender: deps.myAddress,
      withdrawal_amount: withdrawalAmount,
      description: withdrawalDescr,
    })
    // TODO update list with returned withdrawals list
    console.log("withdrawRes: " + JSON.stringify(withdrawRes))
    showProgress(false)

    let withdrawResSigned = await deps.wallet.signTxs(withdrawRes.to_sign)
    console.log("withdrawResSigned: " + withdrawResSigned)

    showProgress(true)
    let submitWithdrawRes = await deps.wasm.submitWithdraw({
      txs: withdrawResSigned,
      pt: withdrawRes.pt,
    })

    console.log("submitWithdrawRes: " + JSON.stringify(submitWithdrawRes))

    deps.notification.success("Withdrawal request submitted")
    showProgress(false)

    await deps.updateMyBalance(deps.myAddress)
    await deps.updateFunds(daoId)
  } catch (e) {
    deps.notification.error(e)
    showProgress(false)
  }
}
