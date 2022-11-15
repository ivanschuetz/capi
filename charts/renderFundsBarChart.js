import * as d3 from "d3";
import moment from "moment";

const topLabelFontSize = 12;
const bottomLabelFontSize = 10;
const surroundingLabelWeight = 400;

const renderFundsProgressChart = (
  svg,
  dao,
  formattedRaisedFunds,
  raisedFundsNumber,
  successColors
) => {
  let textTopLeft = moment.unix(dao.setup_date).format("D MMM YYYY");
  let textBottomLeft = "0";
  let textTopRight = moment.unix(dao.raise_end_date).format("D MMM YYYY");
  let textBottomRight = dao.total_raisable + "";

  const minFunds = dao.raise_min_target_number;
  const formattedMinFunds = dao.raise_min_target;
  const maxFunds = dao.total_raisable_number;

  const margin = { top: 30, right: 10, bottom: 30, left: 40 },
    width = 600 - margin.right;

  const barHeight = 15;
  const radius = 10;

  // these could be calculated, but there was some weirdness with text baseline etc, so manually.
  const bottomLabelsOffset = 15;
  const topLabelsOffset = -10;
  const topLabelsY = margin.top + topLabelsOffset;
  const bottomLabelsY = margin.top + barHeight + bottomLabelsOffset;

  const totalWidth = width + margin.left + margin.right;
  const totalHeight = barHeight + margin.top + margin.bottom;

  const selected = d3.select(svg);

  const x = d3.scaleLinear().domain([0, maxFunds]).range([0, totalWidth]);

  // removing existing svgs if any
  selected.selectAll("*").remove();

  selected.attr("viewBox", `0 0 ${totalWidth} ${totalHeight}`);

  selected
    .append("rect")
    // .attr("class", "bg-rect")
    .attr("rx", radius)
    .attr("ry", radius)
    .attr("fill", "#EAECF1")
    .attr("height", barHeight)
    .attr("width", totalWidth)
    .attr("x", 0)
    .attr("y", margin.top);

  const barColor = successColors ? "#6BB9BD" : "#DE5C62";

  // the progress bar looks weird when it's too small (issue with rounded corners), so hidden
  if (x(raisedFundsNumber) > 14) {
    showProgress(
      selected,
      barColor,
      barHeight,
      radius,
      margin.top,
      x,
      raisedFundsNumber
    );

    const raisedFundsFontSize = 10;
    const raisedFundsFontWeight = 600;

    const raisedFundsTextSize = calculateTextSize(
      formattedRaisedFunds,
      raisedFundsFontWeight,
      raisedFundsFontSize
    );

    const labelRightOffset = 12;
    if (x(raisedFundsNumber) > raisedFundsTextSize.width + labelRightOffset) {
      showProgressLabel(
        selected,
        formattedRaisedFunds,
        raisedFundsNumber,
        margin.top + 11,
        x,
        raisedFundsFontSize,
        raisedFundsFontWeight,
        labelRightOffset
      );
    }
  }

  // min funds label
  const minFundsTextSize = calculateTextSize(
    formattedMinFunds,
    surroundingLabelWeight,
    bottomLabelFontSize
  );
  const minFundsX = x(minFunds) - minFundsTextSize.width / 2;
  // if the label overlaps the 0 on the botton left, don't show it
  // could have better solution like moving the label somewhere else
  if (minFundsX > 9) {
    surroundingBottomLabel(selected, formattedMinFunds)
      .attr("x", function () {
        return minFundsX;
      })
      .attr("y", bottomLabelsY);
  }

  // min funds line
  selected
    .append("line")
    .attr("stroke", "black")
    .style("stroke-width", 0.5)
    .style("stroke-dasharray", "1.5, 1.5")
    .attr("x1", function (d) {
      return x(minFunds);
    })
    .attr("y1", function (d) {
      return margin.top;
    })
    .attr("x2", function (d) {
      return x(minFunds);
    })
    .attr("y2", function (d) {
      return barHeight + margin.top;
    });

  surroundingTopLabel(selected, textTopLeft)
    .attr("x", function () {
      return x(0);
    })
    .attr("y", topLabelsY);

  surroundingBottomLabel(selected, textBottomLeft)
    .attr("x", function () {
      return x(0);
    })
    .attr("y", bottomLabelsY);

  surroundingTopLabel(selected, textTopRight)
    .attr("text-anchor", "end")
    .attr("x", function () {
      return x(maxFunds);
    })
    .attr("y", topLabelsY);

  const textBottomRightTextSize = calculateTextSize(
    textBottomRight,
    surroundingLabelWeight,
    bottomLabelFontSize
  );
  surroundingBottomLabel(selected, textBottomRight)
    .attr("x", function () {
      return x(maxFunds) - textBottomRightTextSize.width;
    })
    .attr("y", bottomLabelsY);
};
export default renderFundsProgressChart;

