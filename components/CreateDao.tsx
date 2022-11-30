import moment, { Moment } from "moment"
import { NextRouter, useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { BuyAlgosModal } from "../buy_currency/BuyAlgosModal"
import link from "../images/svg/link.svg"
import { SelectWalletModal } from "../wallet/SelectWalletModal"
import { ContentTitle } from "./ContentTitle"
import { ImageUpload } from "./ImageUpload"
import {
  LabeledAmountInput,
  LabeledCurrencyInput,
  LabeledDateInput,
  LabeledInput,
  LabeledTextArea,
  ValidationMsg,
} from "./labeled_inputs"
import { SubmitButton } from "./SubmitButton"

import { Deps, Wasm } from "../context/AppContext"
import { toBytes, toBytesForRust } from "../functions/utils"
import { toValidationErrorMsg } from "../functions/validation"
import { toMaybeIpfsUrl } from "../ipfs/store"
import { SetBool, SetString, SetStringOpt } from "../type_alias"
import { Wallet } from "../wallet/Wallet"
import { FileUploader } from "./FileUploader"
import { MaxFundingTargetLabel } from "./MaxFundingTargetLabel"
import { Notification } from "./Notification"

export const CreateDao = ({ deps }: { deps: Deps }) => {
  const [daoName, setDaoName] = useState("My project")
  const [daoDescr, setDaoDescr] = useState("Lorem ipsum dolor sit amet")
  const [shareCount, setShareCount] = useState("100")
  const [sharePrice, setSharePrice] = useState("10")
  const [investorsShare, setInvestorsShare] = useState("40")
  const [sharesForInvestors, setSharesForInvestors] = useState("100")
  const [minInvestShares, setMinInvestShares] = useState("3")
  const [maxInvestShares, setMaxInvestShares] = useState("10")
  const [imageBytes, setImageBytes] = useState(null)
  const [socialMediaUrl, setSocialMediaUrl] = useState(
    "https://twitter.com/doesnotexist"
  )

  const [minRaiseTarget, setMinRaiseTarget] = useState("100")
  const [minRaiseTargetEndDate, setMinRaiseTargetEndDate] = useState(
    moment(new Date()).add(1, "M")
  )
  const [prospectusBytes, setProspectusBytes] = useState(null)

  const [errors, setErrors] = useState<CreateValidationErrors>({})

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
          socialMediaUrl,
          minRaiseTarget,
          minRaiseTargetEndDate,
          minInvestShares,
          maxInvestShares,

          router,

          setErrors,

          imageBytes,
          prospectusBytes
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
          errorMsg={errors.name}
          maxLength={40} // NOTE: has to match WASM
        />
        <LabeledTextArea
          label={"Description"}
          inputValue={daoDescr}
          onChange={(input) => setDaoDescr(input)}
          errorMsg={errors.description}
          maxLength={2000} // NOTE: has to match WASM
        />
        <LabeledInput
          label={"Primary social media (optional)"}
          inputValue={socialMediaUrl}
          img={link}
          onChange={(input) => setSocialMediaUrl(input)}
          errorMsg={errors.social_media_url}
        />
        <div className="dao-title mt-60">Project Cover</div>
        <ImageUpload setImageBytes={setImageBytes} />
        <ValidationMsg errorMsg={errors.image_url ?? errors.logo_url} />

        {deps.features.prospectus && (
          <React.Fragment>
            <div className="dao-title mt-60">Prospectus</div>
            <FileUploader setBytes={setProspectusBytes} />
            <ValidationMsg
              errorMsg={errors.prospectus_bytes ?? errors.prospectus_bytes}
            />
          </React.Fragment>
        )}

        <div className="dao-title mt-60">Project Funds</div>
        <LabeledAmountInput
          label={"Share supply"}
          inputValue={shareCount}
          onChange={(input) => {
            setShareCount(input)
          }}
          errorMsg={errors.share_supply}
        />

        <LabeledAmountInput
          label={"Investor's %"}
          info={"Percentage of project income directed to investors."}
          inputValue={investorsShare}
          onChange={(input) => setInvestorsShare(input)}
          errorMsg={errors.investors_share}
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
              errorMsg={errors.shares_for_investors}
            />
          </div>
          <div className="f-basis-50">
            <LabeledCurrencyInput
              label={"Share price (unit)"}
              inputValue={sharePrice}
              onChange={(input) => {
                setSharePrice(input)
              }}
              errorMsg={errors.share_price}
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
                errorMsg={errors.min_invest_shares}
              />
            </div>
            <div className="f-basis-50">
              <LabeledAmountInput
                label={"Max investment (shares)"}
                info={"Maximum total amount of shares an investor can buy"}
                inputValue={maxInvestShares}
                onChange={(input) => setMaxInvestShares(input)}
                errorMsg={errors.max_invest_shares}
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
              errorMsg={errors.min_raise_target}
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
          errorMsg={errors.min_raise_target_end_date}
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
  myAddress: string,
  wallet: Wallet,
  updateMyBalance: (myAddress: string) => void,

  showProgress: SetBool,

  daoName: string,
  daoDescr: string,
  shareCount: string,
  sharePrice: string,
  investorsShare: string,
  sharesForInvestors: string,
  socialMediaUrl: string,
  minRaiseTarget: string,
  minRaiseTargetEndDate: Moment,
  minInvestShares: string,
  maxInvestShares: string,

  router: NextRouter,

  setValidationErrors: (errors: CreateValidationErrors) => void,

  setShowBuyCurrencyInfoModal: (value: boolean) => void,

  imageBytes?: ArrayBuffer,
  prospectusBytes?: ArrayBuffer
) => {
  showProgress(true)

  const imageUrl = await toMaybeIpfsUrl(imageBytes)
  const descrUrl = await toMaybeIpfsUrl(toBytes(daoDescr))

  const prospectusUrl = await toMaybeIpfsUrl(prospectusBytes)
  const prospectusBytesForRust = toBytesForRust(prospectusBytes)

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
  } catch (eAny) {
    const e: CreateError = eAny

    if (e.id === "validations") {
      let validationErrors = e.details

      setValidationErrors(localizeErrors(validationErrors))

      // workaround: the inline errors for these are not functional yet, so show as notification
      showErrorNotificationIfError(
        notification,
        toValidationErrorMsg(e.details?.image_url)
      )
      showErrorNotificationIfError(
        notification,
        toValidationErrorMsg(e.details?.prospectus_url)
      )
      showErrorNotificationIfError(
        notification,
        toValidationErrorMsg(e.details?.prospectus_bytes)
      )

      // show a general message additionally, just in case
      notification.error("Please fix the errors")
    } else if (e.id === "not_enough_algos") {
      setShowBuyCurrencyInfoModal(true)
    } else {
      console.error(eAny)
      notification.error(eAny.toString())
    }

    showProgress(false)
  }
}

