//JS for Audio
const musicIcon = document.getElementById("music");
const audioElement = document.getElementById("bg-music");

musicIcon.addEventListener("click", function() {
    if (audioElement.paused) {
        audioElement.play();
        musicIcon.src = "images/musical-note.png";
    } else {
        audioElement.pause();
        musicIcon.src = "images/volume-mute.png";
    }});
//-----------------------------------------------------------------------------------

//JS for AI images

// we need to track the images we will use for this vis display 

const images = ["images/horizon.png", "images/cod1.png"];
let currentIndex = 0;

function updateImage(){
    document.getElementById("horizon").src = images[currentIndex];
}
function prevImage(){
    currentIndex = (currentIndex - 1) % images.length;
    updateImage();
}

function nextImage(){
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
}
//-----------------------------------------------------------------------------------

// First chart (Missing by Year)
const margin = { top: 20, right: 15, bottom: 50, left: 60 };
const w = 310;
const h = 250;
let totals = [];

// Second chart (Cause of Death)
const barMargin = { top: 20, right: 15, bottom: 50, left: 60 };
const barWidth = 310;
const barHeight = 250;

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
        svgUpdate: updateDrowningColor
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
        svgUpdate: updateViolenceColor
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
        svgUpdate: updateVehicleAccidentColor
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
        svgUpdate: updateDiseaseColor
    },
    {
        activeVerse: 4,
        activeLines: [4],
        svgUpdate: null
    },
    {
        activeVerse: 5,
        activeLines: [1],
        svgUpdate: updateExposureColor
    },
    {
        activeVerse: 5,
        activeLines: [2],
        svgUpdate: updateOtherColor
    },
    {
        activeVerse: 5,
        activeLines: [3],
        svgUpdate: null
    },
    {
        activeVerse: 5,
        activeLines: [4],
        svgUpdate: updateUnknownColor
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
        totals = Array.from(totalByYear, ([year, records]) => {
            const totalDead = d3.sum(records, d => d.Number_Dead);
            const totalMissing = d3.sum(records, d => d.Minimum_Estimated_Number_of_Missing);
            return {
                year: +year,
                totalDead: totalDead,
                totalMissing: totalMissing
            };
        });

        // sorting years in chronological order
        totals.sort((a,b) => +a.year - +b.year);

        // x axis based on years
        const xScale = d3.scaleLinear()
        .domain(d3.extent(totals, d => d.year))
        .range([0, w]);
       
        // y axis based on frequency of missing/dead
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(totals, d => Math.max(d.totalDead, d.totalMissing))])
            .nice()    
            .range([h, 0]);

        // adding the axes
        svg.append("g")
            .attr("transform", `translate(0,${h})`)
            .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

        svg.append("g")
            .call(d3.axisLeft(yScale));
        
        // creating lines for dead/missing
        const lineForDead = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.totalDead))
            .curve(d3.curveMonotoneX);

        const lineForMissing = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.totalMissing))
            .curve(d3.curveMonotoneX);


        const pathDead = svg.append("path")
            .datum(totals)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 2)
            .attr("d", lineForDead);

        const pathMissing = svg.append("path")
            .datum(totals)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 2)
            .attr("d", lineForMissing);
    
            d3.select("#play-button").on("click", animateChart);


        function animateChart() {

            let index = 0;
            function step() {
                if (index > totals.length) return;
                const subData = totals.slice(0, index + 1);
                pathDead.datum(subData).transition().duration(10).attr("d", lineForDead);
                pathMissing.datum(subData).transition().duration(50).attr("d", lineForMissing);
                index++;
                if (index <= totals.length) {
                    setTimeout(step, 500);
                }
            }
            step();
        }
            
        

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
let legendY = h+50
        // adding a legend
        svg.append("rect")
            .attr("x",  20)
            .attr("y", legendY)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", "steelblue");
            
        svg.append("text")
            .attr("x", 50)
            .attr("y", legendY + 15)
            .text("Total Dead");

        svg.append("rect")
            .attr("x", 20)
            .attr("y", legendY + 30)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", "red");
        svg.append("text")
            .attr("x", 50)
            .attr("y", legendY + 45)
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
            
            const lowerCase = cause.toLowerCase();
            
            if (lowerCase.includes('drown')) {
                causeCategories['Drowning']++;
            } else if (lowerCase.includes('dehydration') || lowerCase.includes('exposure') || 
                      lowerCase.includes('heat') || lowerCase.includes('thirst')) {
                causeCategories['Exposure/Dehydration']++;
            } else if (lowerCase.includes('violen') || lowerCase.includes('kill') || 
                      lowerCase.includes('shot') || lowerCase.includes('murder') || 
                      lowerCase.includes('wound') || lowerCase.includes('gun')) {
                causeCategories['Violence']++;
            } else if (lowerCase.includes('vehicle') || lowerCase.includes('car') || 
                      lowerCase.includes('crash') || lowerCase.includes('accident')) {
                causeCategories['Vehicle Accident']++;
            } else if (lowerCase.includes('disease') || lowerCase.includes('illness') || 
                      lowerCase.includes('sick') || lowerCase.includes('health')) {
                causeCategories['Disease/Illness']++;
            } else if (lowerCase.includes('unknown') || lowerCase.includes('undetermined')) {
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
            .attr("fill", "#AAAAAA");

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
            .attr("y", barHeight + 96)
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
    
    // Chart update
    if (kf.svgUpdate) {
        kf.svgUpdate();
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

// Update Color for Causes of Death bar chart
function updateDrowningColor() {
    d3.selectAll(".bar")
        .attr("fill", d => d.category === "Drowning" ? "dodgerblue" : "gray");
}

function updateViolenceColor() {
    d3.selectAll(".bar")
        .attr("fill", d => d.category === "Violence" ? "red" : "gray");
}

function updateVehicleAccidentColor() {
    d3.selectAll(".bar")
        .attr("fill", d => d.category === "Vehicle Accident" ? "darkoreange" : "gray");
}

function updateDiseaseColor() {
    d3.selectAll(".bar")
        .attr("fill", d => d.category === "Disease/Illness" ? "darkgreen" : "gray");
}

function updateExposureColor() {
    d3.selectAll(".bar")
        .attr("fill", d => d.category === "Exposure/Dehydration" ? "saddlebrown" : "gray");
}

function updateOtherColor() {
    d3.selectAll(".bar")
        .attr("fill", d => d.category === "Other" ? "gold" : "gray");
}

function updateUnknownColor() {
    d3.selectAll(".bar")
        .attr("fill", d => d.category === "Unknown" ? "orange" : "gray");
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
