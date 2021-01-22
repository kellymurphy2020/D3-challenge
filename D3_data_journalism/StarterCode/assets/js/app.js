//Set variables for Total SVG Dimensions
const svgWidth = 860;
const svgHeight = 600;

//Set variables for SVG margins
const chartMargin = {
    top: 30,
    right: 30,
    bottom: 75,
    left: 105
};

//Calculate SVG chart dimensions
const width = svgWidth - chartMargin.left - chartMargin.right;
const height = svgHeight - chartMargin.top - chartMargin.bottom;

//Create SVG for the chart
let svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("class", "chart");

//Create SVG for the group chart
const chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Set radius

//Load the CSV
d3.csv("assets/data/data.csv").then(function (Jdata) {


    //console.log(Jdata);

    //Parse through CSV and convert data to numbers
    Jdata.forEach(function (data) {
        data.income = +data.income;
        data.obesity = +data.obesity;
        //Pull the additional data (part2)
        data.age = +data.age;
        data.smokes = +data.smokes;
        data.state = +data.state;
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    //Create variables for the scales
    const xIncome = d3.scaleLinear()
        .domain([35000, d3.max(Jdata, d => d.income)])
        .range([0, width]);

    const yObesity = d3.scaleLinear()
        .domain([20, d3.max(Jdata, d => d.obesity)])
        .range([height, 0]);

    //Set axes variables using variables for the scale
    let xAxis = d3.axisBottom(xIncome);
    let yAxis = d3.axisLeft(yObesity);

    //Append axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    chartGroup.append("g")
        .call(yAxis);


    //Create a circle plot
    let circle = chartGroup.selectAll("circle")
        .data(Jdata)
        .enter()
        .append("circle")
        .attr("cx", d => xIncome(d.income))
        .attr("cy", (d, i) => { console.log(i); return yObesity(d.obesity) })
        .attr("r", "15")
        .attr("fill", "teal")
        .attr("stroke", "black")
        .attr("stroke-width", "3")
        .attr("opacity", ".75");

    //Initialize d3 tool tip with event listeners to displayor hide tooltip
    let tool_tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-8, 10])
        .html((d) => { return d.abbr; });
    svg.call(tool_tip);

    circle.on("mouseover", function (data) {
        tool_tip.show(data, this);
    })
        //Create 'onmouseout' event
        .on("mouseout", function (data) {
            tool_tip.hide(data);
        });


    //Label the bubbles
    let text = chartGroup.selectAll(".chart")
        .data(Jdata)
        .enter()
        .append("text")
        .classed("", true);

    let textLabels = text.attr("x", d => xIncome(d.income))
        .attr("y", d => yObesity(d.obesity))
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .text((d, i) => { console.log(i); return d.abbr; });

    //Label the axes
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .attr("font-weight", "bold")
        .text("Income ($)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + chartMargin.top + 30})`)
        .attr("class", "axisText")
        .attr("font-weight", "bold")
        .text("Obesity (BMI)");
}).catch(function (error) {
    console.log(error);


});