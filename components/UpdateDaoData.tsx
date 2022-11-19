import React, { useEffect, useState } from "react"
import { SubmitButton } from "./SubmitButton"
import {
  LabeledAmountInput,
  LabeledInput,
  LabeledTextArea,
  ValidationMsg,
} from "./labeled_inputs"
import { ImageUpload } from "./ImageUpload"
import { OkCancelModal } from "../modal/OkCancelModal"
import { FileUploader } from "./FileUploader"
import { ProspectusModal } from "../prospectus/ProspectusModal"
import { useDaoId } from "../hooks/useDaoId"
import { storeIpfs, toMaybeIpfsUrl } from "../ipfs/store"
import { toBytes, toBytesForRust } from "../functions/utils"
import { toErrorMsg } from "../functions/validation"
import { Deps } from "../context/AppContext"

export const UpdateDaoData = ({ deps }) => {
  const daoId = useDaoId()

  const [daoName, setDaoName] = useState("")
  const [daoDescr, setDaoDescr] = useState("")
  const [sharePrice, setSharePrice] = useState("")
  const [imageBytes, setImageBytes] = useState(null)
  const [socialMediaUrl, setSocialMediaUrl] = useState("")
  const [minInvestShares, setMinInvestShares] = useState("")
  const [maxInvestShares, setMaxInvestShares] = useState("")

  // prefill-only (new url and hash are only generated when submitting and not set here), thus prefill prefix
  const [prefillProspectus, setPrefillProspectus] = useState([])
  // the bytes of prospectus uploaded - note that this is *not
  const [prospectusBytes, setProspectusBytes] = useState([])

  const [rekeyAuthAddress, setRekeyAuthAddress] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const [daoNameError, setDaoNameError] = useState("")
  const [daoDescrError, setDaoDescrError] = useState("")
  const [socialMediaUrlError, setSocialMediaUrlError] = useState("")
  const [minInvestSharesError, setMinInvestSharesError] = useState("")
  const [maxInvestSharesError, setMaxInvestSharesError] = useState("")

  const [imageError, setImageError] = useState("")
  const [prospectusError, setProspectusError] = useState("")

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
          errorMsg={daoNameError}
        />
        <LabeledTextArea
          label={"Description"}
          inputValue={daoDescr}
          onChange={(input) => setDaoDescr(input)}
          maxLength={2000} // NOTE: has to match WASM
          errorMsg={daoDescrError}
        />
        <div className="info">Project Cover</div>
        <ImageUpload
          initImageBytes={imageBytes}
          setImageBytes={setImageBytes}
        />
        <ValidationMsg errorMsg={imageError} />

        {deps.features.prospectus && (
          <React.Fragment>
            <div className="info">Prospectus</div>
            {prefillProspectus && (
              <div
                className="clickable"
                href={prefillProspectus.url}
                onClick={() => setShowProspectusModal(true)}
              >
                {"Current: " + prefillProspectus.hash}
              </div>
            )}
            <FileUploader setBytes={setProspectusBytes} />
            <ValidationMsg errorMsg={prospectusError} />
          </React.Fragment>
        )}
        {deps.features.minMaxInvestment && (
          <div className="d-flex gap-32 mt-40">
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
        <LabeledInput
          label={"Primary social media (optional)"}
          inputValue={socialMediaUrl}
          onChange={(input) => setSocialMediaUrl(input)}
          errorMsg={socialMediaUrlError}
        />
        <SubmitButton
          label={"Update data"}
          className="button-primary"
          isLoading={submitting}
          onClick={async () => {
            updateDaoData(
              deps,

              setSubmitting,

              daoId,
              daoName,
              daoDescr,
              sharePrice,
              imageBytes,
              socialMediaUrl,
              prospectusBytes,
              prefillProspectus,
              minInvestShares,
              maxInvestShares,

              setDaoNameError,
              setDaoDescrError,
              setImageError,
              setProspectusError,
              setSocialMediaUrlError,
              setMinInvestSharesError,
              setMaxInvestSharesError
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
          className="button-primary mb-80"
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
          <div className="mb-32 line-height-1">
            {"This will transfer all signing authority to the entered address."}
          </div>
          <div className="mb-32 line-height-1">
            {
              "YOUR CURRENT ACCOUNT WILL IRREVERSIBLY BECOME USELESS: IT WILL NOT BE ABLE TO SIGN *ANY* TRANSACTIONS (INCLUDING REVERTING THIS OPERATION)."
            }
          </div>
          <div className="mb-32 line-height-1">
            {
              "THIS IS A UNIVERSAL (BLOCKCHAIN-WIDE) OPERATION, NOT LIMITED TO CAPI."
            }
          </div>
          <div>
            <div className="mb-32 line-height-1">{"Please ensure:"}</div>
            <div className="line-height-1">
              {"1. That the entered address to be rekeyed to is correct."}
            </div>
            <div className="mb-32 line-height-1">
              {
                "2. That you / the expected account owner(s) of said address actually own it, i.e., can successfully sign and submit transactions with it."
              }
            </div>
            <div className="mb-32 line-height-1">
              {"IF ANY OF THE POINTS ABOVE IS NOT TRUE, " +
                "YOUR CAPI PROJECT, AS WELL AS ANY FUNDS, ASSETS AND APPLICATIONS LINKED TO YOUR CURRENT ADDRESS, RELATED OR NOT RELATED TO CAPI, WILL BE PERMANENTLY AND IRREVERSIBLY LOST."}
            </div>
          </div>
        </OkCancelModal>
      )}
      {showProspectusModal && (
        <ProspectusModal
          url={prefillProspectus.url}
          prospectusHash={prefillProspectus.hash}
          closeModal={() => setShowProspectusModal(false)}
        />
      )}
    </div>
  )
}

const prefill = (
  deps: Deps,
  daoId,
  setDaoName,
  setDaoDescr,
  setSharePrice,
  setImageBytes,
  setSocialMediaUrl,
  setMinInvestShares,
  setMaxInvestShares,
  setPrefillProspectus
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
  daoId,
  setDaoName,
  setDaoDescr,
  setSharePrice,
  setImageBytes,
  setSocialMediaUrl,
  setMinInvestShares,
  setMaxInvestShares,
  setProspectus
) => {
  try {
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
  } catch (e) {
    deps.notification.error(e)
  }
}

const updateDaoData = async (
  deps: Deps,
  showProgress,
  daoId,
  projectName,
  daoDescr,
  sharePrice,
  imageBytes,
  socialMediaUrl,

  // OR: either bytes (new prospectus) or prospectus (existing prospectus) is set
  prospectusBytes,
  existingProspectus,

  minInvestShares,
  maxInvestShares,

  setDaoNameError,
  setDaoDescrError,
  setImageError,
  setProspectusError,
  setSocialMediaUrlError,
  setMinInvestSharesError,
  setMaxInvestSharesError
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
  } catch (e) {
    if (e.id === "validations") {
      let details = e.details
      setDaoNameError(toErrorMsg(details.name))
      setDaoDescrError(toErrorMsg(details.description))
      setImageError(toErrorMsg(details.image))

      // Note that this will make appear the prospectus errors incrementally, if both happen at once (normally not expected)
      // i.e. user has to fix one first and submit, then the other would appear
      if (details.prospectus_url) {
        setProspectusError(toErrorMsg(details.prospectus_url))
      } else if (details.prospectus_bytes) {
        setProspectusError(toErrorMsg(details.prospectus_bytes))
      }

      setSocialMediaUrlError(toErrorMsg(details.social_media_url))
      setMinInvestSharesError(toErrorMsg(details.min_invest_shares))
      setMaxInvestSharesError(toErrorMsg(details.max_invest_shares))

      deps.notification.error("Please fix the errors")
    } else {
      deps.notification.error(e)
    }
    showProgress(false)
  }
}

const toProspectusInputs = async (
  existingProspectus,
  newProspectusBytesPromise
) => {
  const prospectusBytes = await newProspectusBytesPromise

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

const rekeyOwner = async (
  deps: Deps,
  showProgress,
  daoId,
  authAddress,
  setInputError
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
      setInputError(toErrorMsg(e.details))
    } else {
      deps.notification.error(e)
    }
    showProgress(false)
  }
}
