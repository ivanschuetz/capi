import React, { useEffect, useState } from "react"
import Progress from "./Progress"
import { SubmitButton } from "./SubmitButton"
import { LabeledCurrencyInput, LabeledTextArea } from "./labeled_inputs"
import { Funds } from "./Funds"
import { init, withdraw } from "../controller/withdraw"
import pencil from "../images/svg/pencil.svg"
import funds from "../images/funds.svg"
import { useDaoId } from "../hooks/useDaoId"

export const Withdraw = ({ deps }) => {
  let daoId = useDaoId()

  const [withdrawalAmount, setWithdrawalAmount] = useState("10")
  const [withdrawalDescr, setWithdrawalDescr] = useState("Type the reason")
  const [dao, setDao] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function asyncInit() {
      await init(deps.wasm, deps.statusMsg, daoId, null, setDao)
    }
    if (deps.wasm) {
      asyncInit()
    }
  }, [deps.wasm, daoId, setDao, deps.statusMsg])

  const view = () => {
    if (dao) {
      return (
        <div className="box-container mt-80">
          <div className="title">{"Withdraw Funds from project"}</div>
          {/* <DaoName dao={dao} /> */}
          <Funds
            funds={deps.funds}
            showWithdrawLink={false}
            daoId={daoId}
            containerClassNameOpt="dao_funds__cont_in_withdraw"
          />
          <LabeledCurrencyInput
            label={"How much?"}
            inputValue={withdrawalAmount}
            img={funds}
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
                deps.wasm,
                deps.statusMsg,
                deps.myAddress,
                deps.wallet,
                deps.updateMyBalance,
                deps.updateFunds,

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
