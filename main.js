import "./style.css";

//** CHART JS SETUP */
const ctx = document.getElementById("VSWIR");
const ctx2 = document.getElementById("TIR");
let myData = "/files/myData.csv";

let transmissionData = [];
var boxAnnotations = [];
var boxAnnotations2 = [];
var groupsToggled = ['L8-9'];
var labels = [];


//** MIN AND MAX VALUES */
var arrayStartCut_chart2 = 2900;
var arrayEndCut_chart1 = 1150;
var transmissionDataResolution = 1;
var minChartTwo = 9500;
var boxSeperation = 0.1;
var boxHeight = 0.05;
var chartSeperation = 0.25;

//** GRAB HTML OBJECTS */
let sidebarButton = document.getElementById("openSidebarIcon");
let L8_9_Toggle = document.getElementById("Landsat8-9");
let L7Toggle = document.getElementById("Landsat7");

let boxHeight_Global = document.getElementById("boxHeight_Global");
let boxSeperation_Global = document.getElementById("boxSeperation_Global");
let chartSeperation_Global = document.getElementById("chartSeperation_Global");

//** IMPORT TRANSMISSION DATA AS A CSV */
d3.csv(myData).then(function (datapoints) {
  transmissionData = datapoints;
  plotCSV();
  resize();
});

var data = {
  datasets: [
    //** VISIBLE dataset 13*/
    {
      data: [],
      showLine: true,
      label: "Transmission",
      fill: true,
      borderColor: "rgb(255, 255, 255)",
      pointBackgroundColor: "rgb(189, 195, 199)",
      pointRadius: 0,
    },
  ],
};

var data2 = {
  datasets: [
    //** VISIBLE dataset 13*/
    {
      data: [],
      showLine: true,
      label: "Transmission",
      fill: true,
      borderColor: "rgb(255, 255, 255)",
      pointBackgroundColor: "rgb(189, 195, 199)",
      pointRadius: 0,
    },
  ],
};

const options1 = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      enabled: false,
    },
    annotation: {
      annotations: boxAnnotations,
    },
  },
};

const options2 = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      enabled: false,
    },
    annotation: {
      annotations: boxAnnotations2,
    },
  },
};

const config = {
  type: "scatter",
  data: data,
  options: {
    radius: 3,
    hitRadius: 3,
    hoverRadius: 8,
    spanGaps: true,
    responsive: true,
    maintainAspectRatio: false,
    tension: 0,
    plugins: {
      customCanvasBackgroundColor: {
        color: "white",
      },
      background: {
        color: "white",
      },
      legend: {
        display: true,
        labels: {
          filter: function (item, chart) {
            //** Function for filtering out legends. Chooses which Labels to exclude depending on the dataMode*/
            // if (excludeLabelList.includes(item.text)) {
            //   return false;
            // } else {
            //   return item;
            // }
          },
        },
      },
      //** STYLING FOR DATA LABELS */
      datalabels: {
        formatter: (value, context) => {
          if (
            (context.datasetIndex === 12 && raw_labels_visible) ||
            (context.datasetIndex === 13 && raw_labels_visible)
          ) {
            var output;

            if (toggleUnitLabels_icon.classList.contains("selected")) {
              output = value.y;
            } else {
              output = value.y + "μW/cm²";
            }

            return output;
          } else {
            return "";
          }
        },
        color: "white",
        anchor: "end",
        align: "top",
        backgroundColor: function (context) {
          if (
            (context.datasetIndex === 12 && raw_labels_visible) ||
            (context.datasetIndex === 13 && raw_labels_visible)
          ) {
            return "rgba(0, 0, 0, 0.75)";
          } else {
            return "rgba(0, 0, 0, 0)";
          }
        },
        borderWidth: 0.5,
        borderRadius: 5,
        font: {
          weight: "bold",
        },
      },
      tooltip: {
        enabled: false,
      },
      annotation: {
        annotations: boxAnnotations,
      },
    },
    //** ADDS NM to the Y axis lables */
    // animation: {
    //   onComplete: () => {
    //     delayed = true;
    //   },
    //   delay: (context) => {
    //     let delay = 0;
    //     if (context.type === "data" && context.mode === "default" && !delayed) {
    //       delay = context.dataIndex * 75 + context.datasetIndex * 25;
    //     }
    //     return delay;
    //   },
    // },
    scales: {
      y: {
        title: {
          display: true,
          text: "μW/cm²",
          font: {
            size: 15,
          },
        },
        max: 0.9,
      },
      x: {
        type: "linear",
        position: "bottom",
        // title: {
        //   display: true,
        //   text: "Wavelength (nm)",
        //   align: "center",
        //   font: {
        //     size: 15,
        //   },
        // },
      },
    },
  },
  plugins: ["chartjs-plugin-annotation"],
  options1,
};

