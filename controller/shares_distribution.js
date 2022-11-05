const wasmPromise = import("wasm");

export const fetchSharesDistribution = async (
  statusMsg,
  assetId,
  assetSupply,
  appId,
  setSharesDistr,
  setNotOwnedShares
) => {
  try {
    const { bridge_shares_distribution } = await wasmPromise;
    let res = await bridge_shares_distribution({
      asset_id: assetId,
      share_supply: assetSupply,
      app_id: appId,
    });
    console.log("Shares distribution res: " + JSON.stringify(res));

    // remember original index to get chart segment color
    // we need this, because the displayed entries are filtered ("show less" state)
    // so their indices don't correspond to the chart (which displays all the holders)
    const holdersWithIndex = res.holders.map((holder, index) => {
      holder.originalIndex = index;
      return holder;
    });

    setSharesDistr(holdersWithIndex);
    setNotOwnedShares(res.not_owned_shares);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const fetchHoldersChange = async (
  statusMsg,
  assetId,
  appId,
  setHoldersChange
) => {
  try {
    const { bridge_holders_change } = await wasmPromise;
    let res = await bridge_holders_change({
      asset_id: assetId,
      app_id: appId,
    });
    console.log("Holders change res: " + JSON.stringify(res));

    setHoldersChange(res.change);
  } catch (e) {
    statusMsg.error(e);
  }
};
