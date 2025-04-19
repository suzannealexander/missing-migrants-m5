//JS for Audio
const musicIcon = document.getElementById("music");
const audioElement = document.getElementById("bg-music");

musicIcon.addEventListener("click", function() {
    if (audioElement.paused) {
        audioElement.play();
        musicIcon.src = "images/white-volume.png";
    } else {
        audioElement.pause();
        musicIcon.src = "images/white_mute.png";
    }});
//-----------------------------------------------------------------------------------


document.addEventListener("DOMContentLoaded", function() {
    alert("Welcome! Please turn the music on and use the navigational buttons to follow the visuals of this poem.");
});

//-----------------------------------------------------------------------------------

// First chart (Missing by Year)
const margin = { top: 50, right: 20, bottom: 130, left: 60 };
const w = 700;
const h = 600;

// Second chart (Cause of Death)
const barMargin = { top: 20, right: 5, bottom: 170, left: 60 };
const barWidth = 750;
const barHeight = 550;

// Four chart (Missing by Gender) 
const missingMargin = { top: 20, right: 5, bottom: 170, left: 60 };
const missingWidth = 750;
const missingHeight = 550;

// variables for the animated time chart
let pathDead, pathMissing, lineForDead, lineForMissing;


// Keyframe
let keyframes = [
    {
        activeVerse: 1,
        activeLines: [1],
        svgUpdate: () => {
            drawMissingByGender();
            showChart("box4");
        }
    },
    {
        activeVerse: 1,
        activeLines: [2],
        svgUpdate: () => {
            animateChart();
            showChart("box1");
        }
    },
    {
        activeVerse: 1,
        activeLines: [3],
        svgUpdate: () => {
            animateChart();
            showChart("box1");
        }
    },
    {
        activeVerse: 1,
        activeLines: [4],
        svgUpdate: () => {
            animateChart();
            showChart("box1");
        }
    },

    {
        activeVerse: 2,
        activeLines: [1],
        svgUpdate: () => {
            drawMissingByGender();
            showChart("box4");
        }
    },

    {
        activeVerse: 2,
        activeLines: [2],
        svgUpdate: () => {
            drawMissingByGender();
            showChart("box4");
        }        
    },

    {
        activeVerse: 2,
        activeLines: [3],
        svgUpdate: () => {
            drawArticlesOverTime();
            showChart("box3");
        }
    },

    {
        activeVerse: 2,
        activeLines: [4],
        svgUpdate: () => {
            drawArticlesOverTime();
            showChart("box3");
        }
    },

    {
        activeVerse: 2,
        activeLines: [5],
        svgUpdate: () => {
            drawArticlesOverTime();
            showChart("box3");
        }
    },
    {
        activeVerse: 2,
        activeLines: [6],
        svgUpdate: () => {
            drawArticlesOverTime();
            showChart("box3");
        }
    },
    {
    activeVerse: 3,
    activeLines: [1],
    svgUpdate: () => {
      showChart("box2");
      resetDeathCauseHighlights();
      hideAllBars();
    }
  },
  {
    activeVerse: 3,
    activeLines: [1],
    svgUpdate: () => {
        highlightDeathCause('disaster');
        showChart("box2");
        showMultipleCategories(['Violence', 'Vehicle Accident','Disease/Illness']);
    }
  },
  {
    activeVerse: 3,
    activeLines: [1],
    svgUpdate: () => {
      highlightDeathCause('chaos');
      showChart("box2");
      showMultipleCategories(['Drowning', 'Exposure/Dehydration']);
    }
  },
  {
    activeVerse: 3,
    activeLines: [1],
    svgUpdate: () => {
      highlightDeathCause('unknown');
      showChart("box2");
      showMultipleCategories(['Unknown', 'Other']);
    }
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
        activeVerse: 3,
        activeLines: [5],
        svgUpdate: null
    },
    {
        activeVerse: 3,
        activeLines: [6],
        svgUpdate: null
    },
];

let keyframeIndex = 0;

