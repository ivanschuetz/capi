const wasmPromise = import("wasm");

export const loadDescription = async (statusMsg, dao, setDescription) => {
  try {
    if (dao && dao.descr_url) {
      const { bridge_description } = await wasmPromise;
      let description = await bridge_description(dao.descr_url);
      setDescription(description);
    } else {
      setDescription("");
    }
  } catch (e) {
    statusMsg.error(e);
  }
};
