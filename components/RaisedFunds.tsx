import React, { useEffect, useRef } from "react"
import Progress from "./Progress"
import renderFundsProgressChart from "../charts/renderFundsBarChart"
import { useDaoId } from "../hooks/useDaoId"

export const RaisedFunds = ({ deps, dao }) => {
  const daoId = useDaoId()

  const chart = useRef(null)

  console.log("deps: " + JSON.stringify(deps))

  updateRaisedFunds(deps, daoId, dao)
  updateChart(deps, dao, chart)

  const view = () => {
    // if (deps.dao && raisedFunds && raisedFundsNumber) {
    if (deps.dao) {
      return <RaisedFundsView deps={deps} chart={chart} />
    } else {
      return <Progress />
    }
  }

  return <div>{view()}</div>
}

const RaisedFundsView = ({ deps, chart }) => {
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
      <div className="subtitle mb-32">{"Investing progress"}</div>

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
  )
}

const updateRaisedFunds = (deps, daoId, dao) => {
  useEffect(() => {
    async function nestedAsync() {
      if (daoId) {
        deps.updateRaisedFunds.call(null, daoId)
      }
    }
    nestedAsync()
  }, [daoId, dao, deps.statusMsg, deps.updateRaisedFunds])
}

const updateChart = (deps, dao, chart) => {
  useEffect(() => {
    if (dao && deps.raisedFunds) {
      renderFundsProgressChart(
        chart.current,
        dao,
        deps.raisedFunds,
        deps.raisedFundsNumber,
        deps.raiseState?.success ?? true // no state (still raising) has same colors as successful
      )
    }
  }, [dao, deps.raisedFunds, deps.raisedFundsNumber, deps.raiseState])
}