const config2 = {
  type: "scatter",
  data: data2,
  options: {
    radius: 3,
    hitRadius: 3,
    hoverRadius: 8,
    spanGaps: true,
    responsive: true,
    maintainAspectRatio: false,
    tension: 0,
    plugins: {
      customCanvasBackgroundColor: {
        color: "white",
      },
      background: {
        color: "white",
      },
      legend: {
        display: true,
        labels: {
          filter: function (item, chart) {
            //** Function for filtering out legends. Chooses which Labels to exclude depending on the dataMode*/
            // if (excludeLabelList.includes(item.text)) {
            //   return false;
            // } else {
            //   return item;
            // }
          },
        },
      },
      //** STYLING FOR DATA LABELS */
      datalabels: {
        formatter: (value, context) => {
          if (
            (context.datasetIndex === 12 && raw_labels_visible) ||
            (context.datasetIndex === 13 && raw_labels_visible)
          ) {
            var output;

            if (toggleUnitLabels_icon.classList.contains("selected")) {
              output = value.y;
            } else {
              output = value.y + "μW/cm²";
            }

            return output;
          } else {
            return "";
          }
        },
        color: "white",
        anchor: "end",
        align: "top",
        backgroundColor: function (context) {
          if (
            (context.datasetIndex === 12 && raw_labels_visible) ||
            (context.datasetIndex === 13 && raw_labels_visible)
          ) {
            return "rgba(0, 0, 0, 0.75)";
          } else {
            return "rgba(0, 0, 0, 0)";
          }
        },
        borderWidth: 0.5,
        borderRadius: 5,
        font: {
          weight: "bold",
        },
      },
      tooltip: {
        enabled: false,
      },
      annotation: {
        annotations: boxAnnotations2,
      },
    },
    //** ADDS NM to the Y axis lables */
    // animation: {
    //   onComplete: () => {
    //     delayed = true;
    //   },
    //   delay: (context) => {
    //     let delay = 0;
    //     if (context.type === "data" && context.mode === "default" && !delayed) {
    //       delay = context.dataIndex * 75 + context.datasetIndex * 25;
    //     }
    //     return delay;
    //   },
    // },
    scales: {
      y: {
        ticks: {
          display: false,
        },
        max: 0.9,
      },
      x: {
        min: minChartTwo,
      },
    },
  },
  plugins: ["chartjs-plugin-annotation"],
  options2,
};

const chart = new Chart(ctx, config);
const chart2 = new Chart(ctx2, config2);

init();
function init() {
  //transmissionData = readTextFile("/myData.csv", true);
  // console.log(chart.options.plugins.annotation.annotations[0]);
  // console.log(chart2.options.plugins.annotation.annotations[0]);
}

//** GRABS THE DATA FROM THE DROP AND SENDS IT TO BE CONVERTED INTO A CSV */
function readTextFile(file) {
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        var allText = rawFile.responseText;
        var csvdata = allText;

        transmissionData = csvToArray(csvdata);
        console.log(transmissionData);
        plotCSV();

        // setTimeout(() => {
        //   plotCSV();
        // }, 1000);
      }
    }
  };
  rawFile.send(null);
}

//** CONVERTS THE INCOMING TEXT FILE INTO A USABLE CSV ARRAY */
function csvToArray(str, delimiter = ",") {
  // slice from start of text to the first \n index
  // use split to create an array from string by delimiter
  const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
  // slice from \n index + 1 to the end of the text
  // use split to create an array of each csv value row
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");

  // Map the rows
  // split values from each row into an array
  // use headers.reduce to create an object
  // object properties derived from headers:values
  // the object passed as an element of the array
  const arr = rows.map(function (row) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (object, header, index) {
      header = header.replace(/\s/g, "");

      object[header] = values[index];
      return object;
    }, {});
    return el;
  });

  // return the array
  return arr;
}

//** TAKES A CSV AND PLOTS THE TRANSMISSION DATA */
function plotCSV() {
  let compressedArray = transmissionData.filter((element, index) => {
    return index % transmissionDataResolution === 0;
  });
  console.log(compressedArray);

  for (var i = 0; i < compressedArray.length - arrayEndCut_chart1; i++) {
    chart.data.datasets[0].data[i] = {
      x: compressedArray[i].Wave * 1000,
      y: compressedArray[i].TotTrans,
    };
  }

  console.log(compressedArray.length);

  for (var i = arrayStartCut_chart2; i < compressedArray.length; i++) {
    if(i < 3151)
    {
      //** HAVE TO MAKE IT START AT DATA 0 */
      chart2.data.datasets[0].data[i - arrayStartCut_chart2] = {
        x: compressedArray[i].Wave * 1000,
        y: compressedArray[i].TotTrans,
      };
    }
  }

  chart.update();
  chart2.update();

  console.log(chart2.data.datasets[0].data);
}

