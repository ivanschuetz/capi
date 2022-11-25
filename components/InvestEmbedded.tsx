import { useEffect, useState } from "react"
import { BuyFundsAssetModal } from "../buy_currency/BuyFundsAssetModal"
import { Deps } from "../context/AppContext"
import { calculateSharesPrice, invest } from "../functions/invest_embedded"
import { useDaoId } from "../hooks/useDaoId"
import funds from "../images/funds.svg"
import error from "../images/svg/error.svg"
import { AckProspectusModal } from "../prospectus/AckProspectusModal"
import { SetBool } from "../type_alias"
import { SelectWalletModal } from "../wallet/SelectWalletModal"
import { InfoView } from "./labeled_inputs"
import { SubmitButton } from "./SubmitButton"

export const InvestEmbedded = ({ deps, dao }) => {
  const daoId = useDaoId()

  const [buySharesCount, setBuySharesCount] = useState("1")
  const [totalCost, setTotalCost] = useState(null)
  const [totalCostNumber, setTotalCostNumber] = useState(null)
  const [totalPercentage, setProfitPercentage] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [shareAmountError, setShareAmountError] = useState("")

  const [showSelectWalletModal, setShowSelectWalletModal] = useState(false)
  const [buyIntent, setBuyIntent] = useState(false)

  const [showProspectusModal, setShowProspectusModal] = useState(false)

  // show modal carries an object here, to pass details
  const [showBuyCurrencyInfoModal, setShowBuyCurrencyInfoModal] = useState(null)

  updateAvailableShares(deps, daoId)
  updatePriceAndPercentage(
    deps,
    daoId,
    buySharesCount,
    dao,
    setTotalCost,
    setTotalCostNumber,
    setProfitPercentage
  )
  registerInvest(
    deps,
    daoId,
    dao,
    buyIntent,
    setBuyIntent,
    buySharesCount,
    setShareAmountError,
    setShowBuyCurrencyInfoModal,
    totalCostNumber,
    setSubmitting
  )

  const onSubmitBuy = () => {
    setBuyIntent(true)
    var myAddress = deps.myAddress
    if (myAddress === "") {
      setShowSelectWalletModal(true)
    }
  }

  const view = () => {
    return (
      <div className="mt-80">
        <div className="dao_action_active_tab box-container">
          <div className="title">{"Buy Shares"}</div>
          <div className="buy-shares-content">
            <div className="dao-shares buy-shares-left-col">
              <TopBlock deps={deps} />
              <div>
                <input
                  placeholder={"Enter amount"}
                  size="30"
                  type="number"
                  min="0"
                  value={buySharesCount}
                  onChange={(event) => setBuySharesCount(event.target.value)}
                />
                <div className="labeled_input__error w-100 mb-32">
                  {shareAmountError ? <img src={error} alt="error" /> : ""}
                  {shareAmountError}
                </div>
              </div>
              <SubmitButton
                label={"Buy"}
                className={"button-primary"}
                isLoading={submitting}
                onClick={async (_) => {
                  if (deps.features.prospectus) {
                    setShowProspectusModal(true)
                  } else {
                    onSubmitBuy()
                  }
                }}
              />
            </div>
            <RightView
              funds={funds}
              totalCost={totalCost}
              totalPercentage={totalPercentage}
            />
          </div>

          {showSelectWalletModal && (
            <SelectWalletModal
              deps={deps}
              setShowModal={setShowSelectWalletModal}
            />
          )}
          {showBuyCurrencyInfoModal && deps.myAddress && (
            <BuyFundsAssetModal
              deps={deps}
              amount={showBuyCurrencyInfoModal.amount}
              closeModal={() => setShowBuyCurrencyInfoModal(null)}
            />
          )}
        </div>

        {showProspectusModal && (
          <AckProspectusModal
            url={deps.dao.prospectus.url}
            prospectusHash={deps.dao.prospectus.hash}
            closeModal={() => setShowProspectusModal(false)}
            onAccept={() => {
              setShowProspectusModal(false)
              // continue with buy flow: assumes that the disclaimer here is (only) shown when clicking on buy
              onSubmitBuy()
            }}
          />
        )}
      </div>
    )
  }

  return deps.availableShares && view()
}