// first svg
let svg = d3.select("#svg")
    .attr("viewBox", "0 0 " + (w + margin.left + margin.right) + " " + (h + margin.top + margin.bottom))
    .attr("preserveAspectRatio", "xMidYMid meet")
    .classed("responsive-svg", true)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// second svg
let barSvg = d3.select("#causeOfDeathSvg")
    .attr("viewBox", "0 0 " + (barWidth + barMargin.left + barMargin.right) + " " + (barHeight + barMargin.top + barMargin.bottom))
    .attr("preserveAspectRatio", "xMidYMid meet")
    .classed("responsive-svg", true)
    .append("g")
    .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")");

// four svg
let missingSvg = d3.select("#missingSvg")
    .attr("viewBox", "0 0 " + (barWidth + barMargin.left + barMargin.right) + " " + (barHeight + barMargin.top + barMargin.bottom))
    .attr("preserveAspectRatio", "xMidYMid meet")
    .classed("responsive-svg", true)
    .append("g")
    .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")");




let allData;// summarized data
let rawData;// original per-article data (for the frequency dot plot)

async function loadData() {
    const data = await d3.csv('us_data.csv');

    // Store raw data separately
    rawData = data.map(d => ({
        Reported_Year: d['Reported Year'],
        Number_Dead: d['Number Dead'] ? +d['Number Dead'] : 0,
        Minimum_Estimated_Number_of_Missing: d['Minimum Estimated Number of Missing'] ? +d['Minimum Estimated Number of Missing'] : 0,
        Cause_of_Death: d['Cause of Death'],
        URL: d['URL']
    }));

    // Summarized data for line graph
    const totalByYear = d3.group(rawData, d => d.Reported_Year);

    allData = Array.from(totalByYear, ([year, records]) => {
        const totalDead = d3.sum(records, d => d.Number_Dead);
        const totalMissing = d3.sum(records, d => d.Minimum_Estimated_Number_of_Missing);
        return {
            year: +year,
            totalDead,
            totalMissing
        };
    });

    allData.sort((a, b) => a.year - b.year);
}


function drawMissingDeadLineGraph(){
    totals = allData;

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
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${h})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

    svg.append("g")
        .call(d3.axisLeft(yScale));
    
    // creating lines for dead/missing
    lineForDead = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.totalDead))
        .curve(d3.curveMonotoneX);

    lineForMissing = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.totalMissing))
        .curve(d3.curveMonotoneX);

    // Chart Title
    svg.append("text")
        .attr("x", w / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("fill", "black")
        .text("Total Dead & Missing Over Time");


    pathDead = svg.append("path")
        .datum(totals)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2)
        .attr("d", lineForDead);

    pathMissing = svg.append("path")
        .datum(totals)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2)
        .attr("d", lineForMissing);

        d3.select("#play-button")
            .style("position", "absolute")
            .style("top", "-4px")
            .style("right", "48px")
            .on("click", animateChart);


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

}


