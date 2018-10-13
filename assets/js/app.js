d3.csv('assets/data/data.csv')
  .then(function(data) {
    console.log(data);

    var currentX = "poverty";
    var currentY = "healthcare";
    var xLabel = 'Poverty: ';
    var yLabel = 'Healthcare: ';
    var percent_label = '%';

    // Plot constant values (should be const)
    var margin = {top: 50, right: 50, bottom: 20, left: 50};
    var padding = {top: -49, right: 19, left: 0};
    var svgWidth = 750;
    var svgHeight = 500;
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

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


    // The svg container
    var svg = d3.select("#scatter")
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .attr('class', 'svg')
        .attr("tranform", `translate( ${margin.left}, ${margin.top})`);

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
    circlesGrp = main.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return xScale(d[currentX]); })
        .attr("cy", function(d) { return yScale(d[currentY]); })
        .attr("r", 10)
        .attr('class', 'stateCircle')
        .attr("transform", `translate(${-margin.left}, ${padding.right})`);

    //Add the state abbr text to the circles
    main.append("g")
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", function(d) { return xScale(d[currentX]); })
        .attr("y", function(d) { return yScale(d[currentY]) + 4; })
        .text( function (d) { return d.abbr; })
        .attr('class', 'stateText')
        .attr("font-size", "10px")
        .attr("transform", `translate(${-margin.left}, ${padding.right})`);

    // yAxis label
    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (0) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .attr("class", "y_label")
        .text("Lacks Heathcare (%)");

    // xAxis label
    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (width/2) +","+(500)+")")  // centre below axis
        .attr("class", "x_label")
        .text("In Poverty (%)");


    // Define the Tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) { return (`${d.state}<br>${xLabel} ${d[currentX]}${percent_label}<br>${yLabel} ${d[currentY]}${percent_label}`);
    });

    // Create the tooltip in svg
    svg.call(toolTip);

    // Create "mouseover" event listener to display tooltip
    circlesGrp.on("mouseover", function(d) {
        toolTip.show(d, this);
    })
    // Step 4: Create "mouseout" event listener to hide tooltip
    .on("mouseout", function(d) {
        toolTip.hide(d);
    });


});
