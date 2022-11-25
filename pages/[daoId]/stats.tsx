import { useContext, useEffect } from "react"
import { DaoContainer } from "../../components/DaoContainer"
import { IncomeSpendingBox } from "../../components/IncomeSpendingBox"
import { SharesDistributionBox } from "../../components/SharesDistributionBox"
import { AppContext } from "../../context/AppContext"
import { useDaoId } from "../../hooks/useDaoId"

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
