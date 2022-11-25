import { useEffect, useState } from "react"
import { BuyFundsAssetModal } from "../buy_currency/BuyFundsAssetModal"
import { Deps } from "../context/AppContext"
import { calculateSharesPrice, invest } from "../functions/invest_embedded"
import { pieChartColors, PIE_CHART_GRAY } from "../functions/utils"
import { useDaoId } from "../hooks/useDaoId"
import dark_cyan_circle from "../images/dark_cyan_circle.svg"
import grey_circle from "../images/grey_circle.svg"
import light_cyan_circle from "../images/light_cyan_circle.svg"
import redArrow from "../images/svg/arrow.svg"
import { AckProspectusModal } from "../prospectus/AckProspectusModal"
import { SharesDistributionChart } from "./SharesDistributionChart"
import { LabeledAmountInput } from "./labeled_inputs"
import { SubmitButton } from "./SubmitButton"

export const BuyMoreShares = ({ deps, dao }) => {
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
      wasm,
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
      <div className="shares-box box-container">
        <div className="shares-amount">
          <div className="available-shares">
            <div>
              <div className="title nowrap">{"Buy more shares"}</div>
              <div className="mb-16 flex-block align-center">
                <div className="desc">{"Share supply"}</div>
                <div className="subtitle black">{dao.share_supply}</div>
                <div className="arrow-container">
                  <img src={redArrow.src} alt="redArrow" />
                </div>
              </div>
              <div className="chartBlock">
                {deps.availableShares && (
                  <div className="numbers desc">{deps.availableShares}</div>
                )}
                <div className="h-16px">
                  <img src={grey_circle.src} alt="" />
                </div>
                <div>{"Available"}</div>
              </div>
              <div className="chartBlock">
                <div className="numbers desc">
                  {deps.investmentData.investor_locked_shares}
                </div>
                <div className="h-16px">
                  <img src={light_cyan_circle.src} alt="" />
                </div>
                <div>{"Your locked shares"}</div>
              </div>
              <div className="chartBlock">
                <div className="numbers desc">
                  {deps.investmentData.investor_unlocked_shares}
                </div>
                <div className="h-16px">
                  <img src={dark_cyan_circle.src} alt="" />
                </div>
                <div>{"Your unlocked shares"}</div>
              </div>
            </div>
            <div className="shares-chart d-desktop-none">
              <SharesDistributionChart
                sharesDistr={[
                  to_pie_chart_slice(deps.availableShares),
                  to_pie_chart_slice(
                    deps.investmentData.investor_locked_shares
                  ),
                  to_pie_chart_slice(
                    deps.investmentData.investor_unlocked_shares
                  ),
                ]}
                // we want to show available shares in gray and it's the first segment, so we prepend gray to the colors
                // note that this is inconsistent with how it's shown on investors distribution (using NOT_OWNED segment type)
                // we should refactor this (maybe create a generic "gray" segment type)
                col={[PIE_CHART_GRAY].concat(pieChartColors())}
                animated={false}
                disableClick={true}
              />
            </div>
          </div>
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
        {deps.availableShares && (
          <div className="shares-chart d-tablet-mobile-none">
            <SharesDistributionChart
              sharesDistr={[
                to_pie_chart_slice(deps.availableShares),
                to_pie_chart_slice(deps.investmentData.investor_locked_shares),
                to_pie_chart_slice(
                  deps.investmentData.investor_unlocked_shares
                ),
              ]}
              // we want to show available shares in gray and it's the first segment, so we prepend gray to the colors
              // note that this is inconsistent with how it's shown on investors distribution (using NOT_OWNED segment type)
              // we should refactor this (maybe create a generic "gray" segment type)
              col={[PIE_CHART_GRAY].concat(pieChartColors())}
              animated={false}
              disableClick={true}
            />
          </div>
        )}
        {showBuyCurrencyInfoModal && deps.myAddress && (
          <BuyFundsAssetModal
            deps={deps}
            amount={showBuyCurrencyInfoModal.amount}
            closeModal={() => setShowBuyCurrencyInfoModal(null)}
          />
        )}
        {showProspectusModal && (
          <AckProspectusModal
            url={deps.dao.prospectus.url}
            prospectusHash={deps.dao.prospectus.hash}
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

  return <div>{dao && deps.investmentData && view()}</div>
}

const to_pie_chart_slice = (percentage) => {
  return { percentage_number: percentage }
}

const updateAvailableShares = (deps: Deps, daoId) => {
  useEffect(() => {
    deps.updateAvailableShares.call(null, daoId)
  }, [deps.updateAvailableShares, deps.notification, daoId])
}

const updateTotalPrice = (
  deps: Deps,
  daoId,
  buySharesCount,
  dao,
  setTotalCostNumber
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
          // deps.notification.error(e);
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
  setSubmitting,
  daoId,
  dao,
  buySharesCount,
  setBuySharesAmountError,
  setShowBuyCurrencyInfoModal,
  totalCostNumber
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
