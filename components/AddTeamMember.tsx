import { useState } from "react"
import { LabeledInput, LabeledTextArea } from "./labeled_inputs"
import { SubmitButton } from "./SubmitButton"
import { addTeamMember } from "../controller/team"
import { useDaoId } from "../hooks/useDaoId"

export const AddTeamMember = ({
  deps,
  prefillData,
  team,
  setTeam,
  onAdded,
}) => {
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
      <div>
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
              deps.wasm,

              deps.statusMsg,
              deps.wallet,

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
