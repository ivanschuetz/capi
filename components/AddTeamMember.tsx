import { useState } from "react"
import { Deps } from "../context/AppContext"
import { showError, toBytes } from "../functions/utils"
import { toValidationErrorMsg } from "../functions/validation"
import { useDaoId } from "../hooks/useDaoId"
import { toMaybeIpfsUrl } from "../ipfs/store"
import { SetAnyArr, SetBool, SetString } from "../type_alias"
import { LabeledInput, LabeledTextArea } from "./labeled_inputs"
import { SubmitButton } from "./SubmitButton"
import styles from "./add_team_member.module.sass"

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
  const [picture, setPicture] = useState(prefillData.picture)
  const [social, setSocial] = useState(prefillData.social)

  const [submitting, setSubmitting] = useState(false)

  const [nameError, setNameError] = useState("")
  const [roleError, setRoleError] = useState("")
  const [descrError, setDescrError] = useState("")
  const [pictureError, setPictureError] = useState("")
  const [socialError, setSocialError] = useState("")

  const ContentView = () => {
    return (
      <div className={styles.add_team_member}>
        <LabeledInput
          label={"Name"}
          inputValue={name}
          onChange={(input) => setName(input)}
          maxLength={40} // NOTE: has to match WASM
          errorMsg={nameError}
        />
        <LabeledInput
          label={"Role"}
          inputValue={role}
          onChange={(input) => setRole(input)}
          maxLength={40} // NOTE: has to match WASM
          errorMsg={roleError}
        />
        <LabeledTextArea
          label={"Description"}
          inputValue={descr}
          onChange={(input) => setDescr(input)}
          maxLength={2000} // NOTE: has to match WASM
          errorMsg={descrError}
        />
        <LabeledInput
          label={"Picture"}
          inputValue={picture}
          onChange={(input) => setPicture(input)}
          maxLength={100}
          errorMsg={pictureError}
        />
        <LabeledInput
          label={"Social"}
          inputValue={social}
          onChange={(input) => setSocial(input)}
          maxLength={40} // NOTE: has to match WASM
          errorMsg={socialError}
        />

        <SubmitButton
          label={"Submit"}
          isLoading={submitting}
          className="button-primary w-100"
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
              picture,
              social,
              team,
              setTeam,

              setNameError,
              setRoleError,
              setDescrError,
              setPictureError,
              setSocialError
            )

            onAdded()
          }}
        />
      </div>
    )
  }

  if (deps.myAddress) {
    return <ContentView />
  } else {
    return null
  }
}

export const addTeamMember = async (
  deps: Deps,

  showProgress: SetBool,

  daoId: string,
  myAddress: string,

  name: string,
  role: string,
  descr: string,
  picture: string,
  social_link: string,
  team: any[],
  setTeam: SetAnyArr,

  setNameError: SetString,
  setRoleError: SetString,
  setDescrError: SetString,
  setPictureError: SetString,
  setSocialError: SetString
) => {
  try {
    showProgress(true)
    // update json + possible validations in wasm
    let addMemberRes = await deps.wasm.addTeamMember({
      inputs: {
        name,
        role,
        descr,
        picture,
        social_links: [social_link],
      },
      existing_members: team,
    })
    console.log("addMemberRes: " + JSON.stringify(addMemberRes))

    // save json to ipfs (ideally we'd do this in wasm too, but web3 sdk is js)
    const teamUrl = await toMaybeIpfsUrl(toBytes(await addMemberRes.to_save))

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
  } catch (e) {
    if (e.type_identifier === "input_errors") {
      setNameError(toValidationErrorMsg(e.name))
      setDescrError(toValidationErrorMsg(e.description))
      setRoleError(toValidationErrorMsg(e.share_supply))
      setPictureError(toValidationErrorMsg(e.share_price))
      setSocialError(toValidationErrorMsg(e.investors_share))

      // show a general message additionally, just in case
      deps.notification.error("Please fix the errors")
    } else {
      showError(deps.notification, e)
    }

    showProgress(false)
  }
}

type AddTeamMemberPars = {
  deps: Deps
  prefillData: any
  team: any[]
  setTeam: SetAnyArr
  onAdded: () => void
}
