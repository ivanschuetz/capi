export const fetchSharesDistribution = async (
  wasm,
  notification,
  assetId,
  assetSupply,
  appId,
  setSharesDistr,
  setNotOwnedShares
) => {
  try {
    let res = await wasm.sharesDistribution({
      asset_id: assetId,
      share_supply: assetSupply,
      app_id: appId,
    })
    console.log("Shares distribution res: " + JSON.stringify(res))

    // remember original index to get chart segment color
    // we need this, because the displayed entries are filtered ("show less" state)
    // so their indices don't correspond to the chart (which displays all the holders)
    const holdersWithIndex = res.holders.map((holder, index) => {
      holder.originalIndex = index
      return holder
    })

    setSharesDistr(holdersWithIndex)
    setNotOwnedShares(res.not_owned_shares)
  } catch (e) {
    notification.error(e)
  }
}

export const fetchHoldersChange = async (
  wasm,
  notification,
  assetId,
  appId,
  setHoldersChange
) => {
  try {
    let res = await wasm.holdersChange({
      asset_id: assetId,
      app_id: appId,
    })
    console.log("Holders change res: " + JSON.stringify(res))

    setHoldersChange(res.change)
  } catch (e) {
    notification.error(e)
  }
}