function drawArticlesOverTime(){
    const dots = [];
    const grouped = d3.group(rawData, d => d.Reported_Year);

    grouped.forEach((entries, year) => {
        entries.forEach((d, i) => {
            const urls = d.URL?.split(",").map(u => u.trim()) ?? [];
            dots.push({
                year: year,
                yIndex: i,
                urls: urls,
                original: d
            });
        });
    });

    const years = Array.from(grouped.keys()).sort();
    const maxStack = d3.max(Array.from(grouped.values(), v => v.length));
    const freqHeight = 700; 


    const freqMargin = { top: 20, right: 15, bottom: 50, left: 60 };
    const freqWidth = 670;


    let freqSvg = d3.select("#articlesSvg")
    .attr("width", freqWidth + freqMargin.left + freqMargin.right)
    .attr("height", freqHeight + freqMargin.top + freqMargin.bottom)
    .append("g")
    .attr("transform", "translate(" + freqMargin.left + "," + freqMargin.top + ")");



    const xScaleFreq = d3.scaleBand()
        .domain(years)
        .range([0, freqWidth])
        .padding(0.3);
    
    const yScaleFreq = d3.scaleLinear()
        .domain([0, maxStack])
        .range([freqHeight, 0]);
        

    freqSvg.append("g")
        .attr("transform", `translate(0,${freqHeight})`)
        .call(d3.axisBottom(xScaleFreq));

    freqSvg.append("g")
        .call(d3.axisLeft(yScaleFreq).ticks(5));

    // adding axis labels
    freqSvg.append("text")
        .attr("x", w / 2)
        .attr("y", h + 140)
        .attr("text-anchor", "middle")
        .text("Year");

    freqSvg.append("text")
        .attr("x", -h / 2)
        .attr("y", -40)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Frequency");

    // Chart Title
    freqSvg.append("text")
        .attr("x", freqWidth / 2)
        .attr("y", -1)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("fill", "black")
        .text("Articles By Year");

    freqSvg.selectAll("circle")
        .data(dots)
        .enter()
        .append("circle")
        .attr("cx", d => xScaleFreq(d.year) + xScaleFreq.bandwidth() / 2)
        .attr("cy", d => yScaleFreq(d.yIndex))
        .attr("r", 8)
        .attr("fill", "steelblue")
        .style("cursor", "pointer")
        .on("mouseover", function (event, d) {
            d3.select(this).attr("fill", "orange");
        })
        .on("mouseout", function (event, d) {
            d3.select(this).attr("fill", "steelblue");
        })
        .on("click", function (event, d) {
            d.urls.forEach(url => window.open(url, "_blank"));
        });
}



