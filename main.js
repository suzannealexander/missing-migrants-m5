// First chart
const margin = { top: 20, right: 150, bottom: 50, left: 60 };
const w = 600;
const h = 300;

// Second chart (Cause of Death)
const barMargin = { top: 20, right: 150, bottom: 50, left: 60 };
const barWidth = 600;
const barHeight = 300;

// Keyframe
let keyframes = [
    {
        activeVerse: 1,
        activeLines: [1],
        svgUpdate: null
    },
    {
        activeVerse: 1,
        activeLines: [2],
        svgUpdate: null
    },
    {
        activeVerse: 1,
        activeLines: [3],
        svgUpdate: null
    },
    {
        activeVerse: 1,
        activeLines: [4],
        svgUpdate: null
    },
    {
        activeVerse: 2,
        activeLines: [1],
        svgUpdate: null
    },
    {
        activeVerse: 2,
        activeLines: [2],
        svgUpdate: null
    },
    {
        activeVerse: 2,
        activeLines: [3],
        svgUpdate: null
    },
    {
        activeVerse: 2,
        activeLines: [4],
        svgUpdate: null
    },
    {
        activeVerse: 3,
        activeLines: [1],
        svgUpdate: null
    },
    {
        activeVerse: 3,
        activeLines: [2],
        svgUpdate: null
    },
    {
        activeVerse: 3,
        activeLines: [3],
        svgUpdate: null
    },
    {
        activeVerse: 3,
        activeLines: [4],
        svgUpdate: null
    },
    {
        activeVerse: 4,
        activeLines: [1],
        svgUpdate: null
    },
    {
        activeVerse: 4,
        activeLines: [2],
        svgUpdate: null
    },
    {
        activeVerse: 4,
        activeLines: [3],
        svgUpdate: null
    },
    {
        activeVerse: 4,
        activeLines: [4],
        svgUpdate: null
    },
    {
        activeVerse: 5,
        activeLines: [1],
        svgUpdate: null
    },
    {
        activeVerse: 5,
        activeLines: [2],
        svgUpdate: null
    },
    {
        activeVerse: 5,
        activeLines: [3],
        svgUpdate: null
    },
    {
        activeVerse: 5,
        activeLines: [4],
        svgUpdate: null
    }
];

let keyframeIndex = 0;

// svg
let svg = d3.select("#svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// second svg
let barSvg = d3.select("#causeOfDeathSvg")
    .attr("width", barWidth + barMargin.left + barMargin.right)
    .attr("height", barHeight + barMargin.top + barMargin.bottom)
    .append("g")
    .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")");

