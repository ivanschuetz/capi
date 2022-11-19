import React, { useEffect, useState, useMemo, useRef, useContext } from "react"
import { LabeledBox } from "./LabeledBox"
import { fetchIncomeSpendingChartData } from "../controller/income_spending"
import Select from "react-select"
import Progress from "./Progress"
import { ChartLegends } from "../charts/ChartLegends"
import renderBarChart from "../charts/renderBarChart"
import { AppContext } from "../context/AppContext"

const barsOptions = [
  { value: "days7", label: "Last 7 days" },
  { value: "months3", label: "Last 3 months" },
  { value: "year", label: "Last year" },
]

export const IncomeSpendingBox = ({ statusMsg, daoId }) => {
  const { deps } = useContext(AppContext)

  const [chartData, setChartData] = useState(null)

  const [selectedBarsInterval, setSelectedBarsInterval] = useState(
    barsOptions[0]
  )

  const chart = useRef(null)

  const colors = useMemo(() => {
    return ["#DE5C62", "#6BB9BC"]
  }, [])

  updateChartData(
    deps,
    statusMsg,
    daoId,
    selectedBarsInterval,
    colors,
    chart,
    setChartData
  )

  const content = () => {
    if (chartData) {
      return (
        <ChartBox
          colors={colors}
          selectedBarsInterval={selectedBarsInterval}
          setSelectedBarsInterval={setSelectedBarsInterval}
          barsOptions={barsOptions}
          chart={chart}
        />
      )
    } else {
      return <Progress />
    }
  }

  return <div className="charts-container mt-80">{content()}</div>
}

const ChartBox = ({
  colors,
  selectedBarsInterval,
  setSelectedBarsInterval,
  barsOptions,
  chart,
}) => {
  return (
    <LabeledBox label={"Income and spending"}>
      <div className="d-flex flex-column gap-24">
        <div className="select-legend-container">
          <div className="spacer"></div>
          <ChartLegends
            legends={[
              { color: colors[1], text: "Income" },
              { color: colors[0], text: "Spending" },
            ]}
          />
          <Select
            className="charts-select"
            value={selectedBarsInterval}
            onChange={setSelectedBarsInterval}
            options={barsOptions}
          />
        </div>
        <svg className="mb--40" ref={chart} />
      </div>
    </LabeledBox>
  )
}

const updateChartData = (
  deps,
  statusMsg,
  daoId,
  selectedBarsInterval,
  colors,
  chart,
  setChartData
) => {
  useEffect(() => {
    async function fetchData() {
      const chartData = await fetchIncomeSpendingChartData(
        deps.wasm,
        statusMsg,
        daoId,
        selectedBarsInterval.value
      )
      setChartData(chartData)

      if (chartData && chart.current) {
        renderBarChart(
          chart.current,
          chartData.points,
          colors,
          selectedBarsInterval.value
        )
      }
    }

    if (deps.wasm) {
      fetchData()
    }
  }, [deps.wasm, statusMsg, daoId, selectedBarsInterval.value, colors])
}