const showProgress = (
  svg,
  color,
  height,
  radius,
  yValue,
  xAxis,
  raisedFunds
) => {
  const progress = svg
    .append("rect")
    // .attr("class", "progress-rect")
    .attr("fill", color)
    .attr("height", height)
    .attr("width", 0)
    .attr("rx", radius)
    .attr("ry", radius)
    .attr("x", 0)
    .attr("y", yValue);

  // animate progress
  progress
    .transition()
    .duration(1000)
    .attr("width", function () {
      return xAxis(raisedFunds);
    });
};

const showProgressLabel = (
  svg,
  formattedRaisedFunds,
  raisedFundsNumber,
  yValue,
  xAxis,
  raisedFundsFontSize,
  raisedFundsFontWeight,
  rightOffset
) => {
  const raisedFundsTextSize = calculateTextSize(
    formattedRaisedFunds,
    raisedFundsFontWeight,
    10
  );

  const raisedLabel = svg
    .append("text")
    .text(formattedRaisedFunds)
    .attr("fill", "white")
    .attr("font-size", raisedFundsFontSize)
    .attr("font-weight", raisedFundsFontWeight)
    .attr("x", 0)
    .attr("opacity", 0)
    // .attr("x", x.bandwidth() * data.length + margin.left)
    // .attr("dominant-baseline", "central")
    // .attr("alignment-baseline", "central")
    // .attr("y", (barHeight - textSize.height) / 2 - textSize.height / 2);
    // .attr("x", function () {
    //   // - 8: offset from bar end
    //   return x(raisedFundsNumber) - raisedFundsTextSize.width - 8;
    // })
    .attr("y", yValue); // offset: center text manually

  // animate funds label
  raisedLabel
    .transition()
    .duration(1000)
    .attr("opacity", 1)
    .attr("x", function () {
      // - 8: offset from bar end
      return xAxis(raisedFundsNumber) - raisedFundsTextSize.width - rightOffset;
    });
};

const calculateTextSize = (text, fontWeight, fontSize) => {
  var container = d3.select("body").append("svg");
  container
    .append("text")
    .attr("font-size", fontSize)
    .attr("font-weight", fontWeight)
    .attr("x", -99999)
    .attr("y", -99999)
    .text(text);
  var size = container.node().getBBox();
  container.remove();
  return { width: size.width, height: size.height };
};

const surroundingTopLabel = (svg, text) => {
  return surroundingLabel(svg, text)
    .attr("font-size", topLabelFontSize)
    .attr("class", "funds-progress-text-top");
};

const surroundingBottomLabel = (svg, text) => {
  return surroundingLabel(svg, text)
    .attr("font-size", bottomLabelFontSize)
    .attr("class", "funds-progress-text-bottom");
};

const surroundingLabel = (svg, text) => {
  return svg
    .append("text")
    .text(text)
    .attr("fill", "#787E82")
    .attr("font-weight", surroundingLabelWeight);
};
