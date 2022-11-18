import React, { useState, useEffect } from "react"
import { SubmitButton } from "./SubmitButton"
import { BuyFundsAssetModal } from "../buy_currency/BuyFundsAssetModal"
import { SharesDistributionChart } from "../shares_distribution_chart/SharesDistributionChart"
import { LabeledAmountInput } from "./labeled_inputs"
import { pieChartColors, PIE_CHART_GRAY } from "../functions/utils"
import redArrow from "../images/svg/arrow.svg"
import { invest, updateTotalPriceNumber } from "../controller/invest_embedded"
import { AckProspectusModal } from "../prospectus/AckProspectusModal"
import { useDaoId } from "../hooks/useDaoId"

export const BuyMoreShares = ({ deps, dao }) => {
  let daoId = useDaoId()

  const [buySharesCount, setBuySharesCount] = useState(null)

  const [buySharesAmountError, setBuySharesAmountError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [totalCostNumber, setTotalCostNumber] = useState(null)

  const [showProspectusModal, setShowProspectusModal] = useState(false)

  const [showBuyCurrencyInfoModal, setShowBuyCurrencyInfoModal] = useState(null)

  useEffect(() => {
    deps.updateAvailableShares.call(null, daoId)
  }, [deps.updateAvailableShares, deps.statusMsg, daoId])

  useEffect(() => {
    async function nestedAsync() {
      if (deps.availableShares && buySharesCount) {
        updateTotalPriceNumber(
          deps.availableSharesNumber,
          buySharesCount,
          dao,
          setTotalCostNumber
        )
      }
    }
    nestedAsync()
  }, [
    deps.statusMsg,
    deps.availableShares,
    deps.availableSharesNumber,
    daoId,
    buySharesCount,
    dao,
  ])

  const onSubmitBuy = async () => {
    await invest(
      deps.statusMsg,
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
                  <svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="8" cy="8.5" r="8" fill="#DEE2E2" />
                  </svg>
                </div>
                <div>{"Available"}</div>
              </div>
              <div className="chartBlock">
                <div className="numbers desc">
                  {deps.investmentData.investor_locked_shares}
                </div>
                <div className="h-16px">
                  <svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="8" cy="8.5" r="8" fill="#8ECACD" />
                  </svg>
                </div>
                <div>{"Your locked shares"}</div>
              </div>
              <div className="chartBlock">
                <div className="numbers desc">
                  {deps.investmentData.investor_unlocked_shares}
                </div>
                <div className="h-16px">
                  <svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="8" cy="8.5" r="8" fill="#6BB9BD" />
                  </svg>
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
