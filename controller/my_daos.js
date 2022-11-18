export const loadMyDaos = async (wasm, statusMsg, myAddress, setMyDaos) => {
  try {
    const myDaosRes = await wasm.bridge_my_daos({
      address: myAddress,
    });
    console.log("myDaosRes: " + JSON.stringify(myDaosRes));

    setMyDaos(myDaosRes.daos);
  } catch (e) {
    statusMsg.error(e);
  }
};