// load data and make graph
d3.csv('us_data.csv')
    .then(function (data) {
        data.forEach(d => {
            d.Reported_Year = d['Reported Year'];
            d.Number_Dead = d['Number Dead'] ? +d['Number Dead'] : 0;
            d.Minimum_Estimated_Number_of_Missing = d['Minimum Estimated Number of Missing'] ? +d['Minimum Estimated Number of Missing'] : 0;
            d.Cause_of_Death = d['Cause of Death'];
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

        const xScale = d3.scaleBand()// x axis based on years
            .domain(totals.map(d => d.year))
            .range([0, w])
            .padding(0.1);

        const yScale = d3.scaleLinear()
        .domain([0, d3.max(totals, d => Math.max(d.totalDead, d.totalMissing))]) // setting max value of y-axis for max of either totalDead or totalMissing            .nice()
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

        // preprocessing cause of death data
        // cause of death categories
        const causeCategories = {
            'Drowning': 0,
            'Violence': 0,
            'Exposure/Dehydration': 0,
            'Vehicle Accident': 0,
            'Disease/Illness': 0,
            'Unknown': 0,
            'Other': 0
        };

        // count cause of death category
        data.forEach(d => {
            const cause = d.Cause_of_Death;
            if (!cause) {
                causeCategories['Unknown']++;
                return;
            }
            
            const lowerCause = cause.toLowerCase();
            
            if (lowerCause.includes('drown')) {
                causeCategories['Drowning']++;
            } else if (lowerCause.includes('dehydration') || lowerCause.includes('exposure') || 
                      lowerCause.includes('heat') || lowerCause.includes('thirst')) {
                causeCategories['Exposure/Dehydration']++;
            } else if (lowerCause.includes('violen') || lowerCause.includes('kill') || 
                      lowerCause.includes('shot') || lowerCause.includes('murder') || 
                      lowerCause.includes('wound') || lowerCause.includes('gun')) {
                causeCategories['Violence']++;
            } else if (lowerCause.includes('vehicle') || lowerCause.includes('car') || 
                      lowerCause.includes('crash') || lowerCause.includes('accident')) {
                causeCategories['Vehicle Accident']++;
            } else if (lowerCause.includes('disease') || lowerCause.includes('illness') || 
                      lowerCause.includes('sick') || lowerCause.includes('health')) {
                causeCategories['Disease/Illness']++;
            } else if (lowerCause.includes('unknown') || lowerCause.includes('undetermined')) {
                causeCategories['Unknown']++;
            } else {
                causeCategories['Other']++;
            }
        });

        // data for bar chart
        const barData = Object.entries(causeCategories)
            .map(([category, count]) => ({ category, count }))
            .filter(d => d.count > 0)
            .sort((a, b) => b.count - a.count);

        // adding the x-axis
        const xBarScale = d3.scaleBand()
            .domain(barData.map(d => d.category))
            .range([0, barWidth])
            .padding(0.1);

        // adding the y-axis
        const yBarScale = d3.scaleLinear()
            .domain([0, d3.max(barData, d => d.count)])
            .nice()
            .range([barHeight, 0]);

        // color scale
        const colorScale = d3.scaleOrdinal()
            .domain(barData.map(d => d.category))
            .range(d3.schemeCategory10);

        // drawing bar chart
        barSvg.selectAll(".bar")
            .data(barData)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => xBarScale(d.category))
            .attr("y", d => yBarScale(d.count))
            .attr("width", xBarScale.bandwidth())
            .attr("height", d => barHeight - yBarScale(d.count))
            .attr("fill", d => colorScale(d.category));

        // adding the x-axis
        barSvg.append("g")
            .attr("transform", `translate(0, ${barHeight})`)
            .call(d3.axisBottom(xBarScale))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em");

        // adding the y-axis
        barSvg.append("g")
            .call(d3.axisLeft(yBarScale));

        // adding a label
        barSvg.append("text")
            .attr("x", barWidth / 2)
            .attr("y", barHeight + 90)
            .attr("text-anchor", "middle")
            .text("Cause of Death");

        barSvg.append("text")
            .attr("x", -barHeight / 2)
            .attr("y", -40)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Frequency");
    })


// drawing key frame
function drawKeyframe(kfi) {
    const kf = keyframes[kfi];
    

    resetActiveLines();
    
 // active verse update
    updateActiveVerse(kf.activeVerse);
    
    for (const line of kf.activeLines) {
        updateActiveLine(kf.activeVerse, line);
    }
}

function resetActiveLines() {
    d3.selectAll(".line").classed("active-line", false);
}

// update active verse
function updateActiveVerse(id) {
    // clear updated verse
    d3.selectAll(".verse").classed("active-verse", false);
    
    // active selected verse
    d3.select("#verse" + id).classed("active-verse", true);
    
    // scroll
    scrollToVerse(id);
}

// Acitve line
function updateActiveLine(vid, lid) {
    const thisVerse = d3.select("#verse" + vid);
    thisVerse.select("#line" + lid).classed("active-line", true);
}

// Scroll to specific verse
function scrollToVerse(id) {
    const activeVerse = document.getElementById("verse" + id);
    if (activeVerse) {
        activeVerse.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// button click foward
function forwardClicked() {
    if (keyframeIndex < keyframes.length - 1) {
        keyframeIndex++;
        drawKeyframe(keyframeIndex);
    }
}

// button click backward
function backwardClicked() {
    if (keyframeIndex > 0) {
        keyframeIndex--;
        drawKeyframe(keyframeIndex);
    }
}

// event listner
document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("backward-button").addEventListener("click", backwardClicked);
    document.getElementById("forward-button").addEventListener("click", forwardClicked);
    

    drawKeyframe(keyframeIndex);
});