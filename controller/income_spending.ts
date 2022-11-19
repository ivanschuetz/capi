export const fetchIncomeSpendingChartData = async (
  wasm,
  statusMsg,
  daoId,
  interval
) => {
  try {
    let res = await wasm.bridge_income_vs_spending({
      dao_id: daoId,
      interval: interval,
    })
    console.log("Income and spending chart: %o", res)
    return res
  } catch (e) {
    statusMsg.error(e)
    return null
  }
}
