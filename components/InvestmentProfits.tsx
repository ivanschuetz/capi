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
import { SetBool } from "../type_alias"
import { WithTooltip } from "./labeled_inputs"

export const InvestmentProfits = ({ deps }: { deps: Deps }) => {
  let daoId = useDaoId()

  const [dao, setDao] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  update(deps, daoId, setDao)

  const claimButtonDisabled =
    deps.investmentData.investor_claimable_dividend === "0"

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
            <WithTooltipIfDisabled
              disabled={claimButtonDisabled}
              tooltip="Nothing to claim."
            >
              <SubmitClaimButton
                submitting={submitting}
                setSubmitting={setSubmitting}
                deps={deps}
                daoId={daoId}
                disabled={claimButtonDisabled}
              />
            </WithTooltipIfDisabled>
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

type SubmitClaimButtonProps = {
  submitting: boolean
  setSubmitting: SetBool
  deps: Deps
  daoId: string
  disabled: boolean
}

type WithTooltipIfDisabledProps = {
  disabled: boolean
  tooltip: string
  children: any
}

const WithTooltipIfDisabled = ({
  disabled,
  tooltip,
  children,
}: WithTooltipIfDisabledProps) => {
  if (disabled) {
    return <WithTooltip text={tooltip}>{children}</WithTooltip>
  } else {
    return children
  }
}

const SubmitClaimButton = ({
  submitting,
  setSubmitting,
  deps,
  daoId,
  disabled,
}: SubmitClaimButtonProps) => {
  return (
    <SubmitButton
      label={"Claim"}
      isLoading={submitting}
      disabled={disabled}
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
  )
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
