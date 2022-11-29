import { useEffect, useRef } from "react"
import renderPieChart from "../charts/renderPieChart"

// onAddressSelected has to return selected status, to highlight the segment
export const SharesDistributionChart = ({
  sharesDistr,
  onAddressSelected,
  col,
  animated,
  disableClick,
}: {
  sharesDistr: any
  // returns whether the address segment should be displayed as selected
  onAddressSelected?: (value: string) => boolean
  col: any
  animated: any
  disableClick?: boolean
}) => {
  const chart = useRef(null)

  useEffect(() => {
    if (sharesDistr && chart.current) {
      renderPieChart(
        chart.current,
        sharesDistr,
        (d) => d.percentage_number,
        (d) => onAddressSelected(d.address),
        col,
        animated,
        disableClick
      )
    }
  }, [onAddressSelected, sharesDistr, col, animated, disableClick])

  return <svg className="pie_chart__svg" ref={chart} />
}
