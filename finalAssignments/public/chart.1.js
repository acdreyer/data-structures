
// D3 Brushable chart function obtained from http://jsfiddle.net/HCF9x/1/


// --------------------------------------------------------------------
// --------------------------------------------------------------------
var margin = {top: 10, right: 10, bottom: 100, left: 40},
    margin2 = {top: 430, right: 10, bottom: 20, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;
    
    
    
    

// --------------------------------------------------------------------
// ------------Parsing format
var parseDate = d3.time.format("%b %Y").parse;
// var strictIsoParse = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");
// --------------------------------------------------------------------
// --------------------------------------------------------------------


// --------------------------------------------------------------------
// --------------------------------------------------------------------
// Data displayed on the chart.
var chart_data = new Array();

// Data not necessarily used on the chart.
var line_data = new Array();

var x = d3.time.scale().range([0, width]),
    x2 = d3.time.scale().range([0, width]),
    y = d3.scale.linear().range([height, 0]),
    y2 = d3.scale.linear().range([height2, 0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left");

var brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed);

var focusLine = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.price); })
    .defined(function(d) { return d.price; });

var contextLine = d3.svg.line()
    .x(function(d) { return x2(d.date); })
    .y(function(d) { return y2(d.price); })
    .defined(function(d) { return d.price; });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");




// --------------------------------------------------------------------
// Get the data from database
// --------------------------------------------------------------------

var csvdata_raw = d3.select("#csvdata").text();
var csvdata = d3.csv.parse(csvdata_raw, type);


// --------------------------------------------------------------------
// --------------------------------------------------------------------




// Split data into two separate arrays, one per line.
line_data.push(new Array());
line_data.push(new Array());
csvdata.forEach(function(d) {
  if (d.price) {
    line_data[0].push({date: d.date, price: d.price}); 
  };
  if (d.price2) {
    line_data[1].push({date: d.date, price: d.price2}); 
  };
});




// Get min and max of all dates for all the lines.
x.domain([
    d3.min(csvdata, function(d) {
        return d.date;
        
    }),
    d3.max(csvdata, function(d) {
        return d.date;
    })
]);




// Get 0 and max of all values for all the lines.
y.domain([
    0,
    d3.max(csvdata, function(d) {
        return d.price;     
    })
]);

x2.domain(x.domain());
y2.domain(y.domain());

chart_data.push(line_data[0]);
drawChart();

// document.getElementById('addLine').addEventListener('click', addSecondLine);



// --------------------------------------------------------------------
// --------------------------------------------------------------------


function drawChart() {
  svg = d3.selectAll('svg').data([chart_data]);

  updateScales();
  renderAxes();
  renderLines('focus');
  renderBrush();
}


// --------------------------------------------------------------------
// --------------------------------------------------------------------


function updateScales() {
  // Get 0 and max of all prices for all the lines.
  y.domain([
    0,
    d3.max(chart_data, function(line) {
      return d3.max(line, function(d) {
        return d.price;
      })
    })
  ]);
}


// --------------------------------------------------------------------
// --------------------------------------------------------------------


function renderAxes() {

  if (d3.select('.x.axis').empty()) {
    focus.append("g")
        .attr("class", "x axis");

    focus.append("g")
        .attr("class", "y axis");

    context.append("g")
        .attr("class", "x axis");
  };

  focus.select('.x.axis')
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  focus.select('.y.axis')
      .call(yAxis);

  context.select('.x.axis')
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);
}


// --------------------------------------------------------------------
// --------------------------------------------------------------------


// chart can be either 'focus' or 'context'.
function renderLines(chart) {
  if (chart == 'context') {
    var chartEl = context;
    var chartLine = contextLine;
  } else {
    var chartEl = focus;
    var chartLine = focusLine;
  }

  var line = chartEl.selectAll('path.line')
                    .data(chart_data);

  line.enter().append('path')
        .attr("class", "line");

  line.transition()
            .attr('d', function(d) { return chartLine(d); });

  line.exit().remove();
};


// --------------------------------------------------------------------
// --------------------------------------------------------------------

function renderBrush() {
  // So that we don't draw another brush when updating an existing chart:
  if (d3.select('g.brush').empty()) {

    renderLines('context');

    context.append("g")
        .attr("class", "x brush")
        .call(brush)
      .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);
  } else {
    renderLines('context');
  };
}


// --------------------------------------------------------------------
// --------------------------------------------------------------------


function brushed() {
  x.domain(brush.empty() ? x2.domain() : brush.extent());
  focus.selectAll("path.line").attr("d", focusLine);
  focus.select(".x.axis").call(xAxis);
}


// --------------------------------------------------------------------
// --------------------------------------------------------------------


function type(d) {
  d.date = parseDate(d.date);
  d.price = +d.price;
  d.price2 = +d.price2;
  return d;
}


// --------------------------------------------------------------------
// --------------------------------------------------------------------


function addSecondLine() {
  chart_data.push(line_data[1]);
  drawChart();
}