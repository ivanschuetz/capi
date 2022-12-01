import {
  MutableRefObject,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import Select from "react-select"
import { IncomeVsSpendingResJs } from "wasm/wasm"
import { ChartLegends } from "../charts/ChartLegends"
import renderBarChart from "../charts/renderBarChart"
import { AppContext, Deps } from "../context/AppContext"
import { safe } from "../functions/utils"
import { LabeledBox } from "./LabeledBox"
import { Notification } from "./Notification"
import Progress from "./Progress"

const barsOptions: BarInterval[] = [
  { value: "days7", label: "Last 7 days" },
  { value: "months3", label: "Last 3 months" },
  { value: "year", label: "Last year" },
]

type BarInterval = {
  value: string
  label: string
}

export const IncomeSpendingBox = ({
  notification,
  daoId,
}: {
  notification: Notification
  daoId: string
}) => {
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
    notification,
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
  deps: Deps,
  notification: Notification,
  daoId: string,
  selectedBarsInterval: BarInterval,
  colors: string[],
  chart: MutableRefObject<any>,
  setChartData: (data: IncomeVsSpendingResJs) => void
) => {
  useLayoutEffect(() => {
    if (deps.wasm) {
      safe(notification, async () => {
        let res = await deps.wasm.incomeVsSpending({
          dao_id: daoId,
          interval: selectedBarsInterval.value,
        })
        console.log("Income and spending chart: %o", res)
        setChartData(res)

        if (res && chart.current) {
          renderBarChart(
            chart.current,
            res.points,
            colors,
            selectedBarsInterval.value
          )
        }
      })
    }
  }, [deps.wasm, notification, daoId, selectedBarsInterval.value, colors])
}
