function draw_chart_which_alumni(param) {
  var width = param.w - param.margin.left - param.margin.right; // width of the chart
  var filtered_data;
  var percent = d3.format(".0%");
  var y = d3.scale.ordinal();

  var x = d3.scale.linear()
    .range([0, width])

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(5, "%")
    .tickFormat(percent);

  filtered_data = param.data.filter(function(d) {
    return d.kind == param.kind;
  })

  if (param.kind !== "demog") {
    filtered_data.sort(function(a, b) {
      return a.freq_ent - b.freq_ent;
    })
  }

  var height = filtered_data.length * 40 - param.margin.top - param.margin.bottom;

  var svg = d3.select(param.id)
    .append("svg")
    .attr("width", width + param.margin.left + param.margin.right)
    .attr("height", height + param.margin.top + param.margin.bottom)

  var chart = svg.append("g")
    .attr("transform", "translate(" + param.margin.left + "," + param.margin.top + ")")

  x.domain([0, d3.max(filtered_data.map(function(d) {
    return d3.max([d.freq_ent, d.freq_nent]);
  }))]);

  y.rangeRoundBands([0, height], .8, .1);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  y.domain(filtered_data.map(function(d) {
    return d.name;
  }))

  chart.append("g")
    .classed("x axis", true)
    .attr("transform", "translate(0, " + height + ")")
    .call(xAxis);

  chart.append("g")
    .classed("y axis", true)
    .call(yAxis)

  function render_bars(elements_to_select, class_to_apply, data_to_select) {

    var group = chart.selectAll(elements_to_select)
      .data(filtered_data)
      .enter().append("g")

    group.append("line")
      .classed(class_to_apply, true)
      .classed("line-inside-chart", true)
      .attr("x1", "0")
      .attr("y1", function(d) {
        if (data_to_select === "freq_ent")
          return y(d.name);
        else
          return y(d.name) + 10;
      })
      .attr("x2", function(d) {
        return x(d[data_to_select]);
      })
      .attr("y2", function(d) {
        if (data_to_select === "freq_ent")
          return y(d.name);
        else
          return y(d.name) + 10;
      })


    svg.on("mouseenter", function() {
        d3.selectAll(param.id + " .text-on-bar")
          .transition()
          // .duration(500)
          .style("opacity", 1)
      })
      .on("mouseleave", function() {
        d3.selectAll(param.id + " .text-on-bar")
          .transition()
          // .duration(500)
          .style("opacity", 0)
      })

    group.append("text")
      .attr("class", "text-on-bar")
      .attr("x", function(d) {
        return x(d[data_to_select]);
      })
      .attr("dx", ".4em")
      .attr("y", function(d) {
        if (data_to_select == "freq_ent")
          return y(d.name) - 9;
        else
          return y(d.name) + y.rangeBand() / 2;
      })
      .attr("dy", "1.2em")
      .text(function(d) {
        return percent(d[data_to_select]);
      })
      .style("opacity", 0)

  }
  render_bars("g .ent", "ent", "freq_ent")
  render_bars("g .nent", "nent", "freq_nent")
}


function type(d) {
  d.freq_ent = +d.freq_ent;
  d.freq_nent = +d.freq_nent;
  return d;
}

d3.csv("data/ent_vs_nent.csv", type, function(error, data) {

  draw_chart_which_alumni({
    data: data,
    id: "#experience",
    kind: "experience",
    w: 600,
    margin: {
      top: 0,
      right: 30,
      bottom: 20,
      left: 420
    }
  });
  draw_chart_which_alumni({
    data: data,
    id: "#field",
    kind: "field",
    w: 500,
    margin: {
      top: 0,
      right: 30,
      bottom: 20,
      left: 150
    }
  });

  draw_chart_which_alumni({
    data: data,
    id: "#degree",
    kind: "degree",
    w: 500,
    margin: {
      top: 0,
      right: 30,
      bottom: 20,
      left: 70
    }
  });

  draw_chart_which_alumni({
    data: data,
    id: "#demog",
    kind: "demog",
    w: 400,
    margin: {
      top: 0,
      right: 30,
      bottom: 20,
      left: 200
    }
  });

  legend_data = ["% of Entrepreneurial Alumni", "% of Non-entrepreneurial Alumni"]
  legendColor = d3.scale.ordinal().domain(legend_data).range(["#235281", "#adc1cd"])

  legends = d3.select("#which-alum-legends").append("svg").attr("width", 600).attr("height", 30).selectAll("g .legends").data(legend_data).enter().append("g").classed("legends", true).attr("transform", function(d, i) {
    return "translate(" + (i * 300) + ", " + "0" + ")";
  });
  legends.append("rect").attr("x", 0).attr("y", 0).attr("width", 300).attr("height", 30).style("fill", function(d) {
    return legendColor(d);
  });
  legends.append("text").attr("text-anchor", "middle").attr("x", 150).attr("y", 15).attr("dy", ".3em")
    .style("fill", function (d, i) {
      if (i === 1) {
        return "black";
      }
      return"white";
    })
    .text(function(d) {
      return d;
    });
});
