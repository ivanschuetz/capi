export const init = async (wasm, statusMsg, daoId, setDao) => {
  try {
    let dao = await wasm.bridge_load_dao(daoId);
    setDao(dao);
  } catch (e) {
    statusMsg.error(e);
  }
};