//** WINDOW RESIZE EVENT */
window.onresize = function () {
  resize();
};

var resizeTimeout;
function resize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function () {
    //chart.options.plugins.annotation.annotations.label1.font.size = '10%';
    chart.update();
    chart.resize();
    chart2.update();
    chart2.resize();
  }, 500);
}

var textFont = "15%";
var sublabelXOffset = 0.1;
var sublabelYOffset = 0.01;

//** ADD ALL BOX VALUES TO GRAPH */
addBox(430, 450, 
  0.1 + boxSeperation, 
  0.1 + boxHeight + boxSeperation, 
  "rgb(103,156,191)", "1", textFont, "30m", 1);
addBox(450, 510, 0.1, 0.1 + boxHeight, "rgb(0,101,141)", "2", textFont, "30m", 1);
addBox(530, 590, 0.1, 0.1 + boxHeight, "rgb(76,157,95)", "3", textFont, "30m", 1);
addBox(640, 670, 0.1, 0.1 + boxHeight, "rgb(194,32,54)", "4", textFont, "30m", 1);
addBox(850, 880, 0.1, 0.1 + boxHeight, "rgb(197,162,189)", "5", textFont, "30m", 1);
addBox(1570, 1650, 0.1, 0.1 + boxHeight, "rgb(211,153,121)", "6", textFont, "60m", 1);
addBox(2110, 2290, 0.1, 0.1 + boxHeight, "rgb(153,156,150)", "7", textFont, "30m", 1);
addBox(500, 680, 
  (0.1) - boxSeperation, 
  (0.1 + boxHeight) - boxSeperation, 
  "rgb(0,143,162)", "8", textFont, "15m", 1);
addBox(1360, 1380, 
  0.1 + boxSeperation, 
  0.1 + boxHeight + boxSeperation, 
  "rgb(116,128,161)", "9", textFont, "30m", 1);
addBox(10600, 11190, 0.1, 0.1 + boxHeight, "rgb(188,122,130)", "10", textFont, "30m", 2);
addBox(11500, 12510, 0.1, 0.1 + boxHeight, "rgb(188,122,130)", "11", textFont, "30m", 2);

//** ADD LINE FOR ANNOTATION */
function addBox(
  xMin,
  xMax,
  yMin,
  yHeight,
  color,
  labelText,
  textSize,
  subLabelText, 
  graphNumb
) {
  var box = {
    type: "box",
    xMin: xMin,
    xMax: xMax,
    yMin: yMin,
    yMax: yHeight,
    borderWidth: 0,
    backgroundColor: color,
  };
  var label = {
    type: "label",
    xMin: xMin,
    xMax: xMax,
    yMin: yMin,
    yMax: yHeight,
    content: [labelText],
    font: {
      size: textSize,
      borderColor: "rgb(245,245,245)",
      color: "rgb(245,245,245)",
    },
    color: "rgb(245,245,245)",
  };

  var subLabel = {
    type: "label",
    xMin: xMin,
    xMax: xMax,
    yMin: yHeight + sublabelYOffset,
    yMax: yHeight + sublabelYOffset,
    content: [subLabelText],
    font: {
      size: 15,
      color: "rgb(245,245,245)",
      textAlign: "right",
    },
    color: "rgb(0,0,0)",
  };

  if(graphNumb == 1)
  {
    boxAnnotations.push(box);
    boxAnnotations.push(label);
    boxAnnotations.push(subLabel);
  }
  else if(graphNumb == 2)
  {
    boxAnnotations2.push(box);
    boxAnnotations2.push(label);
    boxAnnotations2.push(subLabel);
  }
}

//** CLEARS ALL ANNOTATIONS AND UPDATES THEM IN updateAnnotations() */
function clearAnnotations(graph)
{
  boxAnnotations.splice(0, boxAnnotations.length);
  boxAnnotations2.splice(0, boxAnnotations2.length);

  //** takes out specific graph in the graph list */
  if(groupsToggled.includes(graph))
  {          
    groupsToggled.splice(groupsToggled.indexOf(graph), 1);
  }
  console.log(groupsToggled);
  updateAnnotations();
}

