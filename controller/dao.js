export const loadDescription = async (wasm, statusMsg, dao, setDescription) => {
  try {
    if (dao && dao.descr_url) {
      let description = await wasm.bridge_description(dao.descr_url);
      setDescription(description);
    } else {
      setDescription("");
    }
  } catch (e) {
    statusMsg.error(e);
  }
};
