import React, { useState, useEffect } from "react"
import { IncomeSpendingBox } from "./IncomeSpendingBox"
import { SharesDistributionBox } from "./SharesDistributionBox"
import { InvestEmbedded } from "./InvestEmbedded"
import Progress from "./Progress"
import { loadDescription } from "../controller/dao"
import { FundsActivityEmbedded } from "./FundsActivityEmbedded"
import { RaisedFunds } from "./RaisedFunds"
import { useDaoId } from "../hooks/useDaoId"

export const Dao = ({ deps }) => {
  const daoId = useDaoId()

  const [description, setDescription] = useState(null)

  useEffect(() => {
    async function asyncInit() {
      await deps.updateDao.call(null, daoId)
    }
    if (daoId) {
      asyncInit()
    }
  }, [daoId, deps.statusMsg, deps.updateDao])

  useEffect(() => {
    async function fetch() {
      await loadDescription(deps.wasm, deps.statusMsg, deps.dao, setDescription)
    }
    if (deps.wasm) {
      fetch()
    }
  }, [deps.wasm, deps.statusMsg, deps.dao, setDescription])

  const maybeInvestView = (dao) => {
    if (!deps.features.prospectus) {
      return null
    } else {
      if (dao.prospectus) {
        return <InvestEmbedded deps={deps} dao={dao} />
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

  const daoView = () => {
    if (deps.dao) {
      return (
        <div>
          <div>
            {description && <div id="dao_description">{description}</div>}

            <RaisedFunds deps={deps} dao={deps.dao} />

            {deps.size.s4 && (
              <FundsActivityEmbedded deps={deps} daoId={daoId} />
            )}

            {maybeInvestView(deps.dao)}

            {/* <Link
              disabled={deps.myAddress === "" || funds === 0}
              hidden={viewDao.dao.owner_address !== deps.myAddress}
              to={"/withdraw/" + daoId}
            >
              <button>{"Withdraw"}</button>
            </Link> */}
            {deps.dao && <SharesDistributionBox deps={deps} />}

            {deps.dao && deps.dao.funds_raised === "true" && (
              <IncomeSpendingBox statusMsg={deps.statusMsg} daoId={daoId} />
            )}
          </div>
        </div>
      )
    } else {
      return <Progress />
    }
  }

  return <div>{daoView()}</div>
}
