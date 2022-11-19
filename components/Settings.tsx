import React, { useState } from "react"
import { SubmitButton } from "./SubmitButton"
import { ContentTitle } from "./ContentTitle"
import { updateApp } from "../controller/update_app"
import { UpdateDaoData } from "./UpdateDaoData"
import { useDaoId } from "../hooks/useDaoId"

export const Settings = ({ deps }) => {
  const daoId = useDaoId()

  return (
    <div>
      <div>
        <ContentTitle title={"Project settings"} />
        {deps.myAddress && (
          <div>
            <AppVersionView deps={deps} daoId={daoId} />
            <UpdateDaoData deps={deps} />
          </div>
        )}
      </div>
    </div>
  )
}

const AppVersionView = ({ deps, daoId }) => {
  return (
    deps.daoVersion && (
      <div className="section_large_bottom">
        <div>
          {"Current version: " +
            appVersionStr(
              deps.daoVersion.current_approval_version,
              deps.daoVersion.current_clear_version
            )}
        </div>

        <UpdateAppView deps={deps} daoId={daoId} />
      </div>
    )
  )
}

const UpdateAppView = ({ deps, daoId }) => {
  const [submitting, setSubmitting] = useState(false)

  const updateData = deps.daoVersion.update_data

  if (updateData) {
    return (
      <div id="update-app">
        <div className="d-flex align-center">
          {"There's a new version: " +
            appVersionStr(
              updateData.new_approval_version,
              updateData.new_clear_version
            )}

          <SubmitButton
            label={"Update"}
            className="button-primary ml-30"
            isLoading={submitting}
            onClick={async () => {
              await updateApp(
                deps.statusMsg,
                deps.myAddress,
                deps.wallet,

                setSubmitting,
                daoId,
                deps.daoVersion.update_data.new_approval_version,
                deps.daoVersion.update_data.new_clear_version,
                deps.updateDaoVersion
              )
            }}
          />
        </div>
      </div>
    )
  } else {
    return <div>{"Your're up to date"}</div>
  }
}

const appVersionStr = (approvalVersion, clearVersion) => {
  // For visual purposes, the "app version" contains both the approval and clear version
  // not important (for now?) that the user doesn't know what this means.
  return approvalVersion + "-" + clearVersion
}
