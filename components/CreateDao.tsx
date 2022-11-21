import React, { useEffect, useState } from "react"
import {
  LabeledAmountInput,
  LabeledCurrencyInput,
  LabeledInput,
  LabeledTextArea,
  LabeledDateInput,
  ValidationMsg,
} from "./labeled_inputs"
import { ContentTitle } from "./ContentTitle"
import { ImageUpload } from "./ImageUpload"
import { useRouter } from "next/router"
import { SubmitButton } from "./SubmitButton"
import { SelectWalletModal } from "../wallet/SelectWalletModal"
import { BuyAlgosModal } from "../buy_currency/BuyAlgosModal"
import link from "../images/svg/link.svg"
import moment from "moment"

import { MaxFundingTargetLabel } from "./MaxFundingTargetLabel"
import { FileUploader } from "./FileUploader"
import { Notification } from "./Notification"
import { toErrorMsg } from "../functions/validation"
import { toMaybeIpfsUrl } from "../ipfs/store"
import { toBytes, toBytesForRust } from "../functions/utils"
import { Wallet } from "../wallet/Wallet"
import { Deps, Wasm } from "../context/AppContext"

export const CreateDao = ({ deps }: { deps: Deps }) => {
  const [daoName, setDaoName] = useState("My project")
  const [daoDescr, setDaoDescr] = useState("Lorem ipsum dolor sit amet")
  const [shareCount, setShareCount] = useState("100")
  const [sharePrice, setSharePrice] = useState("10")
  const [investorsShare, setInvestorsShare] = useState("40")
  const [sharesForInvestors, setSharesForInvestors] = useState("100")
  const [minInvestShares, setMinInvestShares] = useState("3")
  const [maxInvestShares, setMaxInvestShares] = useState("10")
  const [imageBytes, setImageBytes] = useState([])
  const [socialMediaUrl, setSocialMediaUrl] = useState(
    "https://twitter.com/doesnotexist"
  )

  const [minRaiseTarget, setMinRaiseTarget] = useState("100")
  const [minRaiseTargetEndDate, setMinRaiseTargetEndDate] = useState(
    moment(new Date()).add(1, "M")
  )
  const [prospectusBytes, setProspectusBytes] = useState([])

  const [daoNameError, setDaoNameError] = useState("")
  const [daoDescrError, setDaoDescrError] = useState("")
  const [shareCountError, setShareCountError] = useState("")
  const [sharePriceError, setSharePriceError] = useState("")
  const [investorsShareError, setInvestorsShareError] = useState("")
  const [sharesForInvestorsError, setSharesForInvestorsError] = useState("")
  const [minInvestSharesError, setMinInvestSharesError] = useState("")
  const [maxInvestSharesError, setMaxInvestSharesError] = useState("")
  const [socialMediaUrlError, setSocialMediaUrlError] = useState("")
  const [minRaiseTargetError, setMinRaiseTargetError] = useState("")

  const [minRaiseTargetEndDateError, setMinRaiseTargetEndDateError] =
    useState("")

  const [imageError, setImageError] = useState("")
  const [prospectusError, setProspectusError] = useState("")

  const [submitting, setSubmitting] = useState(false)

  const router = useRouter()

  const [showBuyCurrencyInfoModal, setShowBuyCurrencyInfoModal] =
    useState(false)
  const [showSelectWalletModal, setShowSelectWalletModal] = useState(false)
  const [pendingSubmitDao, setSubmitDaoIntent] = useState(false)

  const [totalSharePrice, setTotalSharePrice] = useState("")

  useEffect(() => {
    if (deps.wasm) {
      calculateTotalPrice(deps.wasm, shareCount, sharePrice, setTotalSharePrice)
    }
  }, [deps.wasm, shareCount, sharePrice])

  useEffect(() => {
    async function nestedAsync() {
      if (deps.wallet && pendingSubmitDao && deps.myAddress) {
        setSubmitDaoIntent(false)

        await createDao(
          deps.wasm,
          deps.notification,
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
        )
      }
    }
    nestedAsync()
    // TODO warning about missing deps here - we *don't* want to trigger this effect when inputs change,
    // we want to send whatever is in the form when user submits - so we care only about the conditions that trigger submit
    // suppress lint? are we approaching this incorrectly?
  }, [pendingSubmitDao, deps.wallet, deps.myAddress])

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
            setShareCount(input)
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
                setSharePrice(input)
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
            setSubmitDaoIntent(true)
            var myAddress = deps.myAddress
            if (myAddress === "") {
              setShowSelectWalletModal(true)
            }
          }}
        />
      </div>
    )
  }

  return (
    <div>
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
  )
}

