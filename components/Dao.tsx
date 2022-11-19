import React, { useState, useEffect } from "react"
import { IncomeSpendingBox } from "./IncomeSpendingBox"
import { SharesDistributionBox } from "./SharesDistributionBox"
import { InvestEmbedded } from "./InvestEmbedded"
import Progress from "./Progress"
import { FundsActivityEmbedded } from "./FundsActivityEmbedded"
import { RaisedFunds } from "./RaisedFunds"
import { useDaoId } from "../hooks/useDaoId"
import { safe } from "../functions/utils"

export const Dao = ({ deps }) => {
  const daoId = useDaoId()
  const [description, setDescription] = useState(null)

  updateDao(deps, daoId)
  updateDescription(deps, setDescription)

  const view = () => {
    if (deps.dao) {
      return (
        <div>
          <DaoView deps={deps} description={description} daoId={daoId} />
        </div>
      )
    } else {
      return <Progress />
    }
  }

  return <div>{view()}</div>
}

const DaoView = ({ deps, description, daoId }) => {
  return (
    <div>
      {description && <div id="dao_description">{description}</div>}
      <RaisedFunds deps={deps} dao={deps.dao} />
      {deps.size.s4 && <FundsActivityEmbedded deps={deps} daoId={daoId} />}
      <MaybeInvestView deps={deps} />
      {/* <Link
              disabled={deps.myAddress === "" || funds === 0}
              hidden={viewDao.dao.owner_address !== deps.myAddress}
              to={"/withdraw/" + daoId}
            >
              <button>{"Withdraw"}</button>
            </Link> */}
      {deps.dao && <SharesDistributionBox deps={deps} />}
      {deps.dao && deps.dao.funds_raised === "true" && (
        <IncomeSpendingBox notification={deps.notification} daoId={daoId} />
      )}
    </div>
  )
}

const MaybeInvestView = ({ deps }) => {
  if (!deps.features.prospectus) {
    return null
  } else {
    if (deps.dao.prospectus) {
      return <InvestEmbedded deps={deps} dao={deps.dao} />
    } else {
      return (
        <div>
          {
            "Investing currently is not possible, because the project hasn't added a prospectus."
          }
        </div>
      )
    }
  }
}

const updateDao = (deps, daoId) => {
  useEffect(() => {
    ;async () => {
      if (daoId) {
        await deps.updateDao.call(null, daoId)
      }
    }
  }, [daoId, deps.notification, deps.updateDao])
}

const updateDescription = (deps, setDescription) => {
  useEffect(() => {
    if (deps.wasm) {
      safe(deps.notification, async () => {
        if (deps.dao && deps.dao.descr_url) {
          let description = await deps.wasm.description(deps.dao.descr_url)
          setDescription(description)
        } else {
          setDescription("")
        }
      })
    }
  }, [deps.wasm, deps.notification, deps.dao, setDescription])
}