// map error payloads to localized messages
const localizeErrors = (
  errors: CreateValidationErrors
): CreateValidationErrors => {
  // for convenience, we overwrite the fields in the same struct
  errors.name = toValidationErrorMsg(errors.name)
  errors.description = toValidationErrorMsg(errors.description)
  errors.share_supply = toValidationErrorMsg(errors.share_supply)
  errors.share_price = toValidationErrorMsg(errors.share_price)
  errors.investors_share = toValidationErrorMsg(errors.investors_share)
  errors.logo_url = toValidationErrorMsg(errors.logo_url)
  errors.social_media_url = toValidationErrorMsg(errors.social_media_url)
  errors.min_raise_target = toValidationErrorMsg(errors.min_raise_target)
  errors.min_raise_target_end_date = toValidationErrorMsg(
    errors.min_raise_target_end_date
  )
  errors.min_invest_shares = toValidationErrorMsg(errors.min_invest_shares)
  errors.max_invest_shares = toValidationErrorMsg(errors.max_invest_shares)
  errors.shares_for_investors = toValidationErrorMsg(
    errors.shares_for_investors
  )
  errors.image_url = toValidationErrorMsg(errors.image_url)
  errors.prospectus_url = toValidationErrorMsg(errors.prospectus_url)
  errors.prospectus_bytes = toValidationErrorMsg(errors.prospectus_bytes)

  return errors
}

const showErrorNotificationIfError = (
  notification: Notification,
  payload: any
) => {
  const errorMsg = toValidationErrorMsg(payload)
  if (errorMsg) {
    notification.error(errorMsg)
  }
}

const calculateTotalPrice = async (
  wasm: Wasm,
  shareAmount: string,
  sharePrice: string,
  setTotalPrice: SetString
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

type CreateError = {
  id?: string
  details?: CreateValidationErrors
}

type CreateValidationErrors = {
  name?: any
  description?: any
  share_supply?: any
  share_price?: any
  investors_share?: any
  logo_url?: any
  social_media_url?: any
  min_raise_target?: any
  min_raise_target_end_date?: any
  min_invest_shares?: any
  max_invest_shares?: any
  shares_for_investors?: any
  image_url?: any
  prospectus_url?: any
  prospectus_bytes?: any
}
