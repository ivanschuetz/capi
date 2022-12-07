import { useEffect, useState } from "react"
import { DaoJs } from "wasm/wasm"
import { BuyFundsAssetModal } from "../buy_currency/BuyFundsAssetModal"
import { Deps } from "../context/AppContext"
import {
  BuyCurrencyModalInfo,
  calculateSharesPrice,
  invest,
} from "../functions/invest_embedded"
import { useDaoId } from "../hooks/useDaoId"
import funds from "../images/funds.svg"
import error from "../images/svg/error.svg"
import { AckProspectusModal } from "../prospectus/AckProspectusModal"
import { SetBool, SetString } from "../type_alias"
import { SelectWalletModal } from "../wallet/SelectWalletModal"
import { InfoView } from "./labeled_inputs"
import { SubmitButton } from "./SubmitButton"
import { InteractiveBox } from "./InteractiveBox"

export const InvestEmbedded = ({ deps, dao }: { deps: Deps; dao: DaoJs }) => {
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
    buySharesCount,
    dao,
    setTotalCost,
    setTotalCostNumber,
    setProfitPercentage,
    daoId
  )
  registerInvest(
    deps,
    dao,
    buyIntent,
    setBuyIntent,
    buySharesCount,
    setShareAmountError,
    setShowBuyCurrencyInfoModal,
    totalCostNumber,
    setSubmitting,
    daoId
  )

  const onSubmitBuy = () => {
    setBuyIntent(true)
    var myAddress = deps.myAddress
    if (myAddress === "") {
      setShowSelectWalletModal(true)
    }
  }

  const box = () => {
    return (
      <InteractiveBox title={"Buy shares"}>
        <div className="flex flex-col justify-between gap-10 4xl:flex-row 4xl:justify-start 4xl:gap-36">
          <div className="flex max-w-[535px] flex-col flex-wrap 4xl:w-full">
            <TopBlock deps={deps} />
            <Input
              input={buySharesCount}
              setInput={setBuySharesCount}
              errorMsg={shareAmountError}
            />
            <SubmitButton
              label={"Buy"}
              isLoading={submitting}
              onClick={() => {
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
      </InteractiveBox>
    )
  }

  return (
    deps.availableShares && (
      <>
        {box()}
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
        {showProspectusModal && (
          <AckProspectusModal
            deps={deps}
            closeModal={() => setShowProspectusModal(false)}
            onAccept={() => {
              setShowProspectusModal(false)
              // continue with buy flow: assumes that the disclaimer here is (only) shown when clicking on buy
              onSubmitBuy()
            }}
          />
        )}
      </>
    )
  )
}

const Input = ({
  input,
  setInput,
  errorMsg,
}: {
  input: string
  setInput: SetString
  errorMsg?: string
}) => {
  return (
    <div>
      <input
        className="bg-inp px-6 py-5"
        placeholder={"Enter amount"}
        size={30}
        type="number"
        min="0"
        value={input}
        onChange={(event) => setInput(event.target.value)}
      />
      <div className="mx-5 mt-2 mb-8 flex w-full items-center gap-2 text-pr">
        {errorMsg ? <img src={error.src} alt="error" /> : ""}
        {errorMsg}
      </div>{" "}
    </div>
  )
}

const TopBlock = ({ deps }: { deps: Deps }) => {
  return (
    <div className="mb-3">
      <div className="flex flex-col">
        <div className="mb-4 flex gap-3">
          <div className="text-50 font-bold text-te2">{"Available: "}</div>
          <div className="text-50 font-bold text-bg">
            {deps.availableShares}
          </div>
        </div>
        {deps.investmentData && (
          <div className="lead mt-2 flex flex-col flex-wrap items-start gap-3 whitespace-nowrap sm:flex-row sm:items-center 2xl:flex-nowrap">
            <div className="text-50 font-bold text-te2">You have:</div>
            <TopBlockItem
              label={"Locked shares:"}
              value={deps.investmentData.investor_locked_shares}
            />
            <BlueCircle />
            <TopBlockItem
              label={"Unlocked shares:"}
              value={deps.investmentData.investor_unlocked_shares}
            />
            <BlueCircle />
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

const BlueCircle = () => {
  return <div className="hidden h-2 w-2 rounded-full bg-ter sm:block" />
}
const TopBlockItem = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex items-center">
      <div className="mr-2 text-45 text-te2">{label}</div>
      <div className="text-45 font-bold text-bg3">{value}</div>
    </div>
  )
}

const RightView = ({
  funds,
  totalCost,
  totalPercentage,
}: {
  funds: any
  totalCost: string
  totalPercentage: string
}) => {
  return (
    <div className="flex flex-col items-center gap-10 sm:items-stretch sm:gap-32 md:flex-row xl:flex-col xl:gap-10">
      <div className="align-center">
        {/* <div className="desc">{"Total price"}</div> */}
        <div className="text-50 font-semibold">{"Total price"}</div>
        <div className="flex gap-2">
          <img src={funds.src} alt="funds" />
          <div className="text-60 font-bold text-bg">{totalCost}</div>
        </div>
      </div>
      <div className="flex">
        <div className="items-center">
          <div className="flex flex-nowrap items-center gap-2 text-50 font-semibold">
            {"Expected dividend"}
            {
              <InfoView
                text={
                  "Total expected dividend if you buy these shares (includes already locked shares)"
                }
              />
            }
          </div>
          <div className="flex gap-2 ">
            <div className="text-center text-60 font-bold text-bg">
              {totalPercentage}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const updateAvailableShares = (deps: Deps, daoId?: string) => {
  useEffect(() => {
    if (daoId) {
      deps.updateAvailableShares.call(null, daoId)
    }
  }, [deps.updateAvailableShares, deps.notification, daoId])
}

const updatePriceAndPercentage = (
  deps: Deps,
  buySharesCount: string,
  dao: DaoJs,
  setTotalCost: SetString,
  setTotalCostNumber: SetString,
  setProfitPercentage: SetString,
  daoId?: string
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
            // showError(deps.notification, e)
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
  dao: DaoJs,
  buyIntent: boolean,
  setBuyIntent: SetBool,
  buySharesCount: string,
  setShareAmountError: SetString,
  setShowBuyCurrencyInfoModal: (info: BuyCurrencyModalInfo) => void,
  totalCostNumber: string,
  setSubmitting: SetBool,
  daoId?: string
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
