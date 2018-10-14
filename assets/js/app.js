// Setup constants

// These were supposed to be changed by clicking links
var qualifierVal = 0;
var horizontalVal = 0;
var verticalVal = 0;
var axisLblLen = 0;

var currentX = ["poverty", "age", "income"];
var tt_xLabel = ["Poverty: ", "Age: ", "Income: "];
var xAxisLabel = ["In Poverty (%)", "Age (Median)", "Household Income (Median)"];

var currentY = ["obesity", "smokes", "healthcare"];
var tt_yLabel = ["Obese: ", "Smokes: ", "Healthcare: "];
var yAxisLabel = ["Obese (%)", "Smokes (%)", "Lackes Healthcare (%)"];

var qualifier = ["%", "Median"]; // for toolTip
var yaxis_lable_length = [180, 270];

// Plot constant values (should be const probably)
var margin = {top: 50, right: 50, bottom: 20, left: 50};
var padding = {top: -49, right: 19, left: 0};
var svgWidth = 750;
var svgHeight = 500;
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// The svg container
var svg = d3.select("#scatter")
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .attr('class', 'svg')
    .attr("tranform", `translate( ${margin.left}, ${margin.top})`);


d3.csv('assets/data/data.csv').then(function(data){

    // This is what the onClicks should have setup
    // Setting for healthcare on y, poverty on x
    qualifierVal = 0;
    horizontalVal = 0;
    verticalVal = 2;
    axisLblLen = 0;

    showPlot(data, currentX[horizontalVal], currentY[verticalVal], tt_xLabel[horizontalVal], tt_yLabel[verticalVal],
    xAxisLabel[horizontalVal], yAxisLabel[verticalVal], qualifier[qualifierVal], yaxis_lable_length[axisLblLen]); 

});

function showPlot(data, currentX, currentY, tt_xLabel, tt_yLabel, xAxisLabel, yAxisLabel, qualifier, yaxis_lable_length) {

    // Pull out x and y values
    var xValues  = data.map(d => parseFloat(d[currentX]));
    var yValues  = data.map(d => parseFloat(d[currentY])); 

    // The x and y scales (converts number values to pixels)
    var xScale = d3.scaleLinear()
              // .domain([d3.min(data, function (d) { return parseFloat(d.poverty); }), 
              //   d3.max(data, function (d) { return parseFloat(d.poverty); })]).nice()
            .domain(d3.extent(xValues)).nice()
            .range([margin.right, width+margin.right]);

    var yScale = d3.scaleLinear()
              // .domain([d3.min(data, function (d) { return parseFloat(d.healthcare); }), 
              //   d3.max(data, function (d) { return parseFloat(d.healthcare); })])
            .domain(d3.extent(yValues)).nice()
            .range([height-40, margin.top]);

    // The container where the plotting lives
    var main = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('width', width)
        .attr('height', height)
        .attr('class', 'main');   

    // Create axis functions
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);


    // Create and place yAxis
    main.append("g")
            .attr("class", "xAxis")
            .attr("transform", `translate(${padding.top},  ${height - margin.bottom})`)
            .call(xAxis);

    // Create and place xAxis
    main.append("g")
            .attr("class", "yAxis")
            .attr("transform", `translate(${padding.left}, ${padding.right})`)
            .call(yAxis);

    // Create the state circles
    circlesGroup = main.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return xScale(d[currentX]); })
        .attr("cy", function(d) { return yScale(d[currentY]); })
        .attr("r", 10)
        .attr('class', 'stateCircle')
        .attr("transform", `translate(${0-margin.left}, ${padding.right})`);

    //Add the state abbr text to the circles
    circlesTextGroup = main.append("g")
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", function(d) { return xScale(d[currentX]); })
        .attr("y", function(d) { return yScale(d[currentY])+4; })
        .text( function (d) { return d.abbr; })
        .attr('class', 'stateText')
        .attr("font-size", "10px")
        .attr("transform", `translate(${-margin.left}, ${padding.right})`);

    // yAxis label
    svg.append("text")
        .text(yAxisLabel)
        .attr("transform", "translate("+ (margin.left/3) +","+ (height-(yaxis_lable_length/2)) +")rotate(-90)")
        .attr("class", "y_label")
        .attr("font-size", "14px")
        .attr("font-weight", "bold");

    // xAxis label
    svg.append("text")
        .text(xAxisLabel)
        .attr("transform", "translate("+ (width/2) +","+ (svgHeight-(margin.bottom/3)) +")")
        .attr("class", "x_label")
        .attr("font-size", "14px")
        .attr("font-weight", "bold");


    // Define the Tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) { return (`${d.state}<br>${tt_xLabel} ${d[currentX]}${qualifier}<br>${tt_yLabel} ${d[currentY]}${qualifier}`);
    });

    // Create the tooltip in svg
    svg.call(toolTip);

    // Create "mouseover" event listener to display tooltip
    circlesTextGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
    })
    // Step 4: Create "mouseout" event listener to hide tooltip
    .on("mouseout", function(d) {
        toolTip.hide(d);
    });
};




