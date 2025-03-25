const margin = { top: 20, right: 150, bottom: 50, left: 60 };
const w = 1000;

const h = 500;



let svg = d3.select("#missing-viz")
    .append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv('./data/us_data.csv')
    .then(function (data) {
        data.forEach(d => {
            d.Reported_Year = d['Reported Year'];
            d.Number_Dead = d['Number Dead'] ? +d['Number Dead'] : 0;
            d.Minimum_Estimated_Number_of_Missing = d['Minimum Estimated Number of Missing'] ? +d['Minimum Estimated Number of Missing'] : 0;
        });

        // grouping the data by year
        const totalByYear = d3.group(data, d => d.Reported_Year);

        // summing the totals for 'Number Dead' and 'Minimum Estimated Number of Missing' by year
        const totals = Array.from(totalByYear, ([year, records]) => {
            const totalDead = d3.sum(records, d => d.Number_Dead);
            const totalMissing = d3.sum(records, d => d.Minimum_Estimated_Number_of_Missing);
            return {
                year: year,
                totalDead: totalDead,
                totalMissing: totalMissing
            };
        });

        // sorting years in chronological order
        totals.sort((a,b) => +a.year - +b.year);

        const xScale = d3.scaleBand()
            .domain(totals.map(d => d.year)) // x axis based on years
            .range([0, w])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(totals, d => Math.max(d.totalDead, d.totalMissing))]) // setting max value of y-axis for max of either totalDead or totalMissing
            .nice()
            .range([h, 0]);

        // appending the bars for totalDead
        svg.selectAll(".barDead")
            .data(totals)
            .enter().append("rect")
            .attr("class", "barDead")
            .attr("x", d => xScale(d.year))
            .attr("y", d => yScale(d.totalDead))
            .attr("width", xScale.bandwidth() / 2)
            .attr("height", d => h - yScale(d.totalDead))
            .attr("fill", "steelblue");

        // appending the bars for totalMissing
        svg.selectAll(".barMissing")
            .data(totals)
            .enter().append("rect")
            .attr("class", "barMissing")
            .attr("x", d => xScale(d.year) + xScale.bandwidth() / 2)
            .attr("y", d => yScale(d.totalMissing))
            .attr("width", xScale.bandwidth() / 2)
            .attr("height", d => h - yScale(d.totalMissing))
            .attr("fill", "orange");

        // adding the x-axis
        svg.append("g")
            .attr("transform", `translate(0, ${h})`)
            .call(d3.axisBottom(xScale).ticks(totals.length));

        // adding the y-axis
        svg.append("g")
            .call(d3.axisLeft(yScale));

        // adding axis labels
        svg.append("text")
            .attr("x", w / 2)
            .attr("y", h + 40)
            .attr("text-anchor", "middle")
            .text("Year");

        svg.append("text")
            .attr("x", -h / 2)
            .attr("y", -40)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Frequency");

        // adding a legend
        svg.append("rect")
            .attr("x", w + 20)
            .attr("y", 20)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", "steelblue");
            
        svg.append("text")
            .attr("x", w + 50)
            .attr("y", 35)
            .text("Total Dead");

        svg.append("rect")
            .attr("x", w + 20)
            .attr("y", 50)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", "orange");
        svg.append("text")
            .attr("x", w + 50)
            .attr("y", 65)
            .text("Total Missing");
    })


document.getElementById("display-next-page-button").addEventListener("click", function() {displayNextPage(); })

function displayNextPage(){
    console.log("next page button clicked")
}



// https://d3js.org/d3-array/group
// https://www.tutorialsteacher.com/d3js/create-bar-chart-using-d3js
// https://observablehq.com/@d3/grouped-bar-chart/2