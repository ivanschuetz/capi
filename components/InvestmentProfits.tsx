import { useEffect, useState } from "react"
import { FundsAssetImg } from "../images/FundsAssetImg"
import { Deps } from "../context/AppContext"
import { retrieveProfits } from "../functions/shared"
import { safe } from "../functions/utils"
import { useDaoId } from "../hooks/useDaoId"
import Progress from "./Progress"
import { SubmitButton } from "./SubmitButton"
import { DaoJs } from "wasm/wasm"
import { InteractiveBox } from "./InteractiveBox"

export const InvestmentProfits = ({ deps }: { deps: Deps }) => {
  let daoId = useDaoId()

  const [dao, setDao] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  update(deps, daoId, setDao)

  const box = () => {
    return (
      <InteractiveBox title="Your profits">
        <div className="retrievable-profits">
          <div className="retrievable-tab">
            <div className="flex-block align-center">
              <div className="desc">{"Retrievable:"}</div>
              <FundsAssetImg className="fund-asset" />
              <div className="label_30_on_acc">
                {deps.investmentData.investor_claimable_dividend}
              </div>
            </div>
            <SubmitButton
              label={"Claim"}
              className="button-primary"
              isLoading={submitting}
              disabled={deps.investmentData.investor_claimable_dividend === "0"}
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
          <Retrieved
            amount={deps.investmentData.investor_already_retrieved_amount}
          />
        </div>
      </InteractiveBox>
    )
  }

  if (dao && deps.investmentData) {
    return box()
  } else {
    return <Progress />
  }
}

const Retrieved = ({ amount }: { amount: string }) => {
  return (
    <div className="retrieved-tab">
      <div className="desc">{"Retrieved:"}</div>
      <div className="flex-block align-center">
        <FundsAssetImg className="fund-asset" />
        <div className="label_34_on_acc">{amount}</div>
      </div>
    </div>
  )
}

const update = (deps: Deps, daoId: string, setDao: (dao: DaoJs) => void) => {
  useEffect(() => {
    if (deps.wasm) {
      safe(deps.notification, async () => {
        let dao = await deps.wasm.loadDao(daoId)
        console.log("dao: %o", dao)
        setDao(dao)

        if (deps.myAddress) {
          // TODO check for daoId? or do we know it's always set?
          await deps.updateInvestmentData(daoId, deps.myAddress)
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
