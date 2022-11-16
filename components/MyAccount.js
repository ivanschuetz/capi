import React, { useEffect, useState } from "react";
import arrow from "../images/svg/arrow-right.svg";
import { retrieveProfits } from "../functions/shared";
import { CopyPasteHtml } from "./CopyPastText";
import Progress from "./Progress";
import { SubmitButton } from "./SubmitButton";
import { SelectWallet } from "../wallet/SelectWallet";
import Modal from "../modal/Modal";
import funds from "../images/funds.svg";
import {
  needsToAcceptDisclaimer,
  saveAcceptedDisclaimer,
} from "../modal/storage";
import { DisclaimerModal } from "../modal/DisclaimerModal";

export const MyAccount = ({ deps, daoId }) => {
  const [showSelectWalletModal, setShowSelectWalletModal] = useState(false);

  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);

  return (
    <div className="my-account-container">
      <div className="d-flex justify-between">
        <div className="text">Wallet</div>
      </div>
      <div className="my-address">
        {myAddressView(deps, daoId)}
        {connectButton(deps, setShowSelectWalletModal, setShowDisclaimerModal)}
      </div>
      {showSelectWalletModal && (
        <Modal
          title={"Choose a wallet"}
          onClose={() => setShowSelectWalletModal(false)}
        >
          <SelectWallet
            deps={deps}
            closeModal={() => setShowSelectWalletModal(false)}
          />
        </Modal>
      )}
      {showDisclaimerModal && (
        <DisclaimerModal
          closeModal={() => setShowDisclaimerModal(false)}
          onAccept={() => {
            saveAcceptedDisclaimer();
            setShowDisclaimerModal(false);
            // continue to select wallet: assumes that the disclaimer here is (only) shown when clicking on connect wallet
            setShowSelectWalletModal(true);
          }}
        />
      )}
    </div>
  );
};

const myAddressView = (deps, daoId) => {
  if (deps.myAddress !== "") {
    return (
      <div id="user_data">
        <div className="my_address">
          <div>
            <CopyPasteHtml
              element={
                <a
                  href={
                    "https://testnet.algoexplorer.io/address/" + deps.myAddress
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="grey-190"
                >
                  {deps.myAddressDisplay}
                </a>
              }
              copyText={deps.myAddress}
              statusMsg={deps.statusMsg}
              copyMsg={"Address copied to clipboard"}
            />
          </div>
          <div id="my_account_my_balance__balance">
            <img className="mr-10 s-16" src={funds.src} alt="funds" />
            <div>{deps.myBalance.balance_funds_asset}</div>
            <img
              className="arrow"
              src={arrow.src}
              alt="arrow"
              onClick={async () => await disconnect(deps)}
            />
          </div>
        </div>
        {daoId && <DividendSection deps={deps} daoId={daoId} />}
      </div>
    );
  } else {
    return null;
  }
};

const DividendSection = ({ deps, daoId }) => {
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function nestedAsync() {
      if (deps.myAddress) {
        await deps.updateInvestmentData.call(null, daoId, deps.myAddress);
      }
    }
    nestedAsync();
  }, [deps.statusMsg, deps.myAddress, daoId, deps.updateInvestmentData]);

  if (deps.myDividend) {
    return (
      <div className="d-flex flex-column">
        <div className="mb-32 desc d-flex align-center justify-between">
          {"Claimable dividend: "}
          <div className="d-flex align-center gap-10 mr-26">
            <img className="s-16" src={funds.src} alt="funds" />
            {deps.myDividend}
          </div>
        </div>
        <div className="d-flex justify-center w-100">
          <SubmitButton
            label={"Claim"}
            className="button-primary w-100"
            isLoading={submitting}
            disabled={deps.investmentData?.investor_claimable_dividend === "0"}
            onClick={async () => {
              if (!deps.wasm) {
                // ignoring this seems reasonable, wasm file should be normally loaded before user can interact
                console.error("Click before wasm is ready: ignored");
                return;
              }
              await retrieveProfits(
                deps.wasm,
                deps.myAddress,
                setSubmitting,
                deps.statusMsg,
                deps.updateMyBalance,
                daoId,
                deps.updateInvestmentData,
                deps.updateFunds,
                deps.updateMyDividend,
                deps.wallet
              );
            }}
          />
        </div>
      </div>
    );
  } else if (daoId) {
    // we're on a dao page: waiting for dividend to be fetched
    return <Progress />;
  } else {
    return null;
  }
};

const connectButton = (
  deps,
  setShowSelectWalletModal,
  setShowDisclaimerModal
) => {
  if (deps.myAddress === "") {
    return (
      <button
        className="button-primary w-100"
        onClick={async (event) => {
          if (await needsToAcceptDisclaimer()) {
            setShowDisclaimerModal(true);
          } else {
            setShowSelectWalletModal(true);
          }
        }}
      >
        {"Connect wallet"}
      </button>
    );
  } else {
    return null;
  }
};

const disconnect = async (deps) => {
  try {
    await deps.wallet.disconnect();
    deps.setMyAddress("");
  } catch (e) {
    deps.statusMsg.error(e);
  }
};
