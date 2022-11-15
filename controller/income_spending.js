import { ready } from "../functions/common_ts_tmp";

const wasmPromise = import("wasm");

export const fetchIncomeSpendingChartData = async (
  statusMsg,
  daoId,
  interval
) => {
  try {
    const wasm = await ready(wasmPromise);
    let res = await wasm.bridge_income_vs_spending({
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
