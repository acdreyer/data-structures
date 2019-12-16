// D3 Brushable chart function obtained from http://jsfiddle.net/HCF9x/1/







// 2019-12-14 20:21:44.888897
var count = 0; //query counter for testing
var tempdatatable; // table to store all tempsensor data
// var parseDate = d3.time.format(" %Y-%m-%d%%H:%M:%S.%f").parse;
var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S.%L").parse;

// var parseDate = d3.timeParse("%Y-%m-%d_%H:%M:%S.%f").parse;

// Call the function when the page loads (not bound to eventlistener)
getdata("day", "one")




// --------------------------------------------------------------------
// --------------------------------------------------------------------
var margin = { top: 10, right: 10, bottom: 100, left: 40 },
  margin2 = { top: 380, right: 10, bottom: 20, left: 40 },
  width = 960 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom,
  height2 = 450 - margin2.top - margin2.bottom;

var svg = d3.select("#graph").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);




// <!------------------------------------------------------------->
// get the data from the server and update datatable
function getdata(period, whichsensor) {

  //get the data
  $.get('/sensor', { duration: period, sensortype: whichsensor }, function(data) {
    console.log(data)
    tempdatatable = data;
    count++;
    $('#datapointcount').html("Total of <strong> " + count + " </strong> requests")

    var csvdata = d3.csv.parse(tempdatatable, type);
    // console.log(csvdata)

    // <!------------------------------------------------------------->






    // --------------------------------------------------------------------
    // ------------Parsing format - 2019-12-14 17:44:44.906495,26.5
    // var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S.%L").parse;
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
      .x(function(d) { return x(d.date_time); })
      .y(function(d) { return y(d.temp1); })
      .defined(function(d) { return d.temp1; });

    var contextLine = d3.svg.line()
      .x(function(d) { return x2(d.date_time); })
      .y(function(d) { return y2(d.temp1); })
      .defined(function(d) { return d.temp1; });

    // d3.select("body").remove("svg");


    // --------------------------

    svg.selectAll("*").remove();
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

    // var csvdata_raw = d3.select("#csvdata").text();
    // var csvdata = d3.csv.parse(csvdata_raw, type);
    // var csvdata = d3.csv.parse(tempdatatable, type);


    // --------------------------------------------------------------------
    // --------------------------------------------------------------------




    // Split data into two separate arrays, one per line.
    line_data.push(new Array());
    line_data.push(new Array());
    line_data.push(new Array());
    csvdata.forEach(function(d) {
      if (d.temp1) {
        line_data[0].push({ date_time: d.date_time, temp1: d.temp1 });
      };
      if (d.temp2) {
        line_data[1].push({ date_time: d.date_time, temp1: d.temp2 * 2 });
      };
      if (d.temp3) {
        line_data[2].push({ date_time: d.date_time, temp1: d.temp3 * 2 });
      };
    });





    // Get min and max of all dates for all the lines.
    x.domain([
      d3.min(csvdata, function(d) {
        return d.date_time;

      }),
      d3.max(csvdata, function(d) {
        return d.date_time;
      })
    ]);




    // Get 0 and max of all values for all the lines.
    y.domain([
      0,
      d3.max(csvdata, function(d) {
        return d.temp1;
      })
    ]);

    x2.domain(x.domain());
    y2.domain(y.domain());

    chart_data.push(line_data[0]);
    chart_data.push(line_data[1]);
    chart_data.push(line_data[2]);
    console.log(chart_data)
    drawChart();

    // document.getElementById('addLine').addEventListener('click', addSecondLine);



    // --------------------------------------------------------------------
    // --------------------------------------------------------------------


    function drawChart() {
      svg = d3.selectAll('svg').data([chart_data]);

      updateScales();
      renderAxes();
      yaxislabel();
      legend();
      renderLines('focus');
      renderBrush();
    }


    // --------------------------------------------------------------------
    // --------------------------------------------------------------------

    function yaxislabel() {
      svg.append("text")
        .attr("class", "y label")
        // .attr("transform", "translate(100px,100px)")
        .attr("text-anchor", "end")
        .attr("font-size", "1.2em")
        .attr("y", 0)
        .attr("x", -120)
        .attr("dy", "1.0em")
        .attr("transform", "rotate(-90)")
        .text("Temperature (°C)");
    }


    function legend() {

      // select the svg area
      d3.select("#legend").selectAll("*").remove();
      var svg = d3.select("#legend").append("svg")
      var cx = 100;
      var cy = 30;

      if (whichsensor == "all") {
        // Handmade legend
        svg.append("circle").attr("cx", cx).attr("cy", cy).attr("r", 3).style("fill", "red")
        svg.append("circle").attr("cx", cx).attr("cy", cy + 30).attr("r", 3).style("fill", "blue")
        svg.append("circle").attr("cx", cx).attr("cy", cy + 60).attr("r", 3).style("fill", "green")
        svg.append("text").attr("x", cx + 20).attr("y", cy).text("Temperature (°C)").style("font-size", "12px").attr("alignment-baseline", "middle")
        svg.append("text").attr("x", cx + 20).attr("y", cy + 30).text("Window O/C (Unitless)").style("font-size", "12px").attr("alignment-baseline", "middle")
        svg.append("text").attr("x", cx + 20).attr("y", cy + 60).text("Light intensity (Unitless)").style("font-size", "12px").attr("alignment-baseline", "middle")
      }
    }



    function updateScales() {
      // Get 0 and max of all temps for all the lines.
      y.domain([
        0,
        d3.max(chart_data, function(line) {
          return d3.max(line, function(d) {
            return d.temp1;
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
      }
      else {
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
      }
      else {
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
      // console.log(d.date_time.slice(0,-3));
      d.date_time = d3.time.format.utc("%Y-%m-%d %H:%M:%S.%L").parse(d.date_time.slice(0, -3).trim());
      // console.log(d3.time.format("%Y-%m-%d %H:%M:%S.%L").parse(d.date_time.slice(0,-3).trim()));
      // console.log(d3.time.format("%Y-%m-%d %H:%M:%S.%L").parse("2019-12-14 20:21:44.888"));
      // d.date_time = d.date_time.trim();
      d.temp1 = +d.temp1;

      if (d.temp2) {
        d.temp2 = +d.temp2;
      }
      if (d.temp3) {
        d.temp3 = +d.temp3;
      }

      if (d.date_time != null) {
        return d;
      }
    }


    // --------------------------------------------------------------------
    // --------------------------------------------------------------------





  });

}

// function addSecondLine() {
//   chart_data.push(line_data[1]);
//   drawChart();
// }
