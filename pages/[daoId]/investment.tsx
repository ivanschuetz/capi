import React, { useContext } from "react"
import { Investment } from "../../components/Investment"
import { AppContext } from "../../context/App"
import { DaoContainer } from "../../components/DaoContainer"

const InvestmentPage = () => {
  const { deps } = useContext(AppContext)

  return <DaoContainer nested={<Investment deps={deps} />} />
}

export default InvestmentPage