const createDao = async (
  wasm: Wasm,
  notification: Notification,
  myAddress,
  wallet: Wallet,
  updateMyBalance,

  showProgress,

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
) => {
  showProgress(true)

  const imageUrl = await toMaybeIpfsUrl(await imageBytes)
  const descrUrl = await toMaybeIpfsUrl(toBytes(await daoDescr))

  const prospectusBytesResolved = await prospectusBytes
  const prospectusUrl = await toMaybeIpfsUrl(prospectusBytesResolved)
  const prospectusBytesForRust = toBytesForRust(prospectusBytesResolved)

  try {
    let createDaoAssetsRes = await wasm.createDaoAssetsTxs({
      inputs: {
        creator: myAddress,
        dao_name: daoName,
        dao_descr_url: descrUrl,
        share_count: shareCount,
        share_price: sharePrice,
        investors_share: investorsShare,
        shares_for_investors: sharesForInvestors,
        image_url: imageUrl,
        social_media_url: socialMediaUrl,
        min_raise_target: minRaiseTarget,
        min_raise_target_end_date: minRaiseTargetEndDate.unix() + "",
        // min_raise_target_end_date:
        //   Math.ceil(Date.now() / 1000) + 30 /* seconds */ + "", // end date after short delay - for testing
        prospectus_url: prospectusUrl,
        prospectus_bytes: prospectusBytesForRust,
        min_invest_amount: minInvestShares,
        max_invest_amount: maxInvestShares,
      },
    })
    showProgress(false)

    let createAssetSigned = await wallet.signTxs(createDaoAssetsRes.to_sign)
    console.log("createAssetSigned: " + JSON.stringify(createAssetSigned))

    showProgress(true)
    let createDaoRes = await wasm.createDao({
      create_assets_signed_txs: createAssetSigned,
      pt: createDaoAssetsRes.pt,
    })
    console.log("createDaoRes: " + JSON.stringify(createDaoRes))
    showProgress(false)

    let createDaoSigned = await wallet.signTxs(createDaoRes.to_sign)
    console.log("createDaoSigned: " + JSON.stringify(createDaoSigned))

    showProgress(true)
    let submitDaoRes = await wasm.submitCreateDao({
      txs: createDaoSigned,
      pt: createDaoRes.pt, // passthrough
    })
    console.log("submitDaoRes: " + JSON.stringify(submitDaoRes))

    router.push(submitDaoRes.dao.dao_link)

    showProgress(false)
    notification.success("Project created!")

    await updateMyBalance(myAddress)
  } catch (e) {
    if (e.type_identifier === "input_errors") {
      setDaoNameError(toErrorMsg(e.name))
      setDaoDescrError(toErrorMsg(e.description))
      setShareCountError(toErrorMsg(e.share_supply))
      setSharePriceError(toErrorMsg(e.share_price))
      setInvestorsShareError(toErrorMsg(e.investors_share))
      setImageError(toErrorMsg(e.logo_url))
      setSocialMediaUrlError(toErrorMsg(e.social_media_url))
      setMinRaiseTargetError(toErrorMsg(e.min_raise_target))
      setMinRaiseTargetEndDateError(toErrorMsg(e.min_raise_target_end_date))
      setMinInvestSharesError(toErrorMsg(e.min_invest_shares))
      setMaxInvestSharesError(toErrorMsg(e.max_invest_shares))
      setSharesForInvestorsError(toErrorMsg(e.shares_for_investors))

      // note that here, the later will override the former if both are set
      // this is ok - we don't expect any of these to happen, normally,
      // and this is in theory oriented towards being fixable by the user,
      // in which case it can be done incrementally
      // the console in any case logs all the errors simultaneously

      setImageError(toErrorMsg(e.image_url))
      // Note that this will make appear the prospectus errors incrementally, if both happen at once (normally not expected)
      // i.e. user has to fix one first and submit, then the other would appear
      if (e.prospectus_url) {
        setProspectusError(toErrorMsg(e.prospectus_url))
      } else if (e.prospectus_bytes) {
        setProspectusError(toErrorMsg(e.prospectus_bytes))
      }

      // workaround: the inline errors for these are not functional yet, so show as notification
      showErrorNotificationIfError(notification, e.image_url)
      showErrorNotificationIfError(notification, e.prospectus_url)
      showErrorNotificationIfError(notification, e.prospectus_bytes)

      // show a general message additionally, just in case
      notification.error({ message: "Please fix the errors" })
    } else if (e.id === "not_enough_algos") {
      setShowBuyCurrencyInfoModal(true)
    } else {
      notification.error(e)
    }

    showProgress(false)
  }
}

const showErrorNotificationIfError = (notification: Notification, payload) => {
  const errorMsg = toErrorMsg(payload)
  if (errorMsg) {
    notification.error({ message: errorMsg })
  }
}

const calculateTotalPrice = async (
  wasm,
  shareAmount,
  sharePrice,
  setTotalPrice
) => {
  if (!shareAmount || !sharePrice) {
    return
  }

  try {
    let res = await wasm.calculateMaxFunds({
      shares_amount: shareAmount,
      share_price: sharePrice,
    })
    console.log("res: %o", res)

    setTotalPrice(res.total_price)
  } catch (e) {
    // errors for now ignored: this is calculated on the fly to show the result in the form
    // we currently don't show any validation errors before submitting
    console.error("Ignored: error calculating total price: %o", e)
    setTotalPrice("")
  }
}
