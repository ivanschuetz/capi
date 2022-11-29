import { useEffect } from "react"
import { MyAccount } from "../components/MyAccount"
import { useDaoId } from "../hooks/useDaoId"

export const MobileWalletView = ({ deps, containerClass }) => {
  const daoId = useDaoId()

  useEffect(() => {
    async function asyncFn() {
      await deps.updateMyShares.call(null, daoId, deps.myAddress)
    }
    if (daoId && deps.myAddress) {
      asyncFn()
    }
  }, [daoId, deps.myAddress, deps.updateMyShares])

  useEffect(() => {
    async function asyncFn() {
      deps.updateMyDividend.call(null, daoId, deps.myAddress)
    }
    if (daoId && deps.myAddress) {
      asyncFn()
    }
  }, [daoId, deps.myAddress, deps.updateMyDividend])

  return (
    <div id={containerClass}>
      {daoId && <MyAccount deps={deps} daoId={daoId} />}
    </div>
  )
}
