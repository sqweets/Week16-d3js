d3.csv('assets/data/data.csv')
  .then(function(data) {
    console.log(data);

    var margin = {top: 20, right: 20, bottom: 20, left: 20};
    var svgWidth = 900;
    var svgHeight = 600;
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    var xScale = d3.scaleLinear()
              .domain([d3.min(data, function (d) { return parseFloat(d.poverty); }), 
                d3.max(data, function (d) { return parseFloat(d.poverty); })])
              .range([0, svgWidth]);

    var yScale = d3.scaleLinear()
              .domain([d3.min(data, function (d) { return parseFloat(d.healthcare); }), 
                d3.max(data, function (d) { return parseFloat(d.healthcare); })])
              .range([svgHeight, 0]);

    var chart = d3.select("#scatter")
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .attr('class', 'chart');

    var main = chart.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'main');   

    // Create axis functions
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // Place x axis
    main.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .attr('class', 'main axis poverty')
    .call(xAxis);

    // Place y axis
    main.append('g')
    .attr('transform', 'translate(0,0)')
    .attr('class', 'main axis healthcare')
    .call(yAxis);

    main.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return xScale(d.poverty) })
        .attr("cy", function(d) { return yScale(d.healthcare) })
        .attr("r", 8)
        .attr('class', 'stateCircle');

})
