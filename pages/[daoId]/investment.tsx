import { useContext } from "react"
import { DaoContainer } from "../../components/DaoContainer"
import { Investment } from "../../components/Investment"
import { AppContext } from "../../context/AppContext"

const InvestmentPage = () => {
  const { deps } = useContext(AppContext)

  return <DaoContainer nested={<Investment deps={deps} />} />
}

export default InvestmentPage
