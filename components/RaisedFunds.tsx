import { MutableRefObject, useEffect, useRef } from "react"
import { DaoJs } from "wasm/wasm"
import renderFundsProgressChart from "../charts/renderFundsProgressChart"
import { Deps } from "../context/AppContext"
import { useDaoId } from "../hooks/useDaoId"
import { Subtitle } from "./ContentTitle"
import Progress from "./Progress"

export const RaisedFunds = ({ deps, dao }: { deps: Deps; dao: DaoJs }) => {
  const daoId = useDaoId()

  const chart = useRef(null)

  console.log("deps: " + JSON.stringify(deps))

  updateRaisedFunds(deps, dao, daoId)
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

const RaisedFundsView = ({
  deps,
  chart,
}: {
  deps: Deps
  chart: MutableRefObject<any>
}) => {
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
      <Subtitle text={"Investing progress"} />
      <div>
        {deps.raiseState && (
          <div
            className={`mb-12 text-center text-50 font-bold text-te sm:text-60 ${
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

const updateRaisedFunds = (deps: Deps, dao: DaoJs, daoId?: string) => {
  useEffect(() => {
    ;(async () => {
      if (daoId) {
        await deps.updateRaisedFunds.call(null, daoId)
      }
    })()
  }, [daoId, dao, deps.notification, deps.updateRaisedFunds])
}

const updateChart = (deps: Deps, dao: DaoJs, chart: MutableRefObject<any>) => {
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
