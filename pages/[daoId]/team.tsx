import { useContext } from "react"
import { DaoContainer } from "../../components/DaoContainer"
import { Team } from "../../components/Team"
import { AppContext } from "../../context/AppContext"

const TeamPage = () => {
  const { deps } = useContext(AppContext)

  return <Team deps={deps} />
}

export default TeamPage

TeamPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DaoContainer nested={page}></DaoContainer>
}
