import { ready } from "../functions/common_ts_tmp";

const wasmPromise = import("wasm");

export const loadDescription = async (statusMsg, dao, setDescription) => {
  try {
    if (dao && dao.descr_url) {
      const wasm = await ready(wasmPromise);
      let description = await wasm.bridge_description(dao.descr_url);
      setDescription(description);
    } else {
      setDescription("");
    }
  } catch (e) {
    statusMsg.error(e);
  }
};
