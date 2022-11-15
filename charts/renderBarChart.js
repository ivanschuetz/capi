import * as d3 from "d3";

const SUBGROUPARRAY = ["spending", "income"];

const renderBarChart = (svg, flatData, colors, format) => {
  const margin = { top: 10, right: 10, bottom: 30, left: 40 },
    width = 600 - margin.right,
    height = 280 - margin.top - margin.bottom;

  let data = flatData.map((d) => {
    return {
      ...d,
      date: d3.timeFormat("%s")(new Date(d.date)),
    };
  });

  const totalWidth = width + margin.left + margin.right;
  const totalHeight = height + margin.top + margin.bottom;

  // main x axis settings

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.date).sort(d3.ascending))
    .range([margin.left, totalWidth])
    .paddingInner([0.5])
    .paddingOuter([0.25]);

  // subgrouping
  const subGroup = d3
    .scaleBand()
    .domain(SUBGROUPARRAY)
    // .range([0, 25])
    .range([0, x.bandwidth()])
    .padding([0.25]);

  const selected = d3.select(svg);

  // removing existing svgs if any.
  selected.selectAll("*").remove();

  selected
    .attr("viewBox", `0 0 ${totalWidth} ${totalHeight}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  selected.append("g").call(d3.axisBottom(x).tickSize(0));
  console.log(data);
  let yMax = Math.max(
    ...data.map((d) => d.income),
    ...data.map((d) => d.spending)
  );

  let offset = parseInt("1".padEnd(`${parseInt(yMax)}`.length, 0));

  if (yMax === 0) {
    selected
      .append("text")
      .text("No funds activity yet")
      .attr("fill", "black")
      .attr("opacity", 0.5)
      .attr("font-size", 20)
      .attr("font-weight", 600)
      .attr("x", x.bandwidth() * data.length + margin.left)
      .attr("y", (height - margin.bottom - margin.top) / 2)
      .attr("text-anchor", "middle");

    yMax = 400;
    offset = 0;
  }
  // y axis settings
  const y = d3
    .scaleLinear()
    .domain([0, yMax + offset])
    .range([height - margin.bottom, margin.top]);

  // removes border lines and adds faded strokes for y axis
  selected
    .call(
      d3.axisRight(y).ticks(4).tickSize(totalWidth).tickFormat(d3.format("~s"))
    )
    .call((g) => g.select(".domain").remove())
    .call((g) =>
      g
        .selectAll(".tick:not(:first-of-type) line")
        .attr("transform", `translate(${margin.left},0)`)
        .attr("stroke-opacity", 0.1)
        .attr("stroke-dash", "2,2")
    )
    .call((g) =>
      g.selectAll(".tick text").attr("x", 4).attr("dy", 4).attr("opacity", 0.5)
    );

  const timeFormat = format === "year" ? "%b" : "%d %b";

  // changes the displaying values on x axis
  selected
    .append("g")
    .attr("opacity", 0.5)
    .attr("transform", `translate(0, ${height - 10})`)
    .call(
      d3
        .axisBottom(x)
        .tickSize(0)
        .tickFormat((d) => d3.timeFormat(timeFormat)(new Date(d * 1000)))
    )
    .call((g) => {
      g.select(".domain").remove();
    })
    .selectAll("text");
  // for rotated labels
  // .attr("dx", "-1em")
  // .attr("dy", "-0.5em")
  // .style("text-anchor", "middle")
  // .attr("transform", "rotate(-45)");

  const colorsRange = d3.scaleOrdinal().domain(SUBGROUPARRAY).range(colors);

  // for rounded corners at the tip
  const [rx, ry] = [subGroup.bandwidth() / 4, subGroup.bandwidth() / 4];

  // adds the rounded corner on the top of each bars
  selected
    .append("g")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", function (d) {
      return `translate(${x(d.date)})`;
    })
    .selectAll("rect")
    .data(function (d) {
      return SUBGROUPARRAY.map(function (key) {
        return { key, value: d[key] };
      });
    })
    .enter()
    .append("path")
    .attr("class", "bars")
    .attr("d", (item) => barShape(item, rx, ry, subGroup, y(0), 0))
    .transition()
    .ease(d3.easeLinear)
    .duration(800)
    .attr("d", (item) =>
      barShape(
        item,
        rx,
        ry,
        subGroup,
        y(item.value) + ry,
        height - y(item.value) - ry - margin.bottom
      )
    )
    .attr("fill", function (d) {
      return colorsRange(d.key);
    });
};
export default renderBarChart;

const barShape = (item, rx, ry, subGroup, top, bottom) => {
  return parseFloat(item.value)
    ? bottom < 0
      ? `
    M${subGroup(item.key)},${top}
    h${0}
    h${subGroup.bandwidth() - 2 * rx}
    h${0}
    v${0}
    h${-subGroup.bandwidth()}Z
  `
      : `
      M${subGroup(item.key)},${top}
      a${rx},${ry} 0 0 1 ${rx},${-ry}
      h${subGroup.bandwidth() - 2 * rx}
      a${rx},${ry} 0 0 1 ${rx},${ry}
      v${bottom}
      h${-subGroup.bandwidth()}Z`
    : ``;
};
