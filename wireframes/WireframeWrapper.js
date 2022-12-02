import { useContext, useEffect } from "react"
import { AppContext } from "../context/AppContext"
import { useDaoId } from "../hooks/useDaoId"
import { Wireframe } from "./Wireframe"
import { WireframeMobile } from "./WireframeMobile"

export const WireframeWrapper = ({ isGlobal, nested }) => {
  const { deps } = useContext(AppContext)

  const daoId = useDaoId()

  useEffect(() => {
    async function asyncInit() {
      if (daoId) {
        deps.updateDao.call(null, daoId)
        deps.updateDaoVersion.call(null, daoId)
      }
    }
    asyncInit()
  }, [daoId, deps.notification, deps.updateDaoVersion, deps.updateDao])

  return deps.size?.s4 ? (
    <WireframeMobile isGlobal={isGlobal} deps={deps} nested={nested} />
  ) : (
    <Wireframe isGlobal={isGlobal} deps={deps} nested={nested} />
  )
}
