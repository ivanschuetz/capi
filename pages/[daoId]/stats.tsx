import React, { useContext, useEffect } from "react"
import { useDaoId } from "../../hooks/useDaoId"
import { SharesDistributionBox } from "../../components/SharesDistributionBox"
import { IncomeSpendingBox } from "../../components/IncomeSpendingBox"
import { AppContext } from "../../context/AppContext"
import { DaoContainer } from "../../components/DaoContainer"

const StatsPage = () => {
  const { deps } = useContext(AppContext)

  const daoId = useDaoId()

  useEffect(() => {
    deps.updateDao.call(null, daoId)
  }, [deps.updateDao, daoId])

  return (
    <DaoContainer
      nested={
        <div>
          {deps.dao && <SharesDistributionBox deps={deps} />}

          <IncomeSpendingBox notification={deps.notification} daoId={daoId} />
        </div>
      }
    ></DaoContainer>
  )
}

export default StatsPage
