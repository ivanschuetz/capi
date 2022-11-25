import { useContext } from "react"
import { DaoContainer } from "../../components/DaoContainer"
import { Team } from "../../components/Team"
import { AppContext } from "../../context/AppContext"

const TeamPage = () => {
  const { deps } = useContext(AppContext)

  return <DaoContainer nested={<Team deps={deps} />} />
}

export default TeamPage
