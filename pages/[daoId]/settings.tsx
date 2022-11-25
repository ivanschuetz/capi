import { useContext } from "react"
import { DaoContainer } from "../../components/DaoContainer"
import { Settings } from "../../components/Settings"
import { AppContext } from "../../context/AppContext"

const SettingsPage = () => {
  const { deps } = useContext(AppContext)

  return <DaoContainer nested={<Settings deps={deps} />} />
}

export default SettingsPage
