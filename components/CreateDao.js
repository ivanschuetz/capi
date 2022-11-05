import React, { useEffect, useState } from "react";
import {
  LabeledAmountInput,
  LabeledCurrencyInput,
  LabeledInput,
  LabeledTextArea,
  LabeledDateInput,
  ValidationMsg,
} from "./labeled_inputs";
import { ContentTitle } from "./ContentTitle";
import { calculateTotalPrice, createDao } from "../controller/create_dao";
import { ImageUpload } from "./ImageUpload";
import { useRouter } from "next/router";
import { SubmitButton } from "./SubmitButton";
import { SelectWalletModal } from "../wallet/SelectWalletModal";
import { BuyAlgosModal } from "../buy_currency/BuyAlgosModal";
import link from "../images/svg/link.svg";
import moment from "moment";

import { MaxFundingTargetLabel } from "./MaxFundingTargetLabel";
import { FileUploader } from "./FileUploader";

export const CreateDao = ({ deps }) => {
  const [daoName, setDaoName] = useState("My project");
  const [daoDescr, setDaoDescr] = useState("Lorem ipsum dolor sit amet");
  const [shareCount, setShareCount] = useState("100");
  const [sharePrice, setSharePrice] = useState("10");
  const [investorsShare, setInvestorsShare] = useState("40");
  const [sharesForInvestors, setSharesForInvestors] = useState("100");
  const [minInvestShares, setMinInvestShares] = useState("3");
  const [maxInvestShares, setMaxInvestShares] = useState("10");
  const [imageBytes, setImageBytes] = useState([]);
  const [socialMediaUrl, setSocialMediaUrl] = useState(
    "https://twitter.com/doesnotexist"
  );

  const [minRaiseTarget, setMinRaiseTarget] = useState("100");
  const [minRaiseTargetEndDate, setMinRaiseTargetEndDate] = useState(
    moment(new Date()).add(1, "M")
  );
  const [prospectusBytes, setProspectusBytes] = useState([]);

  const [daoNameError, setDaoNameError] = useState("");
  const [daoDescrError, setDaoDescrError] = useState("");
  const [shareCountError, setShareCountError] = useState("");
  const [sharePriceError, setSharePriceError] = useState("");
  const [investorsShareError, setInvestorsShareError] = useState("");
  const [sharesForInvestorsError, setSharesForInvestorsError] = useState("");
  const [minInvestSharesError, setMinInvestSharesError] = useState("");
  const [maxInvestSharesError, setMaxInvestSharesError] = useState("");
  const [socialMediaUrlError, setSocialMediaUrlError] = useState("");
  const [minRaiseTargetError, setMinRaiseTargetError] = useState("");

  const [minRaiseTargetEndDateError, setMinRaiseTargetEndDateError] =
    useState("");

  const [imageError, setImageError] = useState("");
  const [prospectusError, setProspectusError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  const [showBuyCurrencyInfoModal, setShowBuyCurrencyInfoModal] =
    useState(false);
  const [showSelectWalletModal, setShowSelectWalletModal] = useState(false);
  const [pendingSubmitDao, setSubmitDaoIntent] = useState(false);

  const [totalSharePrice, setTotalSharePrice] = useState("");

  useEffect(() => {
    calculateTotalPrice(shareCount, sharePrice, setTotalSharePrice);
  }, [shareCount, sharePrice]);

  useEffect(() => {
    async function nestedAsync() {
      if (deps.wallet && pendingSubmitDao && deps.myAddress) {
        setSubmitDaoIntent(false);

        await createDao(
          deps.statusMsg,
          deps.myAddress,
          deps.wallet,
          deps.updateMyBalance,

          setSubmitting,

          daoName,
          daoDescr,
          shareCount,
          sharePrice,
          investorsShare,
          sharesForInvestors,
          imageBytes,
          socialMediaUrl,
          minRaiseTarget,
          minRaiseTargetEndDate,
          prospectusBytes,
          minInvestShares,
          maxInvestShares,

          router,

          setDaoNameError,
          setDaoDescrError,
          setShareCountError,
          setSharePriceError,
          setInvestorsShareError,
          setSharesForInvestorsError,
          setImageError,
          setProspectusError,
          setSocialMediaUrlError,
          setMinRaiseTargetError,
          setMinRaiseTargetEndDateError,
          setMinInvestSharesError,
          setMaxInvestSharesError,
          setShowBuyCurrencyInfoModal
        );
      }
    }
    nestedAsync();
    // TODO warning about missing deps here - we *don't* want to trigger this effect when inputs change,
    // we want to send whatever is in the form when user submits - so we care only about the conditions that trigger submit
    // suppress lint? are we approaching this incorrectly?
  }, [pendingSubmitDao, deps.wallet, deps.myAddress]);

  const formView = () => {
    return (
      <div className="create-dao-container mb-40">
        <div className="dao-title mt-80">Project Info</div>
        <LabeledInput
          label={"Project name"}
          inputValue={daoName}
          onChange={(input) => setDaoName(input)}
          errorMsg={daoNameError}
          maxLength={40} // NOTE: has to match WASM
        />
        <LabeledTextArea
          label={"Description"}
          inputValue={daoDescr}
          onChange={(input) => setDaoDescr(input)}
          errorMsg={daoDescrError}
          maxLength={2000} // NOTE: has to match WASM
        />
        <LabeledInput
          label={"Primary social media (optional)"}
          inputValue={socialMediaUrl}
          img={link}
          onChange={(input) => setSocialMediaUrl(input)}
          errorMsg={socialMediaUrlError}
        />
        <div className="dao-title mt-60">Project Cover</div>
        <ImageUpload setImageBytes={setImageBytes} />
        <ValidationMsg errorMsg={imageError} />

        {deps.features.prospectus && (
          <React.Fragment>
            <div className="dao-title mt-60">Prospectus</div>
            <FileUploader setBytes={setProspectusBytes} />
            <ValidationMsg errorMsg={prospectusError} />
          </React.Fragment>
        )}

        <div className="dao-title mt-60">Project Funds</div>
        <LabeledAmountInput
          label={"Share supply"}
          inputValue={shareCount}
          onChange={(input) => {
            setShareCount(input);
          }}
          errorMsg={shareCountError}
        />

        <LabeledAmountInput
          label={"Investor's %"}
          info={"Percentage of project income directed to investors."}
          inputValue={investorsShare}
          onChange={(input) => setInvestorsShare(input)}
          errorMsg={investorsShareError}
          placeholder="Investor's part in %"
        />
        <div className="d-flex gap-32">
          <div className="f-basis-50">
            <LabeledAmountInput
              label={"Shares for sale"}
              info={
                "Shares available for sale. Not available shares stay in the creator's wallet."
              }
              inputValue={sharesForInvestors}
              onChange={(input) => setSharesForInvestors(input)}
              errorMsg={sharesForInvestorsError}
            />
          </div>
          <div className="f-basis-50">
            <LabeledCurrencyInput
              label={"Share price (unit)"}
              inputValue={sharePrice}
              onChange={(input) => {
                setSharePrice(input);
              }}
              errorMsg={sharePriceError}
            />
          </div>
        </div>
        {deps.features.minMaxInvestment && (
          <div className="d-flex gap-32">
            <div className="f-basis-50">
              <LabeledAmountInput
                label={"Min investment (shares)"}
                info={"Minimum amount of shares an investor has to buy"}
                inputValue={minInvestShares}
                onChange={(input) => setMinInvestShares(input)}
                errorMsg={minInvestSharesError}
              />
            </div>
            <div className="f-basis-50">
              <LabeledAmountInput
                label={"Max investment (shares)"}
                info={"Maximum total amount of shares an investor can buy"}
                inputValue={maxInvestShares}
                onChange={(input) => setMaxInvestShares(input)}
                errorMsg={maxInvestSharesError}
              />
            </div>
          </div>
        )}
        <div className="d-flex gap-32">
          <div className="f-basis-50">
            <LabeledCurrencyInput
              label={"Min funding target"}
              info={"The minumum amount needed to start the project."}
              inputValue={minRaiseTarget}
              onChange={(input) => setMinRaiseTarget(input)}
              errorMsg={minRaiseTargetError}
            />
          </div>
          <MaxFundingTargetLabel text={totalSharePrice} />
        </div>
        <LabeledDateInput
          label={"Fundraising end date"}
          info={
            "If min. target not reached on this day, project fails and investors can reclaim their funds."
          }
          inputValue={minRaiseTargetEndDate}
          onChange={setMinRaiseTargetEndDate}
          disabled={true}
          errorMsg={minRaiseTargetEndDateError}
        />
        <SubmitButton
          label={"Create project"}
          className={"button-primary"}
          isLoading={submitting}
          disabled={
            daoName === "" ||
            shareCount === "" ||
            sharePrice === "" ||
            investorsShare === ""
          }
          onClick={async () => {
            // signalize that we want to submit the dao
            // if other dependencies are already present (connected wallet / address), an effect will trigger submit
            // if they're not, we start the wallet connection flow next (select wallet modal),
            // which sets these dependencies when finished, which triggers the effect too
            setSubmitDaoIntent(true);
            var myAddress = deps.myAddress;
            if (myAddress === "") {
              setShowSelectWalletModal(true);
            }
          }}
        />
      </div>
    );
  };

  return (
    <div>
      {" "}
      <ContentTitle title="Create project" />
      {formView()}
      {showBuyCurrencyInfoModal && (
        <BuyAlgosModal
          deps={deps}
          closeModal={() => setShowBuyCurrencyInfoModal(false)}
        />
      )}
      {showSelectWalletModal && (
        <SelectWalletModal
          deps={deps}
          setShowModal={setShowSelectWalletModal}
        />
      )}
    </div>
  );
};
