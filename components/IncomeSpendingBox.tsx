import {
  MutableRefObject,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { IncomeVsSpendingResJs } from "wasm/wasm"
import { ChartLegends } from "../charts/ChartLegends"
import renderBarChart from "../charts/renderBarChart"
import { AppContext, Deps } from "../context/AppContext"
import { safe } from "../functions/utils"
import { LabeledBox } from "./LabeledBox"
import { Notification } from "./Notification"
import Progress from "./Progress"
import Select, { components, DropdownIndicatorProps } from "react-select"
import dropdown from "../images/svg/dropdown.svg"

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
    // NOTE: colors from tailwind theme
    return ["#6672d7", "#de5c62"]
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

  return <div className="charts-container mt-20">{content()}</div>
}

const ChartBox = ({
  colors,
  selectedBarsInterval,
  setSelectedBarsInterval,
  barsOptions,
  chart,
}: {
  colors: string[]
  selectedBarsInterval: BarInterval
  setSelectedBarsInterval: (interval: BarInterval) => void
  barsOptions: BarInterval[]
  chart: MutableRefObject<any>
}) => {
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <img src={dropdown.src} alt="info" />
      </components.DropdownIndicator>
    )
  }

  const Input = (props) => <components.Input {...props} readOnly={true} />

  return (
    <LabeledBox label={"Income and spending"}>
      <div className="flex flex-col gap-6">
        <div className="flex h-8 w-full items-start justify-between lg:items-center">
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
            components={{ DropdownIndicator, Input }}
            styles={{
              singleValue: (baseStyles, state) =>
                selectSingleValueStyle(baseStyles, state),

              indicatorSeparator: (baseStyles) => ({
                ...baseStyles,
                display: "none",
              }),
              input: (baseStyles) => ({
                ...baseStyles,
                height: "50px",
                fontWeight: "700",
              }),
              control: (baseStyles, state) =>
                selectInputStyle(baseStyles, state),
            }}
          />
          {/* workaround for react-select text jumping when opening the dropdown:
          we add the text manually on front of the select, and make the select's text invisible. */}
          <div className="pointer-events-none absolute right-[10%] text-45 font-bold text-pr">
            {selectedBarsInterval.label}
          </div>
        </div>
        <svg className="mb--40" ref={chart} />
      </div>
    </LabeledBox>
  )
}

const selectSingleValueStyle = (baseStyles: any, state: any) => {
  // console.log("state: %o", state)
  return {
    ...baseStyles,
    color: "#fff",
    fontWeight: 700,
    fontSize: "16px",
  }
}

const selectInputStyle = (baseStyles: any, state: any) => {
  return {
    ...baseStyles,
    borderStyle: "none",
    borderWidth: "0",
    boxShadow: "none",
  }
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
