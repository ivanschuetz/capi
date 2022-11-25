import { useContext } from "react"
import { DaoContainer } from "../../components/DaoContainer"
import { Withdraw } from "../../components/Withdraw"
import { AppContext } from "../../context/AppContext"

const WithdrawPage = () => {
  const { deps } = useContext(AppContext)

  return <DaoContainer nested={<Withdraw deps={deps} />} />
}

export default WithdrawPage
