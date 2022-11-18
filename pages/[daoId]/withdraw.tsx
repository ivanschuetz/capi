import React, { useContext } from "react"
import { Withdraw } from "../../components/Withdraw"
import { AppContext } from "../../context/AppContext"
import { DaoContainer } from "../../components/DaoContainer"

const WithdrawPage = () => {
  const { deps } = useContext(AppContext)

  return <DaoContainer nested={<Withdraw deps={deps} />} />
}

export default WithdrawPage
