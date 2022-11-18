import React, { useEffect, useState } from "react"
import { FundsAssetImg } from "../images/FundsAssetImg"
// import {updateChainInvestmentData_ as updateInvestmentData_} from "./controller";
import { init } from "../controller/investment"
import { retrieveProfits } from "../functions/shared"
import { SubmitButton } from "./SubmitButton"
import Progress from "./Progress"
import { useDaoId } from "../hooks/useDaoId"

export const InvestmentProfits = ({ deps }) => {
  let daoId = useDaoId()

  const [dao, setDao] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function doInit() {
      await init(
        deps.wasm,
        deps.statusMsg,
        deps.myAddress,
        deps.updateInvestmentData,
        deps.updateMyShares,

        daoId,
        setDao
      )
    }
    if (deps.wasm) {
      doInit()
    }
    doInit()
  }, [
    deps.wasm,
    daoId,
    deps.myAddress,
    deps.statusMsg,
    deps.updateInvestmentData,
    deps.updateMyShares,
  ])

  const view = () => {
    if (dao && deps.investmentData) {
      return (
        <div>
          <div className="box-container">
            <div className="title">{"Your profits"}</div>
            <div className="retrievable-profits">
              <div className="retrievable-tab">
                <div className="flex-block align-center">
                  <div className="desc">{"Retrievable:"}</div>
                  <FundsAssetImg className="fund-asset" />
                  <div className="subtitle">
                    {deps.investmentData.investor_claimable_dividend}
                  </div>
                </div>
                <SubmitButton
                  label={"Claim"}
                  className="button-primary"
                  isLoading={submitting}
                  disabled={
                    deps.investmentData.investor_claimable_dividend === "0"
                  }
                  onClick={async () => {
                    await retrieveProfits(
                      deps.myAddress,
                      setSubmitting,
                      deps.statusMsg,
                      deps.updateMyBalance,
                      daoId,
                      deps.updateInvestmentData,
                      deps.updateFunds,
                      deps.updateMyDividend,
                      deps.wallet
                    )
                  }}
                />
              </div>
              <div className="retrieved-tab">
                <div className="desc">{"Retrieved:"}</div>
                <div className="flex-block align-center">
                  <FundsAssetImg className="fund-asset" />
                  <div className="subtitle">
                    {" "}
                    {deps.investmentData.investor_already_retrieved_amount}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return <Progress />
    }
  }

  return (
    <div>
      <div className="mt-40">{view()}</div>
    </div>
  )
}
