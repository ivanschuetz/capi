import * as d3 from "d3";

const renderMultilineChart = (svg, flatData, lineData, lineColors) => {
  // TODO pass parent's dimensions
  const margin = { top: 10, right: 10, bottom: 30, left: 40 },
    width = 200 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  const data = new Map(Object.entries(lineData));

  let flatDataWithD3Dates = flatData.map((d) => {
    return { ...d, date: d3.timeParse("%s")(d.date) };
  });

  const x = d3
    .scaleTime()
    .domain(
      d3.extent(flatDataWithD3Dates, function (d) {
        return d.date;
      })
    )
    .range([0, width]);

  const selected = d3
    .select(svg)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  selected
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(2));

  const y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(flatDataWithD3Dates, function (d) {
        return +d.value;
      }),
    ])
    .range([height, 0]);
  selected
    .append("g")
    .call(d3.axisLeft(y).ticks(4).tickFormat(d3.format(".0s")));

  const lineColorsRange = d3.scaleOrdinal().range(lineColors);

  selected
    .selectAll(".line")
    .data(data)
    .join("path")
    .attr("fill", "none")
    .attr("stroke", function (d) {
      return lineColorsRange(d[0]);
    })
    .attr("stroke-width", 1.5)
    .attr("d", function (d) {
      return d3
        .line()
        .x(function (d) {
          let d3Date = d3.timeParse("%s")(d.date);
          return x(d3Date);
        })
        .y(function (d) {
          return y(+d.value);
        })(d[1]);
    });
};

export default renderMultilineChart;
