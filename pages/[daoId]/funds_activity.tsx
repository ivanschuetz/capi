import { useContext } from "react"
import { DaoContainer } from "../../components/DaoContainer"
import { FundsActivity } from "../../components/FundsActivity"
import { AppContext } from "../../context/AppContext"

const FundsActivityPage = () => {
  const { deps } = useContext(AppContext)

  return <DaoContainer nested={<FundsActivity deps={deps} />} />
}

export default FundsActivityPage
