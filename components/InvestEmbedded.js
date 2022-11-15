import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BuyFundsAssetModal } from "../buy_currency/BuyFundsAssetModal";
import {
  invest,
  updateTotalPriceAndPercentage,
} from "../controller/invest_embedded";
import funds from "../images/funds.svg";
import error from "../images/svg/error.svg";
import { AckProspectusModal } from "../prospectus/AckProspectusModal";
import { SelectWalletModal } from "../wallet/SelectWalletModal";
import { InfoView } from "./labeled_inputs";
import { SubmitButton } from "./SubmitButton";

export const InvestEmbedded = ({ deps, dao }) => {
  const router = useRouter();
  const { daoId } = router.query;

  const [buySharesCount, setBuySharesCount] = useState("1");
  const [totalCost, setTotalCost] = useState(null);
  const [totalCostNumber, setTotalCostNumber] = useState(null);
  const [totalPercentage, setProfitPercentage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [shareAmountError, setShareAmountError] = useState("");

  const [showSelectWalletModal, setShowSelectWalletModal] = useState(false);
  const [buyIntent, setBuyIntent] = useState(false);

  const [showProspectusModal, setShowProspectusModal] = useState(false);

  // show modal carries an object here, to pass details
  const [showBuyCurrencyInfoModal, setShowBuyCurrencyInfoModal] =
    useState(null);

  const onSubmitBuy = () => {
    setBuyIntent(true);
    var myAddress = deps.myAddress;
    if (myAddress === "") {
      setShowSelectWalletModal(true);
    }
  };

  useEffect(() => {
    deps.updateAvailableShares.call(null, daoId);
  }, [deps.updateAvailableShares, deps.statusMsg, daoId]);

  useEffect(() => {
    async function nestedAsync() {
      if (deps.availableSharesNumber != null) {
        if (buySharesCount) {
          updateTotalPriceAndPercentage(
            deps.availableSharesNumber,

            buySharesCount,
            dao,
            setTotalCost,
            setTotalCostNumber,
            setProfitPercentage,
            deps.investmentData?.investor_locked_shares
          );
        } else {
          // no input: clear fields
          setTotalCost(null);
          setTotalCostNumber(null);
          setProfitPercentage(null);
        }
      }
    }
    nestedAsync();
  }, [
    deps.statusMsg,
    deps.availableSharesNumber,
    deps.investmentData?.investor_locked_shares,
    daoId,
    buySharesCount,
    dao,
  ]);

  useEffect(() => {
    async function nestedAsync() {
      if (deps.wallet && buyIntent && deps.myAddress) {
        setBuyIntent(false);

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
          setShareAmountError,
          setShowBuyCurrencyInfoModal,
          totalCostNumber
        );
      }
    }
    nestedAsync();
    // TODO warning about missing deps here - we *don't* want to trigger this effect when inputs change,
    // we want to send whatever is in the form when user submits - so we care only about the conditions that trigger submit
    // suppress lint? are we approaching this incorrectly?
  }, [
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
    deps.availableSharesNumber,

    buyIntent,
    buySharesCount,
    dao,
    daoId,
    totalCostNumber,
  ]);

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
                    setShowProspectusModal(true);
                  } else {
                    onSubmitBuy();
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
              setShowProspectusModal(false);
              // continue with buy flow: assumes that the disclaimer here is (only) shown when clicking on buy
              onSubmitBuy();
            }}
          />
        )}
      </div>
    );
  };

  return deps.availableShares && view();
};

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
  );
};

const TopBlockItem = ({ label, value }) => {
  return (
    <div className="d-flex align-center">
      <div className="mr-3">{label}</div>
      <div className="ft-weight-700">{value}</div>
    </div>
  );
};

const RightView = ({ funds, totalCost, totalPercentage }) => {
  return (
    <div className="buy-shares-right-col">
      <div id="shares_const_container">
        <div className="desc">{"Total price"}</div>
        <div className="d-flex gap-10">
          <img src={funds} alt="funds" />
          <div className="subtitle black">{totalCost}</div>
        </div>
      </div>
      <div className="d-flex mobile-input-block">
        <div id="retrieved-profits">
          <div className="ft-weight-600 d-flex align-center gap-10 ft-size-18 nowrap">
            {"Expected dividend"}
            {
              <InfoView
                info={
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
  );
};
