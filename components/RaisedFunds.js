import React, { useEffect, useRef } from "react";
import Progress from "./Progress";
import renderFundsProgressChart from "../charts/renderFundsBarChart";
import { useRouter } from "next/router";

export const RaisedFunds = ({ deps, dao }) => {
  const router = useRouter();
  const { daoId } = router.query;

  const chart = useRef(null);

  console.log("deps: " + JSON.stringify(deps));

  useEffect(() => {
    async function nestedAsync() {
      deps.updateRaisedFunds.call(null, daoId);
    }
    nestedAsync();
  }, [daoId, dao, deps.statusMsg, deps.updateRaisedFunds]);

  useEffect(() => {
    if (dao && deps.raisedFunds) {
      renderFundsProgressChart(
        chart.current,
        dao,
        deps.raisedFunds,
        deps.raisedFundsNumber,
        deps.raiseState?.success ?? true // no state (still raising) has same colors as successful
      );
    }
  }, [dao, deps.raisedFunds, deps.raisedFundsNumber, deps.raiseState]);

  const view = () => {
    // if (deps.dao && raisedFunds && raisedFundsNumber) {
    if (deps.dao) {
      return (
        <div>
          {/* debug */}
          {/* <div>{"Raised funds: " + raisedFunds}</div>
          <div>{"Raised funds number: " + raisedFundsNumber}</div>
          <div>{"End date: " + dao.raise_end_date}</div>
          <div>{"Min target: " + dao.raise_min_target}</div>
          <div>{"Min target number: " + dao.raise_min_target_number}</div>
          <div>{"Total raisable: " + dao.total_raisable}</div>
          <div>{"Total raisable number: " + dao.total_raisable_number}</div> */}
          <div className="subtitle mb-32">Investing progress</div>

          <div>
            {deps.raiseState && (
              <div
                className={`text-center subtitle mb-12 ${
                  deps.raiseState.success ? "cyan-20" : "red-10"
                }`}
              >
                {deps.raiseState.text}
              </div>
            )}
            <svg ref={chart} />
          </div>
        </div>
      );
    } else {
      return <Progress />;
    }
  };

  return <div>{view()}</div>;
};
