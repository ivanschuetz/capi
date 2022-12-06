import { useEffect, useState } from "react"
import { BuyFundsAssetModal } from "../buy_currency/BuyFundsAssetModal"
import { Deps } from "../context/AppContext"
import {
  BuyCurrencyModalInfo,
  calculateSharesPrice,
  invest,
} from "../functions/invest_embedded"
import { pieChartColors, PIE_CHART_GRAY } from "../functions/utils"
import { useDaoId } from "../hooks/useDaoId"
import dark_cyan_circle from "../images/dark_cyan_circle.svg"
import grey_circle from "../images/grey_circle.svg"
import light_cyan_circle from "../images/light_cyan_circle.svg"
import redArrow from "../images/svg/arrow.svg"
import { AckProspectusModal } from "../prospectus/AckProspectusModal"
import {
  PieChartPercentageSlice,
  SharesDistributionChart,
} from "./SharesDistributionChart"
import { LabeledAmountInput } from "./labeled_inputs"
import { SubmitButton } from "./SubmitButton"
import { DaoJs } from "wasm/wasm"
import { SetBool, SetString } from "../type_alias"
import { PieChartSlice } from "../charts/renderPieChart"
import { InteractiveBox } from "./InteractiveBox"

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
      <InteractiveBox title={"Buy more shares"}>
        <div className="shares-box">
          <div className="shares-amount">
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
          </div>

          {/* desktop chart */}
          {deps.availableShares && (
            <div className="shares-chart d-tablet-mobile-none">
              <LockedUnlockedChart deps={deps} />
            </div>
          )}
          {/* mobile chart */}
          <div className="shares-chart d-desktop-none">
            <LockedUnlockedChart deps={deps} />
          </div>
        </div>
      </InteractiveBox>
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

const ShareSupply = ({ supply }: { supply: string }) => {
  return (
    <div className="mb-16 flex-block align-center">
      <div className="desc">{"Share supply"}</div>
      <div className="subtitle black">{supply}</div>
      <div className="arrow-container">
        <img src={redArrow.src} alt="redArrow" />
      </div>
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

const ChartLabel = ({
  number,
  circleImg,
  text,
}: {
  number: string
  circleImg: any
  text: string
}) => {
  return (
    <div className="chartBlock">
      <div className="numbers desc">{number}</div>
      <div className="h-16px">
        <img src={circleImg} alt="" />
      </div>
      <div>{text}</div>
    </div>
  )
}

const LockedUnlockedChart = ({ deps }: { deps: Deps }) => {
  return (
    <SharesDistributionChart
      sharesDistr={[
        to_pie_chart_slice(deps.availableShares),
        to_pie_chart_slice(deps.investmentData.investor_locked_shares),
        to_pie_chart_slice(deps.investmentData.investor_unlocked_shares),
      ]}
      // we want to show available shares in gray and it's the first segment, so we prepend gray to the colors
      // note that this is inconsistent with how it's shown on investors distribution (using NOT_OWNED segment type)
      // we should refactor this (maybe create a generic "gray" segment type)
      colors={[PIE_CHART_GRAY].concat(pieChartColors())}
      animated={false}
      disableClick={true}
    />
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
