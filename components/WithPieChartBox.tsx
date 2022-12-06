import { pieChartColors, PIE_CHART_GRAY } from "../functions/utils"
import { InteractiveBox } from "./InteractiveBox"
import {
  PieChartPercentageSlice,
  SharesDistributionChart,
} from "./SharesDistributionChart"

// an InteractiveBox with children on the left side and pie chart on the right
export const WithPieChartBox = ({
  title,
  children,
  slices,
  chartColors,
}: {
  title: string
  children: JSX.Element
  slices?: PieChartPercentageSlice[]
  chartColors: string[]
}) => {
  return (
    <InteractiveBox title={title}>
      <div className="shares-box">
        <div className="shares-amount">{children}</div>
        {/* desktop chart */}
        {slices && (
          <div className="shares-chart d-tablet-mobile-none">
            <Chart slices={slices} colors={chartColors} />
          </div>
        )}
        {/* mobile chart */}
        <div className="shares-chart d-desktop-none">
          <Chart slices={slices} colors={chartColors} />
        </div>
      </div>
    </InteractiveBox>
  )
}

const Chart = ({
  slices,
  colors,
}: {
  slices: PieChartPercentageSlice[]
  colors: string[]
}) => {
  return (
    <SharesDistributionChart
      sharesDistr={slices}
      colors={colors}
      animated={false}
      disableClick={true}
    />
  )
}
