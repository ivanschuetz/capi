export const loadFundsActivity = async (
  wasm,
  statusMsg,
  daoId,
  setActivityEntries,
  maxResults // null if it shouldn't be limited
) => {
  try {
    const fundsActivityRes = await wasm.bridge_load_funds_activity({
      dao_id: daoId,
      max_results: maxResults,
    });
    console.log("fundsActivityRes: " + JSON.stringify(fundsActivityRes));

    setActivityEntries(fundsActivityRes.entries);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const loadDao = async (wasm, statusMsg, daoId, setDao) => {
  try {
    let dao = await wasm.bridge_load_dao(daoId);
    console.log("dao: " + JSON.stringify(dao));
    setDao(dao);
  } catch (e) {
    statusMsg.error(e);
  }
};
