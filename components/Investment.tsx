import { useEffect, useState } from "react"
import { Deps } from "../context/AppContext"
import { safe } from "../functions/utils"
import { useDaoId } from "../hooks/useDaoId"
import { BuyMoreShares } from "./BuyMoreShares"
import { ContentTitle } from "./ContentTitle"
import { InvestmentProfits } from "./InvestmentProfits"
import { LockShares } from "./LockShares"
import Progress from "./Progress"
import { UnlockShares } from "./UnlockShares"

export const Investment = ({ deps }) => {
  let daoId = useDaoId()

  const [dao, setDao] = useState(null)
  const [showBuyMoreTab, setShowBuyMoreTab] = useState(true)
  const [showUnlockTab, setShowUnlockTab] = useState(false)
  const [showLockTab, setShowLockTab] = useState(false)

  initAndUpdateInvestmentData(deps, daoId, setDao)

  const view = () => {
    return (
      <div>
        <div className="section_container">
          {deps.features.prospectus && (
            <div>
              <a href={deps.dao.prospectus_url}>{"Acknowledged prospectus"}</a>
            </div>
          )}

          <ContentTitle title={"My investment"} />

          {deps.features.stillRaisingFundsLabels &&
            dao.funds_raised === "false" && (
              <div>
                {
                  "The project is still raising funds. Some features are disabled."
                }
              </div>
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
