import React, { useEffect, useState } from "react"
import { SubmitButton } from "./SubmitButton"
import {
  LabeledAmountInput,
  LabeledInput,
  LabeledTextArea,
  ValidationMsg,
} from "./labeled_inputs"
import {
  prefillInputs,
  rekeyOwner,
  updateDaoData,
} from "../controller/update_app"
import { ImageUpload } from "./ImageUpload"
import { OkCancelModal } from "../modal/OkCancelModal"
import { FileUploader } from "./FileUploader"
import { ProspectusModal } from "../prospectus/ProspectusModal"
import { useDaoId } from "../hooks/useDaoId"

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
              deps.statusMsg,
              deps.myAddress,
              deps.wallet,
              deps.updateDao,

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
              deps.statusMsg,
              deps.wallet,

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
) => {
  useEffect(() => {
    async function prefill() {
      if (daoId) {
        await prefillInputs(
          deps.statusMsg,

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
  }, [daoId, deps.statusMsg])
}
