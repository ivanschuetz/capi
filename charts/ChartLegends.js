import React from "react";

export const ChartLegends = ({ legends }) => {
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
    );
  };

  return <div>{legendsViews()}</div>;
};

const ChartLegend = ({ legend }) => {
  return (
    <div className="chart_legend__container">
      <svg className="chart_legend__color" fill={legend.color}>
        <circle cx="50%" cy="50%" r="4" />
      </svg>
      <span className="chart_legend__text">{legend.text}</span>
    </div>
  );
};
