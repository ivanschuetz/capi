import { useEffect, useState } from "react"
import { ProspectusJs } from "wasm"
import { Deps } from "../context/AppContext"
import { safe } from "../functions/utils"
import { useDaoId } from "../hooks/useDaoId"
import { BuyMoreShares } from "./BuyMoreShares"
import { ContentTitle } from "./ContentTitle"
import { InvestmentProfits } from "./InvestmentProfits"
import { LockShares } from "./LockShares"
import Progress from "./Progress"
import { UnlockShares } from "./UnlockShares"
import info from "../images/svg/info.svg"

export const Investment = ({ deps }) => {
  let daoId = useDaoId()

  const [dao, setDao] = useState(null)
  const [showBuyMoreTab, setShowBuyMoreTab] = useState(true)
  const [showUnlockTab, setShowUnlockTab] = useState(false)
  const [showLockTab, setShowLockTab] = useState(false)

  initAndUpdateInvestmentData(deps, daoId, setDao)

  const prospectus = deps.dao?.prospectus

  const view = () => {
    return (
      <div>
        <div className="section_container">
          <ContentTitle title={"My investment"} />

          {deps.features.stillRaisingFundsLabels &&
            dao.funds_raised === "false" && <StillRaisingFundsWarning />}
          {deps.features.prospectus && prospectus && (
            <ProspectusLink prospectus={prospectus} />
          )}

          <InvestmentProfits deps={deps} />
          <Tabs
            showBuyMoreTab={showBuyMoreTab}
            showUnlockTab={showUnlockTab}
            showLockTab={showLockTab}
            setShowBuyMoreTab={setShowBuyMoreTab}
            setShowUnlockTab={setShowUnlockTab}
            setShowLockTab={setShowLockTab}
          />
          {showBuyMoreTab && <BuyMoreShares deps={deps} dao={dao} />}
          {showUnlockTab && (
            <UnlockShares deps={deps} dao={dao} daoId={daoId} />
          )}
          {showLockTab && (
            <LockShares
              deps={deps}
              dao={dao}
              daoId={daoId}
              onLockOpt={deps.updateInvestmentData}
            />
          )}
        </div>
      </div>
    )
  }

  if (deps.myAddress && dao && deps.investmentData) {
    return view()
  } else {
    return <Progress />
  }
}

const StillRaisingFundsWarning = ({}) => {
  return (
    <div className="flex gap-2">
      <img src={info.src} />
      <div className="text-45 text-te">
        {"The project is still raising funds. Some features are disabled."}
      </div>
    </div>
  )
}

const ProspectusLink = ({ prospectus }: { prospectus: ProspectusJs }) => {
  return (
    <div className="mb-6 mt-6">
      <a href={prospectus.url} target="_blank" className="font-bold text-pr">
        {"Acknowledged prospectus"}
      </a>
    </div>
  )
}

const Tabs = ({
  showBuyMoreTab,
  showUnlockTab,
  showLockTab,
  setShowBuyMoreTab,
  setShowUnlockTab,
  setShowLockTab,
}) => {
  return (
    <div id="dao_actions_top_bar">
      <p
        className={actions_tabs_classes(showBuyMoreTab)}
        onClick={() => {
          setShowLockTab(false)
          setShowUnlockTab(false)
          setShowBuyMoreTab((current) => !current)
        }}
      >
        {"Buy more"}
      </p>
      <p
        className={actions_tabs_classes(showUnlockTab)}
        onClick={() => {
          setShowBuyMoreTab(false)
          setShowLockTab(false)
          setShowUnlockTab((current) => !current)
        }}
      >
        {"Unlock"}
      </p>
      <p
        className={actions_tabs_classes(showLockTab)}
        onClick={() => {
          setShowBuyMoreTab(false)
          setShowUnlockTab(false)
          setShowLockTab((current) => !current)
        }}
      >
        {"Lock"}
      </p>
    </div>
  )
}

const actions_tabs_classes = (tabIsShowing) => {
  var clazz = "link_button"
  if (tabIsShowing) {
    clazz += " dao_action_tab_item__sel"
  }
  return clazz
}

const initAndUpdateInvestmentData = (deps: Deps, daoId, setDao) => {
  useEffect(() => {
    safe(deps.notification, async () => {
      if (deps.wasm) {
        let dao = await deps.wasm.loadDao(daoId)
        console.log("dao: " + JSON.stringify(dao))
        setDao(dao)
      }

      if (deps.myAddress) {
        // TODO check for daoId? or do we know it's always set?
        await deps.updateInvestmentData(daoId, deps.myAddress)
        await deps.updateMyShares(daoId, deps.myAddress)
        await deps.updateInvestmentData.call(null, daoId, deps.myAddress)
      }
    })
  }, [
    deps.wasm,
    daoId,
    deps.myAddress,
    deps.notification,
    deps.updateInvestmentData,
    deps.updateMyShares,
  ])
}