//** UPDATES ALL CURRENTLY SELECTED ANNOTATIONS */
function updateAnnotations()
{

  var offsetY = chartSeperation; 

  for(var i = 0; i < groupsToggled.length; i++)
  {
    offsetY = chartSeperation * i;
    console.log(groupsToggled[i]);

    if(groupsToggled[i] == 'L8-9')
    {
      addBox(430, 450, 
        offsetY + 0.1 + boxSeperation, 
        offsetY + 0.1 + boxHeight + boxSeperation, 
        "rgb(103,156,191)", "1", textFont, "30m", 1);
      addBox(450, 510, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(0,101,141)", "2", textFont, "30m", 1);
      addBox(530, 590, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(76,157,95)", "3", textFont, "30m", 1);
      addBox(640, 670, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(194,32,54)", "4", textFont, "30m", 1);
      addBox(850, 880, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(197,162,189)", "5", textFont, "30m", 1);
      addBox(1570, 1650, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(211,153,121)", "6", textFont, "60m", 1);
      addBox(2110, 2290, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(153,156,150)", "7", textFont, "30m", 1);
      addBox(500, 680, 
        (offsetY + 0.1) - boxSeperation, 
        (offsetY + 0.1 + boxHeight) - boxSeperation, 
        "rgb(0,143,162)", "8", textFont, "15m", 1);
      addBox(1360, 1380, 
        offsetY + 0.1 + boxSeperation, 
        offsetY + 0.1 + boxHeight + boxSeperation, 
        "rgb(116,128,161)", "9", textFont, "30m", 1);
      addBox(10600, 11190, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(188,122,130)", "10", textFont, "30m", 2);
      addBox(11500, 12510, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(188,122,130)", "11", textFont, "30m", 2);
  
      console.log("updated L8-9 Annotations");
    }
    else if(groupsToggled[i] == 'L7')
    {
      addBox(450, 520, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(0,101,141)", "1", textFont, "30m", 1);
      addBox(520, 600, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(76,157,95)", "2", textFont, "30m", 1);
      addBox(630, 690, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(194,32,54)", "3", textFont, "30m", 1);
      addBox(770, 900, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(197,162,189)", "4", textFont, "30m", 1);
      addBox(1550, 1750, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(211,153,121)", "5", textFont, "30m", 1);
      addBox(10400, 12500, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(188,122,130)", "6", textFont, "60m", 2);
      addBox(2090, 2350, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(153,156,150)", "7", textFont, "30m", 1);
      addBox(520, 900, 
        (offsetY + 0.1) - boxSeperation, 
        (offsetY + 0.1 + boxHeight) - boxSeperation, 
        "rgb(0,143,162)", "8", textFont, "15m", 1);
  
      console.log("updated L7 Annotations");
    }
  }

  console.log(groupsToggled);

  chart.update();
  chart2.update();
}

//....** HTML OBJECTS ACTIONS ....*/

//** SIDEBAR FUNCTIONALITY */
sidebarButton.addEventListener("click", function () {
  if(sidebar.classList.contains("active"))
  {
    sidebarButton.innerHTML = "<";
  }
  else
  {
    sidebarButton.innerHTML = ">";
  }

  sidebar.classList.toggle("active");
});

//** GRAPH TOGGLES */
L8_9_Toggle.addEventListener("click", function () {
  //** CLEARING */
  if(L8_9_Toggle.classList.contains("selected"))
  {
    clearAnnotations('L8-9');
    console.log("CLEAR");
  }
  //** ADDING */
  else
  {
    groupsToggled.push('L8-9');
    clearAnnotations();
  }
  L8_9_Toggle.classList.toggle("selected");
});
L7Toggle.addEventListener("click", function () {
  //** CLEARING */
  if(L7Toggle.classList.contains("selected"))
  {
    clearAnnotations('L7');
    console.log("CLEAR");
  }
  //** ADDING */
  else
  {
    groupsToggled.push('L7');
    clearAnnotations();
  }
  L7Toggle.classList.toggle("selected");
});

boxHeight_Global.addEventListener("change", function () {
  console.log("change BoxHeight to: " + boxHeight_Global.value);
  boxHeight = parseFloat(boxHeight_Global.value);
  clearAnnotations();
});
boxSeperation_Global.addEventListener("change", function () {
  console.log("change BoxHeight to: " + boxSeperation_Global.value);
  boxSeperation = parseFloat(boxSeperation_Global.value);
  clearAnnotations();
});
chartSeperation_Global.addEventListener("change", function () {
  console.log("change BoxHeight to: " + chartSeperation_Global.value);
  chartSeperation = parseFloat(chartSeperation_Global.value);
  clearAnnotations();
});


console.log(boxAnnotations);
console.log(boxAnnotations2);

//** REMOVE BOX ANNOTATION */
// setTimeout(() => {
//   boxAnnotations.splice(0, 3);
//   console.log(boxAnnotations);
//   chart.update();
// }, 2000);
