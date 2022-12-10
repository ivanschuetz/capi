import React from "react"

export const ChartLegends = ({ legends }: { legends: Legend[] }) => {
  const legendsViews = () => {
    return (
      legends &&
      legends.length > 0 && (
        <div className="chart_legends_container">
          {legends.map((legend) => (
            <ChartLegend key={legend.text} legend={legend} />
          ))}
        </div>
      )
    )
  }

  return <div>{legendsViews()}</div>
}

const ChartLegend = ({ legend }: { legend: Legend }) => {
  return (
    <div className="flex items-center justify-center gap-2 whitespace-nowrap">
      <svg className="h-4 w-4" fill={legend.color}>
        <rect width="100%" height="100%" rx={4} />
      </svg>
      <span className="chart_legend__text">{legend.text}</span>
    </div>
  )
}

type Legend = {
  color: string
  text: string
}
