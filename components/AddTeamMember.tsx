import { useState } from "react"
import {
  AddTeamMemberInputErrors,
  FrError,
  TeamMemberInputs,
  TeamMemberJs,
} from "wasm/wasm"
import { Deps } from "../context/AppContext"
import { isAddTeamMemberValidationsError } from "../functions/errors"
import { showError, toBytes } from "../functions/utils"
import { toValidationErrorMsg } from "../functions/validation"
import { useDaoId } from "../hooks/useDaoId"
import { storeIpfs, toMaybeIpfsUrl } from "../ipfs/store"
import { SetAnyArr, SetBool } from "../type_alias"
import styles from "./add_team_member.module.sass"
import { CircleImageUpload, ImageUpload } from "./ImageUpload"
import { LabeledInput, LabeledTextArea } from "./labeled_inputs"
import { SubmitButton } from "./SubmitButton"

export const AddTeamMember = ({
  deps,
  prefillData,
  team,
  setTeam,
  onAdded,
}: AddTeamMemberPars) => {
  let daoId = useDaoId()

  const [name, setName] = useState(prefillData.name)
  const [role, setRole] = useState(prefillData.role)
  const [descr, setDescr] = useState(prefillData.descr)
  const [githubUrl, setGithubUrl] = useState(prefillData.github_link)
  const [twitterUrl, setTwitterUrl] = useState(prefillData.twitter_link)
  const [linkedinUrl, setLinkedinUrl] = useState(prefillData.linkedin_link)
  const [imageBytes, setImageBytes] = useState<ArrayBuffer | null>(null)

  const [submitting, setSubmitting] = useState(false)

  const [errors, setErrors] = useState<AddTeamMemberValidationErrorsMessages>(
    {}
  )
  const contentView = () => {
    return (
      <div className={styles.add_team_member}>
        <CircleImageUpload setImageBytes={setImageBytes} />
        <LabeledInput
          label={"Name"}
          inputValue={name}
          onChange={(input) => setName(input)}
          maxLength={40} // NOTE: has to match WASM
          errorMsg={errors.name}
        />
        <LabeledInput
          label={"Role"}
          inputValue={role}
          onChange={(input) => setRole(input)}
          maxLength={40} // NOTE: has to match WASM
          errorMsg={errors.role}
        />
        <LabeledTextArea
          label={"Description"}
          inputValue={descr}
          onChange={(input) => setDescr(input)}
          maxLength={2000} // NOTE: has to match WASM
          errorMsg={errors.descr}
        />
        <LabeledInput
          label={"Github"}
          inputValue={githubUrl}
          onChange={(input) => setGithubUrl(input)}
          maxLength={40} // NOTE: has to match WASM
          errorMsg={errors.github_url}
        />
        <LabeledInput
          label={"Twitter"}
          inputValue={twitterUrl}
          onChange={(input) => setTwitterUrl(input)}
          maxLength={40} // NOTE: has to match WASM
          errorMsg={errors.twitter_url}
        />
        <LabeledInput
          label={"LinkedIn"}
          inputValue={linkedinUrl}
          onChange={(input) => setLinkedinUrl(input)}
          maxLength={40} // NOTE: has to match WASM
          errorMsg={errors.linkedin_url}
        />

        <SubmitButton
          label={"Submit"}
          isLoading={submitting}
          onClick={async () => {
            if (!deps.wasm) {
              // should be unlikely, as wasm should initialize quickly
              console.error("Click while wasm isn't ready. Ignoring.")
              return
            }

            await addTeamMember(
              deps,
              setSubmitting,
              daoId,
              deps.myAddress,
              name,
              role,
              descr,
              imageBytes,
              team,
              setTeam,
              setErrors,
              githubUrl,
              twitterUrl,
              linkedinUrl
            )

            onAdded()
          }}
        />
      </div>
    )
  }

  return deps.myAddress && contentView()
}

export const addTeamMember = async (
  deps: Deps,
  showProgress: SetBool,
  daoId: string,
  myAddress: string,
  name: string,
  role: string,
  descr: string,
  imageBytes: ArrayBuffer,
  team: TeamMemberJs[],
  setTeam: SetAnyArr,
  setValidationErrors: (errors: AddTeamMemberValidationErrorsMessages) => void,
  github_url?: string,
  twitter_url?: string,
  linkedin_url?: string
) => {
  try {
    showProgress(true)

    // save image to ipfs
    const imageUrl = await storeIpfs(imageBytes)

    // update json + possible validations in wasm
    let addMemberRes = await deps.wasm.addTeamMember({
      inputs: {
        name,
        role,
        descr,
        picture: imageUrl,
        github_link: github_url,
        twitter_link: twitter_url,
        linkedin_link: linkedin_url,
      },
      existing_members: team,
    })
    console.log("addMemberRes: " + JSON.stringify(addMemberRes))

    // save json to ipfs (ideally we'd do this in wasm too, but web3 sdk is js)
    const teamUrl = await toMaybeIpfsUrl(toBytes(addMemberRes.to_save))

    // save the ipfs url in dao state
    let setTeamRes = await deps.wasm.setTeam({
      dao_id: daoId,
      owner_address: myAddress,
      url: teamUrl,
    })

    console.log("setTeamRes: " + JSON.stringify(setTeamRes))
    showProgress(false)

    let setTeamResSigned = await deps.wallet.signTxs(setTeamRes.to_sign)
    console.log("withdrawResSigned: " + setTeamResSigned)

    showProgress(true)
    let submitTeamRes = await deps.wasm.submitSetTeam({
      txs: setTeamResSigned,
    })

    console.log("submitTeamRes: " + JSON.stringify(submitTeamRes))

    deps.notification.success("Update team submitted")

    // we wait for the complete process to succeed before showing the updated team
    setTeam(addMemberRes.team)

    showProgress(false)
  } catch (eAny) {
    const e: FrError = eAny

    if (isAddTeamMemberValidationsError(e)) {
      const validations = e.addTeamMemberValidations

      setValidationErrors(localizeErrors(validations))

      deps.notification.error("Please fix the errors")
    } else {
      showError(deps.notification, eAny)
    }

    showProgress(false)
  }
}

type AddTeamMemberPars = {
  deps: Deps
  prefillData: TeamMemberInputs
  team: TeamMemberJs[]
  setTeam: SetAnyArr
  onAdded: () => void
}

// map error payloads to localized messages
const localizeErrors = (
  errors: AddTeamMemberInputErrors
): AddTeamMemberValidationErrorsMessages => {
  return {
    name: toValidationErrorMsg(errors.name),
    descr: toValidationErrorMsg(errors.descr),
    role: toValidationErrorMsg(errors.role),
    picture: toValidationErrorMsg(errors.picture),
    github_url: toValidationErrorMsg(errors.github_url),
    twitter_url: toValidationErrorMsg(errors.twitter_url),
    linkedin_url: toValidationErrorMsg(errors.linkedin_url),
  }
}

export type AddTeamMemberValidationErrorsMessages = Partial<{
  [K in keyof AddTeamMemberInputErrors]: string
}>