function drawMissingByGender() {
    //  calculations
    const missTotalMales = d3.sum(rawData, d => +d["Number of Males"]);
    const missTotalFemales = d3.sum(rawData, d => +d["Number of Females"]);

    const missGenderData = [
        { gender: "Male", total: missTotalMales },
        { gender: "Female", total: missTotalFemales }
    ];

    // Set dimensions for the missing gender bar chart
    const missBarWidth = 800;
    const missBarHeight = missBarWidth * 0.6;
    const missBarMargin = { top: 20, right: 20, bottom: 40, left: 40 };

    const missSvg = d3.select("#missingSvg")
        .attr("width", missBarWidth)
        .attr("height", missBarHeight);

    const missX = d3.scaleBand()
        .domain(missGenderData.map(d => d.gender))
        .range([missBarMargin.left, missBarWidth - missBarMargin.right])
        .padding(0.4);

    const missY = d3.scaleLinear()
        .domain([0, d3.max(missGenderData, d => d.total)])
        .nice()
        .range([missBarHeight - missBarMargin.bottom, missBarMargin.top]);

    // Draw missing people bars
    missSvg.selectAll("rect")
        .data(missGenderData)
        .enter()
        .append("rect")
        .attr("x", d => missX(d.gender))
        .attr("y", d => missY(d.total))
        .attr("width", missX.bandwidth())
        .attr("height", d => missY(0) - missY(d.total))
        .attr("fill", d => d.gender === "Female" ? "purple" : "steelblue");

    // Add x-axis for missing chart
    missSvg.append("g")
        .attr("transform", `translate(0,${missBarHeight - missBarMargin.bottom})`)
        .call(d3.axisBottom(missX))
        .selectAll("text")
        .style("font-size", "24px");

    // Add y-axis for missing chart
    missSvg.append("g")
        .attr("transform", `translate(${missBarMargin.left},0)`)
        .style("font-size", "24px")
        .call(d3.axisLeft(missY));

    // Axis labels for missing chart
    missSvg.append("text")
        .attr("x", missBarWidth / 2)
        .attr("y", missBarHeight + 15)
        .attr("text-anchor", "middle")
        .text("Gender")
        .style("font-size", "25px");

    missSvg.append("text")
        .attr("x", -missBarHeight / 2)
        .attr("y", -60)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .style("font-size", "25px")
        .text("Total Number Missing");

    // Add caption to chart
    missSvg.append("text")
        .attr("x", missBarWidth / 2)
        .attr("y", missBarHeight + 80)
        .attr("text-anchor", "middle")
        .style("font-size", "25px")
        .style("fill", "black")
        .text("Source: National Missing Persons Database, 2024");
        missSvg.append("text")
        .attr("x", missBarWidth / 2)
        .attr("y", missBarMargin.top)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("fill", "black")
        .text("Missing By Gender");   
}


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

        // Calculations for missing gender data ----------------------------------------------------------------------------------

        const missTotalMales = d3.sum(data, d => +d["Number of Males"]);
        const missTotalFemales = d3.sum(data, d => +d["Number of Females"]);

        const missGenderData = [
            { gender: "Male", total: missTotalMales },
            { gender: "Female", total: missTotalFemales }
        ];

        // Set dimensions for the missing gender bar chart
        const missBarWidth = 800;
        const missBarHeight = missBarWidth *0.6;
        const missBarMargin = { top: 20, right: 20, bottom: 40, left: 40 };

        const missSvg = d3.select("#missingSvg")
            .attr("width", missBarWidth)
            .attr("height", missBarHeight);

        const missX = d3.scaleBand()
            .domain(missGenderData.map(d => d.gender))
            .range([missBarMargin.left, missBarWidth - missBarMargin.right])
            .padding(0.4);

        const missY = d3.scaleLinear()
            .domain([0, d3.max(missGenderData, d => d.total)])
            .nice()
            .range([missBarHeight - missBarMargin.bottom, missBarMargin.top]);


        // Draw missing people bars
        missSvg.selectAll("rect")
            .data(missGenderData)
            .enter()
            .append("rect")
            .attr("x", d => missX(d.gender))
            .attr("y", d => missY(d.total))
            .attr("width", missX.bandwidth())
            .attr("height", d => missY(0) - missY(d.total))
            .attr("fill", d => d.gender === "Female" ? "purple" : "steelblue");

        // Add x-axis for missing chart
        missSvg.append("g")
            .attr("transform", `translate(0,${missBarHeight - missBarMargin.bottom})`)
            .call(d3.axisBottom(missX))
            .selectAll("text")
            .style("font-size", "24px");

        // Add y-axis for missing chart
        missSvg.append("g")
            .attr("transform", `translate(${missBarMargin.left},0)`)
            .style("font-size", "24px")
            .call(d3.axisLeft(missY));

        // Axis labels for missing chart
        missSvg.append("text")
        .attr("x", missBarWidth / 2)
        .attr("y", missBarHeight +15)
        .attr("text-anchor", "middle")
        .text("Gender")
        .style("font-size", "25px");

        missSvg.append("text")
        .attr("x", -missBarHeight / 2)
        .attr("y", -60)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .style("font-size", "25px")
        .text("Total Number Missing");

        // Add caption to chart
        missSvg.append("text")
        .attr("x", missBarWidth / 2)   // center horizontally
        .attr("y", missBarHeight + 80) // a bit below the chart
        .attr("text-anchor", "middle") // center the text
        .style("font-size", "25px")    // set font size
        .style("fill", "black")        // set text color
        .text("Source: National Missing Persons Database, 2024");



// --------------------------------------------------------------------------------------------------------------------------

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
// data for year and death
const yearCauseData = {};
const causeYears = ["2014", "2015", "2016", "2017", "2018", "2019"];

