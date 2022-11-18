import React, { useContext } from "react"
import { FundsActivity } from "../../components/FundsActivity"
import { AppContext } from "../../context/App"
import { DaoContainer } from "../../components/DaoContainer"

const FundsActivityPage = () => {
  const { deps } = useContext(AppContext)

  return <DaoContainer nested={<FundsActivity deps={deps} />} />
}

export default FundsActivityPage
