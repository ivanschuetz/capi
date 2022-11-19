import { StatusMsgUpdaterType } from "../components/StatusMsgUpdater"
import { safe } from "../functions/utils"

export const loadFundsActivity = async (
  wasm,
  statusMsg: StatusMsgUpdaterType,
  daoId,
  setActivityEntries,
  maxResults // null if it shouldn't be limited
) => {
  safe(statusMsg, async () => {
    const fundsActivityRes = await wasm.bridge_load_funds_activity({
      dao_id: daoId,
      max_results: maxResults,
    })
    console.log("fundsActivityRes: " + JSON.stringify(fundsActivityRes))

    setActivityEntries(fundsActivityRes.entries)
  })
}

export const loadDao = async (
  wasm,
  statusMsg: StatusMsgUpdaterType,
  daoId,
  setDao
) => {
  safe(statusMsg, async () => {
    let dao = await wasm.bridge_load_dao(daoId)
    console.log("dao: " + JSON.stringify(dao))
    setDao(dao)
  })
}
