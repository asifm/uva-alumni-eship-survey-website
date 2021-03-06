var tooltip = d3.select("body")
    .append("div")
    .attr("class", "map-tooltip")
    .style("position", "absolute")

var w = 800,
    h = 600;

var va_lon_lat = [-78.169968, 37.769335];

var svg = d3.select("#outstate")
    .append("svg")
    .attr("width", w)
    .attr("height", h)

var wScale = d3.scale.linear()
    .domain([1, 77])
    .range([1, 15]);

var cScale = d3.scale.linear()
    .domain([1, 77])
    .range(['#FFE4E4', '#FC0000'])

var projection = d3.geo.albersUsa()
    .translate([w / 2, h / 2])
    .scale([1000]);

var path = d3.geo.path()
    .projection(projection);

d3.json("data/us-states.json", function(json) {
    d3.csv("data/outstate_va.csv", function(data) {
        var data_len = data.length;
        var json_len = json.features.length;

        for (var i = 0; i < data_len; i++) {
            for (var j = 0; j < json_len; j++) {
                if (data[i].state == json.features[j].properties.name) {
                    json.features[j].properties.value = +data[i].value;
                }
            }
        }
        svg.selectAll("line")
            .data(data)
            .enter()
            .append("line")
            .classed("outstate_line", true)
            .style("opacity", "0.6")
            .attr("stroke-width", function(d) {
                return wScale(d.value);
            })
            .attr("x1", function(d) {
                return projection([d.lon_state, d.lat_state])[0];
            })
            .attr("y1", function(d) {
                return projection([d.lon_state, d.lat_state])[1];
            })
            .attr("x2", function(d) {
                return projection(va_lon_lat)[0];
            })
            .attr("y2", function(d) {
                return projection(va_lon_lat)[1];
            })

        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .classed("state", function(d) {
                if (d.properties.name === "Virginia") {
                    return false
                } else {
                    return true
                }
            })
            .attr("fill", "steelblue")
            .attr("stroke", "black")
            .classed("oustate", true)
            .on("mouseenter", function(d) {
                if (d.properties.value) {
                    name = d.properties.name;
                    value = d.properties.value;
                    tooltip.html(name + " <b>" + value + "</b>")
                        .style("left", (d3.event.pageX - 15) + "px")
                        .style("top", (d3.event.pageY + 50) + "px")
                        .style("opacity", 1)
                }
            })
            .on("mouseleave", function(d) {
                tooltip
                    .style("opacity", 0);
            })

    });

});
