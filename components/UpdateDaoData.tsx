import React, { useEffect, useState } from "react"
import { FrError, ProspectusJs, ValidateUpateDataInputErrors } from "wasm/wasm"
import { Deps } from "../context/AppContext"
import {
  isUpdateDaoDataValidationsError,
  toDefaultErrorMsg,
} from "../functions/errors"
import { safe, showError, toBytes, toBytesForRust } from "../functions/utils"
import { toValidationErrorMsg } from "../functions/validation"
import { useDaoId } from "../hooks/useDaoId"
import { storeIpfs, toMaybeIpfsUrl } from "../ipfs/store"
import { OkCancelModal } from "../modal/OkCancelModal"
import { ProspectusModal } from "../prospectus/ProspectusModal"
import { SetBool, SetString } from "../type_alias"
import { FileUploader } from "./FileUploader"
import { ImageUpload } from "./ImageUpload"
import {
  LabeledAmountInput,
  LabeledInput,
  LabeledTextArea,
  ValidationMsg,
} from "./labeled_inputs"
import { SubmitButton } from "./SubmitButton"

export const UpdateDaoData = ({ deps }: { deps: Deps }) => {
  const daoId = useDaoId()

  const [daoName, setDaoName] = useState("")
  const [daoDescr, setDaoDescr] = useState("")
  const [sharePrice, setSharePrice] = useState("")
  const [imageBytes, setImageBytes] = useState(null)
  const [socialMediaUrl, setSocialMediaUrl] = useState("")
  const [minInvestShares, setMinInvestShares] = useState("")
  const [maxInvestShares, setMaxInvestShares] = useState("")

  // prefill-only (new url and hash are only generated when submitting and not set here), thus prefill prefix
  const [prefillProspectus, setPrefillProspectus] =
    useState<ProspectusJs | null>(null)
  // the bytes of prospectus uploaded - note that this is *not
  const [prospectusBytes, setProspectusBytes] = useState(null)

  const [rekeyAuthAddress, setRekeyAuthAddress] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const [errors, setErrors] = useState<UpdateDataErrorsMessages>({})

  const [rekeyAddressError, setRekeyAddressError] = useState("")

  const [showConfirmRekeyModal, setShowConfirmRekeyModal] = useState(false)
  const [showProspectusModal, setShowProspectusModal] = useState(false)

  prefill(
    deps,
    daoId,
    setDaoName,
    setDaoDescr,
    setSharePrice,
    setImageBytes,
    setSocialMediaUrl,
    setMinInvestShares,
    setMaxInvestShares,
    setPrefillProspectus
  )

  const body = () => {
    return (
      <div className="update-dao-data">
        <div className="ft-size-32 ft-weight-700 mt-80 mb-48">
          {"Update project data"}
        </div>
        <div className="info">{"Project Info"}</div>
        <LabeledInput
          label={"Project name"}
          inputValue={daoName}
          onChange={(input) => setDaoName(input)}
          maxLength={40} // NOTE: has to match WASM
          errorMsg={errors.name}
        />
        <LabeledTextArea
          label={"Description"}
          inputValue={daoDescr}
          onChange={(input) => setDaoDescr(input)}
          maxLength={2000} // NOTE: has to match WASM
          errorMsg={errors.description}
        />
        <div className="info">Project Cover</div>
        <ImageUpload
          initImageBytes={imageBytes}
          setImageBytes={setImageBytes}
        />
        <ValidationMsg errorMsg={errors.image_url} />

        {deps.features.prospectus && (
          <React.Fragment>
            <div className="info">Prospectus</div>
            {/* TODO check whether this is supposed to be used - href doesn't work on div */}
            {/* {prefillProspectus && (
              <div
                className="clickable"
                href={prefillProspectus.url}
                onClick={() => setShowProspectusModal(true)}
              >
                {"Current: " + prefillProspectus.hash}
              </div>
            )} */}
            <FileUploader setBytes={setProspectusBytes} />
            <ValidationMsg
              errorMsg={errors.prospectus_bytes ?? errors.prospectus_bytes}
            />
          </React.Fragment>
        )}
        {deps.features.minMaxInvestment && (
          <div className="d-flex mt-40 gap-32">
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
        <LabeledInput
          label={"Primary social media (optional)"}
          inputValue={socialMediaUrl}
          onChange={(input) => setSocialMediaUrl(input)}
          errorMsg={errors.social_media_url}
        />
        <SubmitButton
          label={"Update data"}
          isLoading={submitting}
          onClick={async () => {
            updateDaoData(
              deps,

              setSubmitting,

              daoId,
              daoName,
              daoDescr,
              sharePrice,
              socialMediaUrl,
              minInvestShares,
              maxInvestShares,

              setErrors,

              prefillProspectus,

              imageBytes,
              prospectusBytes
            )
          }}
        />
        <div className="info">{"Ownership"}</div>
        <LabeledInput
          label={"Rekey owner to:"}
          inputValue={rekeyAuthAddress}
          onChange={(input) => setRekeyAuthAddress(input)}
          errorMsg={rekeyAddressError}
        />
        <SubmitButton
          label={"Rekey owner"}
          isLoading={submitting}
          disabled={!rekeyAuthAddress}
          onClick={async () => {
            setShowConfirmRekeyModal(true)
          }}
        />
      </div>
    )
  }

  return (
    <div>
      <div>{body()}</div>
      {showConfirmRekeyModal && (
        <OkCancelModal
          title="WARNING"
          closeModal={() => setShowConfirmRekeyModal(false)}
          okLabel="Continue"
          cancelLabel="Cancel"
          onSubmit={() => {
            rekeyOwner(
              deps,
              setSubmitting,
              daoId,
              rekeyAuthAddress,
              setRekeyAddressError
            )
            setShowConfirmRekeyModal(false)
          }}
        >
          <>
            <div className="line-height-1 mb-32">
              {
                "This will transfer all signing authority to the entered address."
              }
            </div>
            <div className="line-height-1 mb-32">
              {
                "YOUR CURRENT ACCOUNT WILL IRREVERSIBLY BECOME USELESS: IT WILL NOT BE ABLE TO SIGN *ANY* TRANSACTIONS (INCLUDING REVERTING THIS OPERATION)."
              }
            </div>
            <div className="line-height-1 mb-32">
              {
                "THIS IS A UNIVERSAL (BLOCKCHAIN-WIDE) OPERATION, NOT LIMITED TO CAPI."
              }
            </div>
            <div>
              <div className="line-height-1 mb-32">{"Please ensure:"}</div>
              <div className="line-height-1">
                {"1. That the entered address to be rekeyed to is correct."}
              </div>
              <div className="line-height-1 mb-32">
                {
                  "2. That you / the expected account owner(s) of said address actually own it, i.e., can successfully sign and submit transactions with it."
                }
              </div>
              <div className="line-height-1 mb-32">
                {"IF ANY OF THE POINTS ABOVE IS NOT TRUE, " +
                  "YOUR CAPI PROJECT, AS WELL AS ANY FUNDS, ASSETS AND APPLICATIONS LINKED TO YOUR CURRENT ADDRESS, RELATED OR NOT RELATED TO CAPI, WILL BE PERMANENTLY AND IRREVERSIBLY LOST."}
              </div>
            </div>
          </>
        </OkCancelModal>
      )}
      {showProspectusModal && (
        <ProspectusModal
          deps={deps}
          closeModal={() => setShowProspectusModal(false)}
        />
      )}
    </div>
  )
}

const prefill = (
  deps: Deps,
  daoId: string,
  setDaoName: SetString,
  setDaoDescr: SetString,
  setSharePrice: SetString,
  setImageBytes: (base64: string) => void,
  setSocialMediaUrl: SetString,
  setMinInvestShares: SetString,
  setMaxInvestShares: SetString,
  setPrefillProspectus: (value: ProspectusJs) => void
) => {
  useEffect(() => {
    async function prefill() {
      if (daoId) {
        await prefillInputs(
          deps,
          daoId,
          setDaoName,
          setDaoDescr,
          setSharePrice,
          setImageBytes,
          setSocialMediaUrl,
          setMinInvestShares,
          setMaxInvestShares,
          setPrefillProspectus
        )
      }
    }
    prefill()
  }, [daoId, deps.notification])
}

const prefillInputs = async (
  deps: Deps,
  daoId: string,
  setDaoName: SetString,
  setDaoDescr: SetString,
  setSharePrice: SetString,
  setImageBytes: (base64: string) => void,
  setSocialMediaUrl: SetString,
  setMinInvestShares: SetString,
  setMaxInvestShares: SetString,
  setProspectus: (value: ProspectusJs) => void
) => {
  safe(deps.notification, async () => {
    // prefill dao inputs
    let updatableData = await deps.wasm.updatableData({ dao_id: daoId })
    setDaoName(updatableData.project_name)
    setDaoDescr(updatableData.project_desc)
    setSharePrice(updatableData.share_price)
    // TODO header may not be needed - test without once everything else works, remove if not needed
    if (updatableData.image_base64) {
      setImageBytes("data:image/png;base64," + updatableData.image_base64)
    } else {
      setImageBytes(null)
    }
    setSocialMediaUrl(updatableData.social_media_url)
    setMinInvestShares(updatableData.min_invest_amount)
    setMaxInvestShares(updatableData.max_invest_amount)
    setProspectus(updatableData.prospectus)
  })
}

const updateDaoData = async (
  deps: Deps,
  showProgress: SetBool,
  daoId: string,
  projectName: string,
  daoDescr: string,
  sharePrice: string,
  socialMediaUrl: string,

  // OR: either bytes (new prospectus) or prospectus (existing prospectus) is set

  minInvestShares: string,
  maxInvestShares: string,

  setValidationErrors: (errors: UpdateDataErrorsMessages) => void,

  existingProspectus?: ProspectusJs,
  imageBytes?: ArrayBuffer,
  prospectusBytes?: ArrayBuffer
) => {
  try {
    showProgress(true)

    const imageUrl = await toMaybeIpfsUrl(await imageBytes)
    const descrUrl = await toMaybeIpfsUrl(toBytes(await daoDescr))

    const prospectusInputs = await toProspectusInputs(
      existingProspectus,
      prospectusBytes
    )

    const data = {
      dao_id: daoId,

      project_name: projectName,
      project_desc_url: descrUrl,
      share_price: sharePrice,

      owner: deps.myAddress,

      image_url: imageUrl,
      social_media_url: socialMediaUrl,

      prospectus_url: prospectusInputs?.url,
      prospectus_bytes: prospectusInputs?.bytes,
      prospectus_hash: prospectusInputs?.hash,

      min_invest_amount: minInvestShares,
      max_invest_amount: maxInvestShares,
    }
    // console.log("Will send update data to wasm: %o", data);

    let updateDataRes = await deps.wasm.updateData(data)
    console.log("Update DAO data res: %o", updateDataRes)
    showProgress(false)

    let updateDataResSigned = await deps.wallet.signTxs(updateDataRes.to_sign)
    console.log("updateDataResSigned: " + JSON.stringify(updateDataResSigned))

    showProgress(true)
    let submitUpdateDaoDataRes = await deps.wasm.submitUpdateDaoData({
      txs: updateDataResSigned,
      pt: updateDataRes.pt, // passthrough
    })
    console.log(
      "submitUpdateDaoDataRes: " + JSON.stringify(submitUpdateDaoDataRes)
    )

    await deps.updateDao(daoId)

    deps.notification.success("Dao data updated!")

    showProgress(false)
  } catch (eAny) {
    const e: FrError = eAny

    if (isUpdateDaoDataValidationsError(e)) {
      const validations = e.updateDaoDataValidations

      setValidationErrors(localizeErrors(validations))

      deps.notification.error("Please fix the errors")
    } else {
      deps.notification.error(toDefaultErrorMsg(e))
    }

    showProgress(false)
  }
}

// map error payloads to localized messages
const localizeErrors = (
  errors: ValidateUpateDataInputErrors
): UpdateDataErrorsMessages => {
  return {
    name: toValidationErrorMsg(errors.name),
    description: toValidationErrorMsg(errors.description),
    image_url: toValidationErrorMsg(errors.image_url),
    social_media_url: toValidationErrorMsg(errors.social_media_url),
    min_invest_shares: toValidationErrorMsg(errors.min_invest_shares),
    max_invest_shares: toValidationErrorMsg(errors.max_invest_shares),
    prospectus_url: toValidationErrorMsg(errors.prospectus_url),
    prospectus_bytes: toValidationErrorMsg(errors.prospectus_bytes),
  }
}

export type UpdateDataErrorsMessages = Partial<{
  [K in keyof ValidateUpateDataInputErrors]: string
}>

const toProspectusInputs = async (
  existingProspectus?: ProspectusJs,
  prospectusBytes?: ArrayBuffer
): Promise<ProspectusInputs> => {
  // new prospectus: generate the IPFS url and return corresponding data
  // note that the bytes are returned too, to generate a hash in rust
  // the IPFS CID is not easily reproducible, so we manage a separate hash
  if (prospectusBytes && prospectusBytes.byteLength > 0) {
    const prospectusUrl = await storeIpfs(prospectusBytes)
    const prospectusBytesForRust = toBytesForRust(prospectusBytes)

    return { url: prospectusUrl, bytes: prospectusBytesForRust, hash: null }
    // no new prospectus data: return the existing prospectus
  } else if (existingProspectus) {
    return {
      url: existingProspectus.url,
      bytes: null,
      hash: existingProspectus.hash,
    }
  } else {
    // no new or pre-existing prospectus data (the prospectus is optional)
    return null
  }
}

type ProspectusInputs = {
  url: string
  bytes?: number[]
  hash?: string
}

const rekeyOwner = async (
  deps: Deps,
  showProgress: SetBool,
  daoId: string,
  authAddress: string,
  setInputError: SetString
) => {
  try {
    showProgress(true)
    let rekeyRes = await deps.wasm.rekeyOwner({
      dao_id: daoId,
      auth_address: authAddress,
    })
    console.log("rekeyRes: %o", rekeyRes)
    showProgress(false)

    let rekeySigned = await deps.wallet.signTxs(rekeyRes.to_sign)
    console.log("rekeySigned: " + JSON.stringify(rekeySigned))

    showProgress(true)
    let submitRekeyRes = await deps.wasm.submitRekeyOwner({
      txs: rekeySigned,
    })
    console.log("submitRekeyRes: " + JSON.stringify(submitRekeyRes))

    deps.notification.success(
      "Owner rekeyed to: " +
        authAddress +
        ". Please login with this account to be able to sign transactions."
    )
    showProgress(false)
  } catch (e) {
    if (e.id === "validation") {
      console.error("%o", e)
      setInputError(toValidationErrorMsg(e.details))
    } else {
      showError(deps.notification, e)
    }
    showProgress(false)
  }
}
