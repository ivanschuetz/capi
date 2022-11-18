import React, { useContext } from "react"
import { Settings } from "../../components/Settings"
import { AppContext } from "../../context/AppContext"
import { DaoContainer } from "../../components/DaoContainer"

const SettingsPage = () => {
  const { deps } = useContext(AppContext)

  return <DaoContainer nested={<Settings deps={deps} />} />
}

export default SettingsPage
