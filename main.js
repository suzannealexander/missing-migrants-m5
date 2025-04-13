<!DOCTYPE html>
<html>
  <head>
    <title>The Missing Migrants Project</title>
    <link rel="stylesheet" type="text/css" href="styles.css" />
    <script src="https://d3js.org/d3.v7.min.js"></script>
  </head>
  <body>

    <main class="wrapper">
      <div class="left-column">
        <h1>The Silence After</h1>
        <div class="left-column-content">
          <ul class="verse" id="verse1">
            <li class="line" id="line1">A wave of panic and dread washes over</li>
            <li class="line" id="line2">As time marches on</li>
            <li class="line" id="line3">Loved ones, anxiously waiting by the phone</li>
            <li class="line" id="line4">Praying that they are protected</li>
          </ul>
          
          <ul class="verse" id="verse2">
            <li class="line" id="line1">Time goes by meaninglessly</li>            
            <li class="line" id="line2">The monotonous television drones on</li>
            <li class="line" id="line3">Eyes glued to the screen during the news</li>
            <li class="line" id="line4">Looking for a glimmer of hope</li>
            <li class="line" id="line5">That their dearly beloved are not just another statistic</li>
            <li class="line" id="line6">Not part of the hundreds of thousands missing</li>
          </ul>

          <ul class="verse" id="verse3">
            <li class="line" id="line1">In 
              <span class="death-cause" id="disease">disease</span>, 
              <span class="death-cause" id="accident">accident</span>, 
              <span class="death-cause" id="violence">violence</span>, 
              <span class="death-cause" id="dehydration">dehydration</span>, 
              <span class="death-cause" id="drowning">drowning</span>, and 
              <span class="death-cause" id="unknown">unknown</span> death... pray for survival
            </li>
            <li class="line" id="line2">The house feels eerily hollow</li>
            <li class="line" id="line3">The halls, that were once boisterous with laughter</li>
            <li class="line" id="line4">Stand in sorrow</li>
            <li class="line" id="line5">Everyone's eyes glazed over</li>
            <li class="line" id="line6">Dulled from the pain of the silence after</li>
          </ul>
          
        </div>
        <div class="poem-controls">
          <button class="arrow-button" id="backward-button">◄ Previous Line</button>
          <button class="arrow-button" id="forward-button">Next Line ►</button>
          <img src="images/musical-note.png" id="music" alt="Music Icon" />
          <audio id="bg-music" loop>
            <source src="images/music.mp3" type="audio/mpeg">
          </audio>
        </div>
      </div>
      <div class="right-column">
        <div id="box1" class="chart-container">
          <h3 class="chart-title">Deaths & Missing by Year</h3>
          <div class="svg-container">
          <svg id="svg"></svg>
          <div class="tooltip-button-container">
          <div class="tooltip">?
            <span class="tooltiptext">While this dataset has 
              limited information on the true numbers of those missing/passed, 
              we chose to display this data regardless, to bring attention to the atrocities migrants face</span>
          </div>          
          <button class="arrow-button" id="play-button">►</button>
        </div>
        </div>
        </div>
        <div id="box2" class="chart-container">
          <h3 class="chart-title">Causes of Death</h3>
          <svg id="causeOfDeathSvg"></svg>
        </div>
    
      <div id="box3" class="chart-container">
        <h3 class="chart-title">Articles Over Time</h3>
        <svg id="articlesSvg"></svg>
      </div>
    </div>
  </div>

    </main>

    <script src="main.js"></script>

  </body>
</html>
