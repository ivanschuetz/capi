import { useLayoutEffect, useRef } from "react"
import renderPieChart, { PieChartSlice } from "../charts/renderPieChart"

// onAddressSelected has to return selected status, to highlight the segment
export const SharesDistributionChart = ({
  sharesDistr,
  onAddressSelected,
  colors,
  animated,
  disableClick,
}: {
  sharesDistr: PieChartPercentageSlice[]
  // returns whether the address segment should be displayed as selected
  onAddressSelected?: (value: string) => boolean
  colors: any
  animated: boolean
  disableClick?: boolean
}) => {
  const chart = useRef(null)

  useLayoutEffect(() => {
    if (sharesDistr && chart.current) {
      renderPieChart(
        chart.current,
        sharesDistr,
        (d) => d.percentage_number,
        (d) => false,
        colors,
        animated,
        disableClick
      )
    }
  }, [onAddressSelected, sharesDistr, colors, animated, disableClick])

  return <svg className="pie_chart__svg" ref={chart} />
}

export type PieChartPercentageSlice = PieChartSlice & {
  percentage_number: string
}
