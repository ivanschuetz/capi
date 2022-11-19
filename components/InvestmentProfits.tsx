import React, { useEffect, useState } from "react"
import { FundsAssetImg } from "../images/FundsAssetImg"
// import {updateChainInvestmentData_ as updateInvestmentData_} from "./controller";
import { init } from "../controller/investment"
import { retrieveProfits } from "../functions/shared"
import { SubmitButton } from "./SubmitButton"
import Progress from "./Progress"
import { useDaoId } from "../hooks/useDaoId"
import { safe } from "../functions/utils"
import { Deps } from "../context/AppContext"

export const InvestmentProfits = ({ deps }) => {
  let daoId = useDaoId()

  const [dao, setDao] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  update(deps, daoId, setDao)

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
                    if (!deps.wasm) {
                      // should be unlikely, as wasm should initialize quickly
                      console.error("Click while wasm isn't ready. Ignoring.")
                      return
                    }

                    await retrieveProfits(
                      deps.wasm,
                      deps.myAddress,
                      setSubmitting,
                      deps.notification,
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

const update = (deps: Deps, daoId, setDao) => {
  useEffect(() => {
    if (deps.wasm) {
      safe(deps.notification, async () => {
        let dao = await deps.wasm.bridge_load_dao(daoId)
        console.log("dao: " + JSON.stringify(dao))
        setDao(dao)

        if (deps.myAddress) {
          // TODO check for daoId? or do we know it's always set?
          await deps.updateInvestmentData()
          await deps.updateMyShares(daoId, deps.myAddress)
        }
      })
    }
  }, [
    deps.wasm,
    daoId,
    deps.myAddress,
    deps.notification,
    deps.updateInvestmentData,
    deps.updateMyShares,
  ])
}