const TopBlock = ({ deps }) => {
  return (
    <div className="top-block">
      <div className="available-shares">
        <div className="d-flex mb-16 gap-12">
          <div className="desc">{"Available: "}</div>
          <div className="desc">{deps.availableShares}</div>
        </div>
        {deps.investmentData && (
          <div className="shares-block">
            <div className="desc">You have:</div>
            <TopBlockItem
              label={"Locked shares:"}
              value={deps.investmentData.investor_locked_shares}
            />
            <div className="blue-circle"></div>
            <TopBlockItem
              label={"Unlocked shares:"}
              value={deps.investmentData.investor_unlocked_shares}
            />
            <div className="blue-circle"></div>
            <TopBlockItem
              label={"Share:"}
              value={deps.investmentData.investor_share}
            />
          </div>
        )}
      </div>
    </div>
  )
}

const TopBlockItem = ({ label, value }) => {
  return (
    <div className="d-flex align-center">
      <div className="mr-3">{label}</div>
      <div className="ft-weight-700">{value}</div>
    </div>
  )
}

const RightView = ({ funds, totalCost, totalPercentage }) => {
  return (
    <div className="buy-shares-right-col">
      <div id="shares_const_container">
        <div className="desc">{"Total price"}</div>
        <div className="d-flex gap-10">
          <img src={funds.src} alt="funds" />
          <div className="subtitle black">{totalCost}</div>
        </div>
      </div>
      <div className="d-flex mobile-input-block">
        <div id="retrieved-profits">
          <div className="ft-weight-600 d-flex align-center gap-10 ft-size-18 nowrap">
            {"Expected dividend"}
            {
              <InfoView
                text={
                  "Total expected dividend if you buy these shares (includes already locked shares)"
                }
              />
            }
          </div>
          <div className="d-flex gap-10">
            <div className="subtitle black">{totalPercentage}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const updateAvailableShares = (deps, daoId) => {
  useEffect(() => {
    if (daoId) {
      deps.updateAvailableShares.call(null, daoId)
    }
  }, [deps.updateAvailableShares, deps.notification, daoId])
}

const updatePriceAndPercentage = (
  deps,
  daoId,
  buySharesCount,
  dao,
  setTotalCost,
  setTotalCostNumber,
  setProfitPercentage
) => {
  useEffect(() => {
    async function nestedAsync() {
      if (deps.wasm && daoId && deps.availableSharesNumber != null) {
        if (buySharesCount) {
          try {
            let res = await calculateSharesPrice(
              deps.wasm,
              deps.availableSharesNumber,
              buySharesCount,
              dao,
              deps.investmentData?.investor_locked_shares
            )

            setTotalCost(res.total_price)
            setTotalCostNumber(res.total_price_number)
            setProfitPercentage(res.profit_percentage)
          } catch (e) {
            // for now disabled - we don't want to show validation messages while typing, to be consistent with other inputs
            // deps.notification.error(e);
            console.error(
              "updateTotalPriceAndPercentage error (ignored): %o",
              e
            )
          }
        } else {
          // no input: clear fields
          setTotalCost(null)
          setTotalCostNumber(null)
          setProfitPercentage(null)
        }
      }
    }
    nestedAsync()
  }, [
    deps.wasm,
    deps.notification,
    deps.availableSharesNumber,
    deps.investmentData?.investor_locked_shares,
    daoId,
    buySharesCount,
    dao,
  ])
}

const registerInvest = (
  deps: Deps,
  daoId,
  dao,
  buyIntent,
  setBuyIntent,
  buySharesCount,
  setShareAmountError,
  setShowBuyCurrencyInfoModal,
  totalCostNumber,
  setSubmitting: SetBool
) => {
  useEffect(() => {
    async function nestedAsync() {
      if (deps.wasm && daoId && deps.wallet && buyIntent && deps.myAddress) {
        setBuyIntent(false)

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
          setShareAmountError,
          setShowBuyCurrencyInfoModal,
          totalCostNumber
        )
      }
    }
    nestedAsync()
    // TODO warning about missing deps here - we *don't* want to trigger this effect when inputs change,
    // we want to send whatever is in the form when user submits - so we care only about the conditions that trigger submit
    // suppress lint? are we approaching this incorrectly?
  }, [
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
    deps.availableSharesNumber,

    buyIntent,
    buySharesCount,
    dao,
    daoId,
    totalCostNumber,
  ])
}
