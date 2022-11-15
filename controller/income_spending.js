const wasmPromise = import("wasm");

export const fetchIncomeSpendingChartData = async (
  statusMsg,
  daoId,
  interval
) => {
  try {
    const { bridge_income_vs_spending } = await wasmPromise;
    let res = await bridge_income_vs_spending({
      dao_id: daoId,
      interval: interval,
    });
    console.log("Income and spending chart: %o", res);
    return res;
  } catch (e) {
    statusMsg.error(e);
    return null;
  }
};
