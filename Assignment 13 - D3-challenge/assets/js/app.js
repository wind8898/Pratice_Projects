
// create a scatter plot between Healthcare vs. Poverty

// step 1: Set up our chart

var svgWidth = 600;
var svgHeight = 500;

var margin = {
    top: 40,
    right: 40,
    bottom: 100,
    left: 100
    };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper
var svg = d3.select(".plot1")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

//	Step 3: Import data from the donuts.csv file

d3.csv('/assets/data/data.csv').then(function(data){
    console.log(data);

// 	Step 4: Parse the data
    data.forEach( d => {
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
        d.abbr = d.abbr;
    });

// 	Step 5: Create Scales
var xLinearScale = d3.scaleLinear()
                        .domain([5, d3.max(data, d => d.poverty)])
                        .range([0, width]);

var yLinearScale = d3.scaleLinear()
                        .domain([0, d3.max(data, d => d.healthcare)])
                        .range([height, 0]);

// 	Step 6: Create Axes

var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// 	Step 7: Append the axes to the chartGroup

chartGroup.append("g")
.attr("transform", `translate(0, ${height})`)
.call(bottomAxis);

chartGroup.append("g")
.call(leftAxis);

//  Step 8: create circle and append to chart
var circlesGroup = chartGroup.selectAll("circle")
.data(data)
.enter()
.append("circle")
.classed('stateCircle', true)
.attr("cx", d => xLinearScale(d.poverty))
.attr("cy", d => yLinearScale(d.healthcare))
.attr("r", "10")
.attr("opacity", ".7");


// Step 9: display states for each circle 
  /* Create the text for each block */
  var circletextgroup = chartGroup.selectAll()
  .data(data)
  .enter()
  .append("text")
  .classed('stateText', true)
  .attr("x", d => xLinearScale(d.poverty))
  .attr("y", d => yLinearScale(d.healthcare))
  .style("font-size", "6")
  .style("text-anchor", "middle")
  .style('fill', 'black')
  .text(d => (d.abbr));


//   Step 10: Create tooltip
circlesGroup.on("mouseover", function() {
    d3.select(this)
        .transition()
        .duration(500)
        .attr("r", "15")
        .attr("fill", "red");
})
    .on("click", function(d) {
        toolTip.show(d, this);
    })

    .on("mouseout", function() {
        d3.select(this)
        .transition()
        .duration(500)
        .attr("r", "10")
        toolTip.hide()
    });

//  Step 11: Create axes labels
        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "aText")
        .text("Lacks Healthcare (%)");
  
      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
        .attr("class", "aText")
        .text("In Poverty (%)");

})

