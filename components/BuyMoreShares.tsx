import { useEffect, useState } from "react"
import { BuyFundsAssetModal } from "../buy_currency/BuyFundsAssetModal"
import { Deps } from "../context/AppContext"
import {
  BuyCurrencyModalInfo,
  calculateSharesPrice,
  invest,
} from "../functions/invest_embedded"
import { useDaoId } from "../hooks/useDaoId"
import dark_cyan_circle from "../images/dark_cyan_circle.svg"
import grey_circle from "../images/grey_circle.svg"
import light_cyan_circle from "../images/light_cyan_circle.svg"
import { AckProspectusModal } from "../prospectus/AckProspectusModal"
import { PieChartPercentageSlice } from "./SharesDistributionChart"
import { LabeledAmountInput } from "./labeled_inputs"
import { SubmitButton } from "./SubmitButton"
import { DaoJs } from "wasm/wasm"
import { SetBool, SetString } from "../type_alias"
import { ShareSupply } from "./ShareSupply"
import { ChartLabel } from "./ChartLabel"
import { WithPieChartBox } from "./WithPieChartBox"
import { pieChartColors, PIE_CHART_GRAY } from "../functions/utils"

export const BuyMoreShares = ({ deps, dao }: { deps: Deps; dao: DaoJs }) => {
  let daoId = useDaoId()

  const [buySharesCount, setBuySharesCount] = useState(null)
  const [buySharesAmountError, setBuySharesAmountError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [totalCostNumber, setTotalCostNumber] = useState(null)
  const [showProspectusModal, setShowProspectusModal] = useState(false)
  const [showBuyCurrencyInfoModal, setShowBuyCurrencyInfoModal] = useState(null)

  updateAvailableShares(deps, daoId)
  updateTotalPrice(deps, daoId, buySharesCount, dao, setTotalCostNumber)

  const onSubmitBuy = async () => {
    submitBuy(
      deps,
      setSubmitting,
      daoId,
      dao,
      buySharesCount,
      setBuySharesAmountError,
      setShowBuyCurrencyInfoModal,
      totalCostNumber
    )
  }

  const view = () => {
    return (
      <WithPieChartBox
        title={"Buy more shares"}
        slices={[
          to_pie_chart_slice(deps.availableShares),
          to_pie_chart_slice(deps.investmentData.investor_locked_shares),
          to_pie_chart_slice(deps.investmentData.investor_unlocked_shares),
        ]}
        // we want to show available shares in gray and it's the first segment, so we prepend gray to the colors
        // note that this is inconsistent with how it's shown on investors distribution (using NOT_OWNED segment type)
        // should be refactored (maybe create a generic "gray" segment type)
        chartColors={[PIE_CHART_GRAY].concat(pieChartColors())}
      >
        <>
          <ShareSupply supply={dao.share_supply} />
          <ChartLabels deps={deps} />

          <div className="buy-shares-input">
            <LabeledAmountInput
              label={"Buy shares"}
              placeholder={"Enter amount"}
              inputValue={buySharesCount}
              onChange={(input) => setBuySharesCount(input)}
              errorMsg={buySharesAmountError}
            />
            <SubmitButton
              label={"Buy"}
              className="button-primary"
              isLoading={submitting}
              disabled={deps.availableShares === "0"}
              onClick={async () => {
                if (deps.features.prospectus) {
                  setShowProspectusModal(true)
                } else {
                  await onSubmitBuy()
                }
              }}
            />
          </div>
        </>
      </WithPieChartBox>
    )
  }

  return (
    <div>
      {dao && deps.investmentData && view()}
      {showBuyCurrencyInfoModal && deps.myAddress && (
        <BuyFundsAssetModal
          deps={deps}
          amount={showBuyCurrencyInfoModal.amount}
          closeModal={() => setShowBuyCurrencyInfoModal(null)}
        />
      )}
      {showProspectusModal && (
        <AckProspectusModal
          deps={deps}
          closeModal={() => setShowProspectusModal(false)}
          onAccept={async () => {
            setShowProspectusModal(false)
            onSubmitBuy()
          }}
        />
      )}
    </div>
  )
}

const ChartLabels = ({ deps }: { deps: Deps }) => {
  return (
    <>
      <ChartLabel
        number={deps.availableShares}
        circleImg={grey_circle.src}
        text={"Available"}
      />
      <ChartLabel
        number={deps.investmentData.investor_locked_shares}
        circleImg={light_cyan_circle.src}
        text={"Your locked shares"}
      />
      <ChartLabel
        number={deps.investmentData.investor_unlocked_shares}
        circleImg={dark_cyan_circle.src}
        text={"Your unlocked shares"}
      />
    </>
  )
}

const to_pie_chart_slice = (percentage: string): PieChartPercentageSlice => {
  return { percentage_number: percentage, isSelected: false, type_: "" }
}

const updateAvailableShares = (deps: Deps, daoId: string) => {
  useEffect(() => {
    deps.updateAvailableShares.call(null, daoId)
  }, [deps.updateAvailableShares, deps.notification, daoId])
}

const updateTotalPrice = (
  deps: Deps,
  daoId: string,
  buySharesCount: string,
  dao: DaoJs,
  setTotalCostNumber: SetString
) => {
  useEffect(() => {
    ;(async () => {
      if (deps.availableShares && buySharesCount) {
        try {
          let res = await calculateSharesPrice(
            deps.wasm,
            deps.availableSharesNumber,
            buySharesCount,
            dao,
            null
          )

          setTotalCostNumber(res.total_price_number)
        } catch (e) {
          // for now disabled - we don't want to show validation messages while typing, to be consistent with other inputs
          // showError(deps.notification, e)
          console.error("updatePercentage error (ignored): %o", e)
        }
      }
    })()
  }, [
    deps.notification,
    deps.availableShares,
    deps.availableSharesNumber,
    daoId,
    buySharesCount,
    dao,
  ])
}

const submitBuy = async (
  deps: Deps,
  setSubmitting: SetBool,
  daoId: string,
  dao: DaoJs,
  buySharesCount: string,
  setBuySharesAmountError: SetString,
  setShowBuyCurrencyInfoModal: (info: BuyCurrencyModalInfo) => void,
  totalCostNumber: string
) => {
  await invest(
    deps.wasm,
    deps.notification,
    deps.myAddress,
    deps.wallet,
    deps.updateMyBalance,
    deps.updateMyShares,
    deps.updateFunds,
    deps.updateInvestmentData,
    deps.updateAvailableShares,
    deps.updateRaisedFunds,
    deps.updateCompactFundsActivity,
    deps.updateSharesDistr,

    setSubmitting,
    daoId,
    dao,
    deps.availableSharesNumber,
    buySharesCount,
    setBuySharesAmountError,
    setShowBuyCurrencyInfoModal,
    totalCostNumber
  )
}
