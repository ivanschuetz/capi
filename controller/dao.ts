import { StatusMsgUpdaterType } from "../components/StatusMsgUpdater"
import { safe } from "../functions/utils"

export const loadDescription = async (
  wasm,
  statusMsg: StatusMsgUpdaterType,
  dao,
  setDescription
) => {
  safe(statusMsg, async () => {
    if (dao && dao.descr_url) {
      let description = await wasm.bridge_description(dao.descr_url)
      setDescription(description)
    } else {
      setDescription("")
    }
  })
}