// data structure
causeYears.forEach(year => {
    yearCauseData[year] = {
        'Drowning': 0,
        'Violence': 0,
        'Exposure/Dehydration': 0,
        'Vehicle Accident': 0,
        'Disease/Illness': 0,
        'Unknown': 0,
        'Other': 0
    };
});
        // data
        data.forEach(d => {
            const year = d.Reported_Year;
            if (!causeYears.includes(year)) return;  // if year is not defined, pass
            
            const cause = d.Cause_of_Death;
            if (!cause) {
                yearCauseData[year]['Unknown']++;
                return;
            }
            
            const lowerCase = cause.toLowerCase();
            
            if (lowerCase.includes('drown')) {
                yearCauseData[year]['Drowning']++;
            } else if (lowerCase.includes('dehydration') || lowerCase.includes('exposure') || 
                    lowerCase.includes('heat') || lowerCase.includes('thirst')) {
                yearCauseData[year]['Exposure/Dehydration']++;
            } else if (lowerCase.includes('violen') || lowerCase.includes('kill') || 
                    lowerCase.includes('shot') || lowerCase.includes('murder') || 
                    lowerCase.includes('wound') || lowerCase.includes('gun')) {
                yearCauseData[year]['Violence']++;
            } else if (lowerCase.includes('vehicle') || lowerCase.includes('car') || 
                    lowerCase.includes('crash') || lowerCase.includes('accident')) {
                yearCauseData[year]['Vehicle Accident']++;
            } else if (lowerCase.includes('disease') || lowerCase.includes('illness') || 
                    lowerCase.includes('sick') || lowerCase.includes('health')) {
                yearCauseData[year]['Disease/Illness']++;
            } else if (lowerCase.includes('unknown') || lowerCase.includes('undetermined')) {
                yearCauseData[year]['Unknown']++;
            } else {
                yearCauseData[year]['Other']++;
            }
        });

        // data for each category
        const categories = Object.keys(causeCategories).filter(key => causeCategories[key] > 0);
        const stackData = [];

        categories.forEach(category => {
            const yearData = {};
            causeYears.forEach(year => {
                yearData[year] = yearCauseData[year][category] || 0;
            });
            
            stackData.push({
                category: category,
                ...yearData,
                total: Object.values(yearData).reduce((sum, val) => sum + val, 0)
            });
        });

        // sort data
        stackData.sort((a, b) => b.total - a.total);

        // year to colors
        const causeYearColors = {
            "2014": "#3366cc",
            "2015": "#dc3912",
            "2016": "#ff9900",
            "2017": "#109618",
            "2018": "#990099",
            "2019": "#0099c6"
        };
        const defaultGray = "#AAAAAA";
        

        // x axis scale
        const xBarScale = d3.scaleBand()
            .domain(stackData.map(d => d.category))
            .range([0, barWidth])
            .padding(0.1);

        // y axis scale
        const maxTotal = d3.max(stackData, d => d.total);
        const yBarScale = d3.scaleLinear()
            .domain([0, maxTotal])
            .nice()
            .range([barHeight, 0]);

        // drawing stacked bar 
        stackData.forEach(categoryData => {
            const category = categoryData.category;
            let cumulative = 0;
            
            // stacked by year
            causeYears.forEach(year => {
                const value = categoryData[year];
                if (value <= 0) return;  // pass if value is not defiend
                
            
                const start = cumulative;
                cumulative += value;
                
                // drawing bar
                barSvg.append("rect")
                    .attr("class", "year-bar")
                    .attr("data-category", category)
                    .attr("data-year", year)
                    .attr("x", xBarScale(category))
                    .attr("y", yBarScale(cumulative))
                    .attr("width", xBarScale.bandwidth())
                    .attr("height", yBarScale(start) - yBarScale(cumulative))
                    .attr('fill',defaultGray)
                    .attr("fill", causeYearColors[year])
                    .attr("stroke", "white")
                    .attr("stroke-width", 0.5);
            });
            
           
        });

        // legend for each year
        const legendSpacing = 80;
        const legendY2 = barHeight + 140;
        const legendStartX = barHeight - 560;

        causeYears.forEach((year, i) => {
            // legend block
            barSvg.append("rect")
                .attr("x", i * legendSpacing)
                .attr("x", legendStartX + (i * legendSpacing))
                .attr("y", legendY2)
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", causeYearColors[year]);
            
            // legend text
            barSvg.append("text")
                .attr("x", i * legendSpacing + 20)
                .attr("x", legendStartX + (i * legendSpacing) + 20)
                .attr("y", legendY2 + 12)
                .attr("font-size", "16px")
                .text(year);
        });

        // drawing x
        barSvg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${barHeight})`)
            .call(d3.axisBottom(xBarScale))
            .selectAll("text")
            .attr("transform", "rotate(-30)")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em");

        // y
        barSvg.append("g")
            .call(d3.axisLeft(yBarScale));

        // label
        barSvg.append("text")
            .attr("x", barWidth * 1/2+20)
            .attr("y", barHeight + 120)
            .attr("text-anchor", "middle")
            .text("Cause of Death");

        barSvg.append("text")
            .attr("x", -barHeight / 2)
            .attr("y", -40)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Frequency");

        barSvg.append("text")
        .attr("x", barHeight / 2)
        .attr("y", barMargin.top)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("fill", "black")
        .text("Cause of Death Over Time");
    })

function showChart(boxIdToShow) {
    const boxes = ["box1", "box2", "box3", "box4"];
    boxes.forEach(id => {
        const box = document.getElementById(id);
        if (id === boxIdToShow) {
            box.style.display = "block";
        } else {
            box.style.display = "none";
        }
    });
}
    

function animateChart() {
    let index = 0;

    function step() {
        if (index > totals.length) return;

        const subData = totals.slice(0, index + 1);
        if (subData.length > 0) {
            pathDead.datum(subData)
                .transition().duration(10)
                .attr("d", d => lineForDead(d));

            pathMissing.datum(subData)
                .transition().duration(50)
                .attr("d", d => lineForMissing(d));
        }

        index++;
        if (index <= totals.length) {
            setTimeout(step, 500);
        }
    }

    step();
}


// drawing key frame
function drawKeyframe(kfi) {
    const kf = keyframes[kfi];
    
    resetActiveLines();
    resetDeathCauseHighlights(); 
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


function updateDrowningColor() {
    showCategoryColors("Drowning");
}

function updateViolenceColor() {
    showCategoryColors("Violence");
}

function updateVehicleAccidentColor() {
    showCategoryColors("Vehicle Accident");
}

function updateDiseaseColor() {
    showCategoryColors("Disease/Illness");
}

function updateExposureColor() {
    showCategoryColors("Exposure/Dehydration");
}

function updateOtherColor() {
    showCategoryColors("Other");
}

function updateUnknownColor() {
    showCategoryColors("Unknown");
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

// event listener
document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("backward-button").addEventListener("click", backwardClicked);
    document.getElementById("forward-button").addEventListener("click", forwardClicked);

    drawKeyframe(keyframeIndex);
});

async function initalize(){
    await loadData();
    drawMissingDeadLineGraph();
    drawArticlesOverTime();
}

initalize();

// reset highlights for cause of death words
function resetDeathCauseHighlights() {
    document.querySelectorAll('.death-cause').forEach(el => {
      el.classList.remove('highlighted-death-cause');
    });
  }
  
  // highlight via id
  function highlightDeathCause(id) {
    resetDeathCauseHighlights();
    const element = document.getElementById(id);
    if (element) {
      element.classList.add('highlighted-death-cause');
    }
  }

  // hide bars
function hideAllBars() {
    document.querySelectorAll('.year-bar').forEach(bar => {
      bar.classList.remove('visible');
    });
  }
  
  // show specific bar
  function showCategoryBars(category) {
    document.querySelectorAll(`.year-bar[data-category="${category}"]`).forEach(bar => {
      bar.classList.add('visible');
    });
  }
  
  // show multiple bars -> for unknown and other words bar
  function showMultipleCategories(categories) {
    categories.forEach(category => {
      showCategoryBars(category);
    });
  }
  
  // reset
  function initializeBarVisibility() {
    hideAllBars();
  }
  
  // load page -> reset bar
  document.addEventListener('DOMContentLoaded', function() {
    // delay
    setTimeout(initializeBarVisibility, 500);
  });
