import React, { useEffect, useState } from "react"
import { BuyMoreShares } from "./BuyMoreShares"
import { init } from "../controller/investment"
import { InvestmentProfits } from "./InvestmentProfits"
import { UnlockShares } from "./UnlockShares"
import { LockShares } from "./LockShares"
import Progress from "./Progress"
import { ContentTitle } from "./ContentTitle"
import { useDaoId } from "../hooks/useDaoId"

export const Investment = ({ deps }) => {
  let daoId = useDaoId()

  const [dao, setDao] = useState(null)
  const [showBuyMoreTab, setShowBuyMoreTab] = useState(true)
  const [showUnlockTab, setShowUnlockTab] = useState(false)
  const [showLockTab, setShowLockTab] = useState(false)

  initAndUpdateInvestmentData(deps, daoId, setDao)

  const userView = () => {
    if (deps.myAddress && dao && deps.investmentData) {
      return (
        <div>
          <div className="section_container">
            {deps.features.prospectus && (
              <div>
                <a href={deps.dao.prospectus_url}>
                  {"Acknowledged prospectus"}
                </a>
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

            <div id="dao_actions_top_bar">
              <p
                className={actions_tabs_classes(showBuyMoreTab)}
                onClick={() => {
                  setShowUnlockTab(false)
                  setShowLockTab(false)
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
    } else {
      return <Progress />
    }
  }

  const bodyView = () => {
    if (dao) {
      return <div>{userView()}</div>
    } else {
      return <Progress />
    }
  }

  return (
    <div>
      <div>{bodyView()}</div>
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

const initAndUpdateInvestmentData = (deps, daoId, setDao) => {
  useEffect(() => {
    const doInit = async () => {
      await init(
        deps.wasm,
        deps.statusMsg,
        deps.myAddress,
        deps.updateInvestmentData,
        deps.updateMyShares,

        daoId,
        setDao
      )

      if (deps.myAddress) {
        await deps.updateInvestmentData.call(null, daoId, deps.myAddress)
      }
    }
    if (deps.wasm) {
      doInit()
    }
  }, [
    deps.wasm,
    daoId,
    deps.myAddress,
    deps.statusMsg,
    deps.updateInvestmentData,
    deps.updateMyShares,
  ])
}
