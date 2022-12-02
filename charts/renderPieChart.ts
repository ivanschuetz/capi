import * as d3 from "d3"
import { PIE_CHART_GRAY } from "../functions/utils"

// TODO rename in background or similar to make it generic
const NOT_OWNED = "not_owned"
const RED = "#DF5C60"

// TODO (low prio): parameters can be modelled better, e.g. if disableClick, onSegmentSelected must not be passed.
const renderPieChart = <T extends PieChartSlice>(
  container: JSX.Element,
  data: T[],
  dataNumberSelector: (d: T) => string,
  // returns whether the segment should be displayed as selected
  onSegmentSelected: (segment: T) => boolean,
  colors: string[],
  animated: boolean,
  disableClick: boolean
) => {
  var width = 300,
    height = 300

  let outerRadius = (height / 2) * 0.82
  let innerRadius = (height / 2) * 0.55

  // note that ideally d would be optional, but then we have to put it at the end of the parameters,
  // and we can't do that with the d3 closures, so leaving it everywhere like this.
  const color = (d: PieChartD3Slice<T>, i: number, isGray = false) => {
    if (d && d.data.isSelected) {
      return RED
    } else {
      return isGray ? PIE_CHART_GRAY : colors[Math.round(i % colors.length)]
    }
  }

  const segmentClass = (d: PieChartD3Slice<T>, i: number, isGray = false) => {
    return isGray || disableClick ? "" : "clickable"
  }

  const svg = d3.select(container)

  svg.selectAll("*").remove()
  svg.attr("viewBox", `0 0 ${width} ${height}`)

  const chart = svg
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`)

  var pie = d3
    .pie()
    .value(function (d: T) {
      return +dataNumberSelector(d)
    })
    .sort(null)
    .startAngle(0.5 * Math.PI)
    .endAngle(3.5 * Math.PI)

  const data_ready = pie(data)
  const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius)

  chart
    .append("path")
    .attr("fill", PIE_CHART_GRAY)
    .attr("d", arc({ startAngle: 0, endAngle: 2 * Math.PI }))

  const updatedChart = chart
    .selectAll()
    .data(data_ready)
    .join("path")
    .attr("fill", (d: PieChartD3Slice<T>, i: number) =>
      color(d, i, d.data.type_ === NOT_OWNED)
    )
    .attr("class", (d: PieChartD3Slice<T>, i: number) =>
      segmentClass(d, i, d.data.type_ === NOT_OWNED)
    )

  let angleInterpolation = d3.interpolate(pie.startAngle()(), pie.endAngle()())

  if (animated) {
    updatedChart
      .transition()
      .ease(d3.easeLinear)
      .duration(2000)
      .attrTween("d", (d: PieChartD3Slice<T>) => {
        let originalEnd = d.endAngle
        return (t) => {
          let currentAngle = angleInterpolation(t)
          if (currentAngle < d.startAngle) {
            return ""
          }
          d.endAngle = Math.min(currentAngle, originalEnd)

          return arc(d)
        }
      })
  } else {
    updatedChart.attr("d", (d: PieChartD3Slice<T>) => {
      return arc(d)
    })
  }

  const defaultColorsState = () => {
    updatedChart
      .transition()
      .ease(d3.easeLinear)
      .duration(200)
      .attr("fill", (d: PieChartD3Slice<T>, i: number) =>
        color(d, i, d.data.type_ === NOT_OWNED)
      )
  }

  const selectedColorState = (segment) => {
    d3.select(segment)
      .transition()
      .ease(d3.easeLinear)
      .duration(200)
      .attr("fill", RED)
  }

  function handleOnClick(p, d?: PieChartD3Slice<T>) {
    if (disableClick) return

    // should be improved: coupling here with the holders distribution data ("not owned" only makes sense there)
    if (d && d.data.type_ !== NOT_OWNED) {
      // this is assumed to update the state somewhere up in the hierarchy
      const select = onSegmentSelected(d.data)
      // update UI for returned select status
      // we update like this (instead of only reacting to state change),
      // because it seems to be the easiest way, otherwise the chart re-animates when changing state and tuning that seems more complicated
      // note that we also handle selected state on render, so if for whatever reason the chart re-renders again, it shows correctly
      if (select) {
        defaultColorsState()
        selectedColorState(this)
      } else {
        selectedColorState(this)
        defaultColorsState()
      }
    }
  }

  svg.selectAll("path").on("click", handleOnClick)
}

export default renderPieChart

export type PieChartSlice = {
  // in the context of this chart, this can be NOT_OWNED (constant), to make it "background" segment
  // other values are ignored and can be used in different contexts.
  type_: string
  // whether the slice is selected
  isSelected: boolean
}

// represents object we get from d3 - our model is "data" + some d3 specific fields (note that we only list what we use)
type PieChartD3Slice<T extends PieChartSlice> = {
  data: T
  startAngle: number
  endAngle: number
}
