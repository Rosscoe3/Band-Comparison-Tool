import "./style.css";

//** CHART JS SETUP */
const ctx = document.getElementById("VSWIR");
const ctx2 = document.getElementById("TIR");
var chart1_element = document.getElementById("VSWIR_Chart");
var chart2_element = document.getElementById("TIRS_Chart");
var chart_container = document.getElementById("chart_container");
let myData = "/files/myData.csv";

let transmissionData = [];
var boxAnnotations = [];
var boxAnnotations2 = [];
var groupsToggled = ['L8-9'];
var labels = [];

//** MIN AND MAX VALUES */
var arrayEndCut_chart1 = 1150;
var transmissionDataResolution = 1;
var minChartTwo = 7000;
var boxSeperation = 0.05;
var boxHeight = 0.03;
var groupSeperation = 0.15;

//** GRAB HTML OBJECTS */
let sidebarButton = document.getElementById("openSidebarIcon");
let layers = document.getElementById("layers");
let loadingScreen = document.getElementById("loading");

// let L8_9_Toggle = document.getElementById("Landsat8-9");
// let L4_5_Toggle = document.getElementById("Landsat4-5");
// let L1_3_Toggle = document.getElementById("Landsat1-3");
// let L7Toggle = document.getElementById("Landsat7");
// let LNext_Toggle = document.getElementById("LandsatNext");
// let Sentintel2_Toggle = document.getElementById("Sentinel-2");
// let Sentintel3_Toggle = document.getElementById("Sentinel-3");
// let EO1_Toggle = document.getElementById("EO1");
// let DESIS_Toggle = document.getElementById("DESIS");
// let ECOSTRESS_Toggle = document.getElementById("ECOSTRESS");
// let EMIT_Toggle = document.getElementById("EMIT");
// let MODIS_Toggle = document.getElementById("MODIS");

let L1_3_Dropdown = document.getElementById("preset_L1-3");
let L4_5_Dropdown = document.getElementById("preset_L4-5");
let L8_9_Dropdown = document.getElementById("preset_L8-9");
let LNext_Dropdown = document.getElementById("preset_LNext");
let Sentinel2_Dropdown = document.getElementById("preset_Sentinel2");
let Sentinel3_Dropdown = document.getElementById("preset_Sentinel3");
let EO1_Dropdown = document.getElementById("preset_EO1");
let DESIS_Dropdown = document.getElementById("preset_DESIS");
let ECOSTRESS_Dropdown = document.getElementById("preset_ECOSTRESS");
let EMIT_Dropdown = document.getElementById("preset_EMIT");
let MODIS_Dropdown = document.getElementById("preset_MODIS");
let PACE_Dropdown = document.getElementById("preset_PACE");
let STELLA_Dropdown = document.getElementById("preset_STELLA");
let CUSTOM_Dropdown = document.getElementById("preset_CUSTOM");

let downloadScreenshot = document.getElementById("snapshot");

//** Graphs Styling */
let secondGraph_Toggle = document.getElementById("secondGraph_Toggle");
let transmission_Toggle = document.getElementById("transmission_Toggle");
let Chart1_min = document.getElementById("Chart1_min");
let Chart1_max = document.getElementById("Chart1_max");
let Chart2_min = document.getElementById("Chart2_min");
let Chart2_max = document.getElementById("Chart2_max");

let presetDropDown = document.getElementById("dropDownBtn");

let boxHeight_Global = document.getElementById("boxHeight_Global");
let boxSeperation_Global = document.getElementById("boxSeperation_Global");
let groupSeperation_Global = document.getElementById("groupSeperation_Global");
let labelSize_Global = document.getElementById("labelSize_Global");
let labelSublabelSize_Global = document.getElementById("labelSublabelSize_Global");

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
      lineTension: 0.2,
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
      lineTension: 0.2,
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
          text: "Atmospheric Transmission",
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
        min: parseInt(Chart1_min.value),
        max: parseInt(Chart1_max.value),
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
        min: parseInt(Chart2_min.value),
        max: parseInt(Chart2_max.value),
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
function plotCSV() 
{
  let compressedArray = transmissionData.filter((element, index) => {
    return index % transmissionDataResolution === 0;
  });

  //** DETERMINE TRANSMISSION CURVE FOR CHART 1 */
  // - arrayEndCut_chart1
  for (var i = 0; i < compressedArray.length; i++) 
  {
    chart.data.datasets[0].data[i] = {
      x: compressedArray[i].Wave * 1000,
      y: compressedArray[i].TotTrans,
    };

    chart2.data.datasets[0].data[i] = {
      x: compressedArray[i].Wave * 1000,
      y: compressedArray[i].TotTrans,
    };
  }

  //** DETERMINE TRANSMISSION CURVE FOR CHART 2 */
  // for (var i = 0; i < compressedArray.length; i++) 
  // {
  //   if((compressedArray[i].Wave * 1000) >= minChartTwo)
  //   {
  //     console.log(compressedArray[i].Wave * 1000);
  //     //** HAVE TO MAKE IT START AT DATA 0 */
  //     chart2.data.datasets[0].data.push({
  //       x: compressedArray[i].Wave * 1000,
  //       y: compressedArray[i].TotTrans,
  //     });
  //   }
  // }

  chart.update();
  chart2.update();
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

var labelSize = "15%";
var sublabelSize = "15%";
var sublabelXOffset = 0.1;
var sublabelYOffset = 0.01;

//** STARTING Values */

setTimeout(() => {
  setTimeout(() => {
    addPreset("Landsat 8-9", Landsat8_9_values);
    loopThroughLayers();
  }, 10);
}, 100);

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
  sublabelSize, 
  graphNumb
) {
  var box = {
    type: "box",
    xMin: xMin,
    xMax: xMax,
    yMin: yMin,
    yMax: yHeight,
    borderWidth: 1,
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
      size: sublabelSize,
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

  boxAnnotations.length = 0;
  boxAnnotations2.length = 0;

  //** takes out specific graph in the graph list */
  if(groupsToggled.includes(graph))
  {          
    groupsToggled.splice(groupsToggled.indexOf(graph), 1);
  }
  updateAnnotations();
}

//** UPDATES ALL CURRENTLY SELECTED ANNOTATIONS */
function updateAnnotations()
{
  var offsetY = groupSeperation; 
  var mins1 = [];
  var maxes1 = [];
  var mins2 = [];
  var maxes2 = [];

  for(var i = 0; i < groupsToggled.length; i++)
  {
    offsetY = groupSeperation * i;

    // if(groupsToggled[i] == 'L8-9')
    // {
    //   mins1.push(430);
    //   mins2.push(10600);

    //   maxes1.push(2290);
    //   maxes2.push(12510);
      
    //   //** Band 1 - Coastal aerosol	*/
    //   addBox(430, 450, 
    //     offsetY + 0.1 + boxSeperation, 
    //     offsetY + 0.1 + boxHeight + boxSeperation, 
    //     "rgb(103,156,191)", "1", labelSize, "30m", sublabelSize, 1);
      
    //   //** Band 2 - Blue */
    //   addBox(450, 510, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(0,101,141)", "2", labelSize, "30m", sublabelSize, 1);
      
    //   //** Band 3 - Green */
    //   addBox(530, 590, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(76,157,95)", "3", labelSize, "30m", sublabelSize, 1);
      
    //   //** Band 4 - Red */
    //   addBox(640, 670, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(194,32,54)", "4", labelSize, "30m", sublabelSize, 1);
      
    //   //** Band 5 - Near Infrared (NIR) */
    //   addBox(850, 880, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(197,162,189)", "5", labelSize, "30m", sublabelSize, 1);
      
    //   //** Band 6 - Shortwave Infrared (SWIR) 1	 */
    //   addBox(1570, 1650, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(211,153,121)", "6", labelSize, "30m", sublabelSize, 1);
      
    //   //** Band 7 - Shortwave Infrared (SWIR) 2 */
    //   addBox(2110, 2290, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(153,156,150)", "7", labelSize, "30m", sublabelSize, 1);
      
    //   //** Band 8 - Panchromatic */
    //   addBox(500, 680, 
    //     (offsetY + 0.1) - boxSeperation, 
    //     (offsetY + 0.1 + boxHeight) - boxSeperation, 
    //     "rgb(0,143,162)", "8", labelSize, "15m", sublabelSize, 1);
      
    //   //** Band 9 - Cirrus */
    //   addBox(1360, 1380, 
    //     offsetY + 0.1 + boxSeperation, 
    //     offsetY + 0.1 + boxHeight + boxSeperation, 
    //     "rgb(116,128,161)", "9", labelSize, "30m", sublabelSize, 1);
      
    //   //** Band 10 - Thermal Infrared (TIRS) 1 */
    //   addBox(10600, 11190, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(188,122,130)", "10", labelSize, "100m", sublabelSize, 2);
      
    //   //** Band 11 - Thermal Infrared (TIRS) 2 */
    //   addBox(11500, 12510, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(188,122,130)", "11", labelSize, "100m", sublabelSize, 2);
    // }
    // else if(groupsToggled[i] == 'L7')
    // {
    //   mins1.push(450);
    //   mins2.push(10400);

    //   maxes1.push(2090);
    //   maxes2.push(12500);
      
    //   addBox(450, 520, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(0,101,141)", "1", labelSize, "30m", sublabelSize, 1);
    //   addBox(520, 600, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(76,157,95)", "2", labelSize, "30m", sublabelSize, 1);
    //   addBox(630, 690, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(194,32,54)", "3", labelSize, "30m", sublabelSize, 1);
    //   addBox(770, 900, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(197,162,189)", "4", labelSize, "30m", sublabelSize, 1);
    //   addBox(1550, 1750, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(211,153,121)", "5", labelSize, "30m", sublabelSize, 1);
    //   addBox(10400, 12500, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(188,122,130)", "6", labelSize, "60m", sublabelSize, 2);
    //   addBox(2090, 2350, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(153,156,150)", "7", labelSize, "30m", sublabelSize, 1);
    //   addBox(520, 900, 
    //     (offsetY + 0.1) - boxSeperation, 
    //     (offsetY + 0.1 + boxHeight) - boxSeperation, 
    //     "rgb(0,143,162)", "8", labelSize, "15m", sublabelSize, 1);
    // }
    // else if(groupsToggled[i] == 'L4-5')
    // {
    //   mins1.push(450);
    //   mins2.push(10400);

    //   maxes1.push(2350);
    //   maxes2.push(12500);
      
    //   addBox(450, 520, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(0,101,141)", "1", labelSize, "30m", sublabelSize, 1);
      
    //   addBox(520, 600, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(76,157,95)", "2", labelSize, "30m", sublabelSize, 1);
      
    //   addBox(630, 690, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(194,32,54)", "3", labelSize, "30m", sublabelSize, 1);
      
    //   addBox(760, 900, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(197,162,189)", "4", labelSize, "30m", sublabelSize, 1);
      
    //   addBox(1550, 1750, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(211,153,121)", "5", labelSize, "30m", sublabelSize, 1);
      
    //   addBox(10400, 12500, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(188,122,130)", "6", labelSize, "120m", sublabelSize, 2);
      
    //   addBox(2080, 2350, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(153,156,150)", "7", labelSize, "30m", sublabelSize, 2);
    // }
    // else if(groupsToggled[i] == 'L1-3')
    // {
    //   mins1.push(500);
    //   maxes1.push(1100);
      
    //   addBox(500, 600, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(76,157,95)", "1", labelSize, "80m", sublabelSize, 1);

    //   addBox(600, 700, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(194,32,54)", "2", labelSize, "80m", sublabelSize, 1);

    //   addBox(700, 800, 
    //     offsetY + 0.1,
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(125,38,82)", "3", labelSize, "80m", sublabelSize, 1);

    //   addBox(800, 1100, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(197,162,189)", "4", labelSize, "80m", sublabelSize, 1);
    // } 
    // if(groupsToggled[i] == 'LNext')
    // {
    //   mins1.push(402);
    //   mins2.push(8050);

    //   maxes1.push(2231);
    //   maxes2.push(12225);
      
    //   //** Band 1 - Violet	*/
    //   addBox(402, 422, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(127,176,198)", "1", labelSize, "60m", sublabelSize, 1);

    //   //** Band 2 - Coastal/Aerosol		*/
    //   addBox(433, 453, 
    //     offsetY + 0.1 + boxSeperation, 
    //     offsetY + 0.1 + boxHeight + boxSeperation, 
    //     "rgb(127,176,198)", "2", labelSize, "20m", sublabelSize, 1);

    //   //** Band 3 - Blue 	*/
    //   addBox(457.5, 522.5, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(26,125,158)", "3", labelSize, "10m", sublabelSize, 1);

    //   //** Band 4 - Green 	*/
    //   addBox(542.5, 577.5, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight,
    //     "rgb(116,169,124)", "4", labelSize, "10m", sublabelSize, 1);

    //   //** Band 5 - Yellow 	*/
    //   addBox(585, 615, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(202,197,63)", "5", labelSize, "20m", sublabelSize, 1);

    //   //** Band 6 - Orange	*/
    //   addBox(610, 630, 
    //     offsetY + 0.1 + boxSeperation, 
    //     offsetY + 0.1 + boxHeight + boxSeperation, 
    //     "rgb(202,165,83)", "6", labelSize, "20m", sublabelSize, 1);

    //   //** Band 7 - Red 1	 */
    //   addBox(640, 660, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(182,61,76)", "7", labelSize, "20m", sublabelSize, 1);

    //   //** Band 8 - Red 2  */
    //   addBox(650, 680, 
    //     offsetY + 0.1 + boxSeperation, 
    //     offsetY + 0.1 + boxHeight + boxSeperation, 
    //     "rgb(182,61,76)", "8", labelSize, "10m", sublabelSize, 1);

    //   //** Band 9 - Red Edge 1  */
    //   addBox(697.5, 712.5, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(105,0,34)", "9", labelSize, "20m", sublabelSize, 1);
      
    //   //** Band 10 - Red Edge 2  */
    //   addBox(732.5, 747.5, 
    //     offsetY + 0.1 + boxSeperation, 
    //     offsetY + 0.1 + boxHeight + boxSeperation, 
    //     "rgb(105,0,34)", "10", labelSize, "20m", sublabelSize, 1);

    //   //** Band 11 - NIR Broad  */
    //   addBox(784.5, 899.5, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight,
    //     "rgb(181,176,196)", "11", labelSize, "10m", sublabelSize, 1);

    //   //** Band 12 - NIR 1  */
    //   addBox(855, 875, 
    //     offsetY + 0.1 + boxSeperation, 
    //     offsetY + 0.1 + boxHeight + boxSeperation, 
    //     "rgb(181,176,196)", "12", labelSize, "20m", sublabelSize, 1);

    //   //** Band 13 - Water Vapor  */
    //   addBox(935, 955, 
    //     offsetY + 0.1 + boxSeperation, 
    //     offsetY + 0.1 + boxHeight + boxSeperation, 
    //     "rgb(121,57,160)", "13", labelSize, "60m", sublabelSize, 1);

    //   //** Band 14 - Liquid Water  */
    //   addBox(975, 995, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight,
    //     "rgb(181,176,196)", "14", labelSize, "20m", sublabelSize, 1);
      
    //   //** Band 15 - Snow/Ice 1  */
    //   addBox(1025, 1045, 
    //     offsetY + 0.1 + boxSeperation, 
    //     offsetY + 0.1 + boxHeight + boxSeperation, 
    //     "rgb(181,176,196)", "15", labelSize, "20m", sublabelSize, 1);
      
    //   //** Band 16 - Snow/Ice 2  */
    //   addBox(1080, 1100, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight,
    //     "rgb(181,176,196)", "16", labelSize, "20m", sublabelSize, 1);
      
    //   //** Band 17 - Cirrus  */
    //   addBox(1360, 1390, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(141,150,171)", "17", labelSize, "60m", sublabelSize, 1);
      
    //   //** Band 18 - SWIR 1  */
    //   addBox(1565, 1655, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(194,170,148)", "18", labelSize, "10m", sublabelSize, 1);

    //   //** Band 19 - SWIR 2a  */
    //   addBox(2025.5, 2050.5, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(200,134,71)", "19", labelSize, "20m", sublabelSize, 1);
      
    //   //** Band 20 - SWIR 2b  */
    //   addBox(2088, 2128, 
    //     offsetY + 0.1 + boxSeperation, 
    //     offsetY + 0.1 + boxHeight + boxSeperation, 
    //     "rgb(200,134,71)", "20", labelSize, "20m", sublabelSize, 1);

    //   //** Band 21 - SWIR 2c  */
    //   addBox(2191, 2231, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(200,134,71)", "21", labelSize, "20m", sublabelSize, 1);

    //   //** Band 22 - TIR 1  */
    //   addBox(8050, 8425, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(183,148,152)", "22", labelSize, "60m", sublabelSize, 2);

    //   //** Band 23 - TIR 2  */
    //   addBox(8425, 8775, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(183,148,152)", "23", labelSize, "60m", sublabelSize, 2);
      
    //   //** Band 24 - TIR 3  */
    //   addBox(8925, 9275, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(183,148,152)", "24", labelSize, "60m", sublabelSize, 2);

    //   //** Band 25 - TIR 4  */
    //   addBox(11025, 11575, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(182,127,129)", "25", labelSize, "60m", sublabelSize, 2);

    //   //** Band 26 - TIR 5  */
    //   addBox(11775, 12225, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(182,127,129)", "26", labelSize, "60m", sublabelSize, 2);
    // }

    // if(groupsToggled[i] == 'Sent-2')
    // {
    //   mins1.push(433);
    //   maxes1.push(2280);
      
    //   //** B1 - CA */
    //   addBox(433, 453, 
    //     offsetY + 0.1 + boxSeperation, 
    //     offsetY + 0.1 + boxHeight + boxSeperation, 
    //     "rgb(103,156,191)", "1", labelSize, "60m", sublabelSize, 1);
      
    //   //** B2 - Blue */
    //     addBox(457.5, 522.5, 
    //     (offsetY + 0.1) - boxSeperation, 
    //     (offsetY + 0.1 + boxHeight) - boxSeperation,
    //      "rgb(0,101,141)", "2", labelSize, "10m", sublabelSize, 1);
      
    //   //** B3 - Green */
    //   addBox(542, 577.5, 
    //     (offsetY + 0.1) - boxSeperation, 
    //     (offsetY + 0.1 + boxHeight) - boxSeperation, 
    //     "rgb(76,157,95)", "3", labelSize, "10m", sublabelSize, 1);
      
    //   //** B4 - Red */
    //   addBox(649.5, 680.5, 
    //     (offsetY + 0.1) - boxSeperation, 
    //     (offsetY + 0.1 + boxHeight) - boxSeperation, 
    //     "rgb(194,32,54)", "4", labelSize, "10m", sublabelSize, 1);
      
    //   //** B5 - Red Edge */
    //   addBox(697.5, 712.5, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(197,162,189)", "5", labelSize, "20m", sublabelSize, 1);
      
    //   //** B6 - NIR-1 */
    //   addBox(732.5, 747.5, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(211,153,121)", "6", labelSize, "20m", sublabelSize, 1);
      
    //   //** B7 - NIR-2 */
    //   addBox(773, 793, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(153,156,150)", "7", labelSize, "20m", sublabelSize, 1);
      
    //   //** B8 - NIR-3	 */
    //   addBox(784.5, 899.5, 
    //     (offsetY + 0.1) - boxSeperation, 
    //     (offsetY + 0.1 + boxHeight) - boxSeperation, 
    //     "rgb(0,143,162)", "8", labelSize, "10m", sublabelSize, 1);
      
    //   //** B8a - Water Vapor-1	 */
    //   addBox(855, 875, 
    //     offsetY + 0.1 + boxSeperation, 
    //     offsetY + 0.1 + boxHeight + boxSeperation, 
    //     "rgb(116,128,161)", "8a", labelSize, "20m", sublabelSize, 1);

    //   //** B9 - Water Vapor-2 */
    //   addBox(935, 945, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(211,153,121)", "9", labelSize, "60m", sublabelSize, 1);  
      
    //   //** B10 - Cirrus */
    //   addBox(1365, 1395, 
    //     offsetY + 0.1 + boxSeperation, 
    //     offsetY + 0.1 + boxHeight + boxSeperation, 
    //     "rgb(188,122,130)", "10", labelSize, "60m", sublabelSize, 1);
      
    //   //** B11 - SWIR1 */
    //   addBox(1565, 1655, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(188,122,130)", "11", labelSize, "20m", sublabelSize, 1);
      
    //   //** B12 - SWIR2 */
    //   addBox(2100, 2280, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(188,122,130)", "12", labelSize, "20m", sublabelSize, 1);
    // }
    // if(groupsToggled[i] == 'Sent-3')
    // {
    //   mins1.push(395);
    //   maxes1.push(1040);

    //   //** Oa01 - CA-1 */
    //   addBox(395, 405, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight,
    //     "rgb(103,156,191)", "1", labelSize, "300m", sublabelSize, 1);
      
    //   //** Oa02 - CA-2 */
    //     addBox(407, 417, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight,
    //     "rgb(0,101,141)", "2", labelSize, "300m", sublabelSize, 1);
      
    //   //** Oa03 - CA-3 */
    //   addBox(438, 448, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(76,157,95)", "3", labelSize, "300m", sublabelSize, 1);
      
    //   //** Oa04 - Blue-1 */
    //   addBox(485, 495, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(194,32,54)", "4", labelSize, "300m", sublabelSize, 1);
      
    //   //** Oa05 - Blue-2 */
    //   addBox(505, 515, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(197,162,189)", "5", labelSize, "300m", sublabelSize, 1);
      
    //   //** Oa06 - Green */
    //   addBox(555, 565, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(197,162,189)", "6", labelSize, "300m", sublabelSize, 1);

    //   //** Oa07 - Red-1 */
    //   addBox(615, 625, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(197,162,189)", "7", labelSize, "300m", sublabelSize, 1);
      
    //   //** Oa08 - Red-2 */
    //   addBox(660, 670, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(197,162,189)", "8", labelSize, "300m", sublabelSize, 1);
      
    //   //** Oa09 - Red-3 */
    //   addBox(670, 677, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(197,162,189)", "9", labelSize, "300m", sublabelSize, 1);
      
    //   //** Oa10 - Red-4 */
    //   addBox(677, 685, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(197,162,189)", "10", labelSize, "300m", sublabelSize, 1);

    //   //** Oa11 - NIR-1 */
    //   addBox(703, 713, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(197,162,189)", "11", labelSize, "300m", sublabelSize, 1);
      
    //   //** Oa12 - NIR-2 */
    //   addBox(750, 757, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(197,162,189)", "12", labelSize, "300m", sublabelSize, 1);

    //   //** Oa13 - NIR-3 */
    //   addBox(760, 762, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(197,162,189)", "13", labelSize, "300m", sublabelSize, 1);

    //   //** Oa14 - NIR-4 */
    //   addBox(762, 766, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(197,162,189)", "14", labelSize, "300m", sublabelSize, 1);

    //   //** Oa15 - NIR-5 */
    //   addBox(766, 769, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(197,162,189)", "15", labelSize, "300m", sublabelSize, 1);

    //   //** Oa16 - NIR-6 */
    //   addBox(771, 786, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(197,162,189)", "16", labelSize, "300m", sublabelSize, 1);

    //   //** Oa17 - NIR-7 */
    //   addBox(855, 875, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(197,162,189)", "17", labelSize, "300m", sublabelSize, 1);

    //   //** Oa18 - NIR-8 */
    //   addBox(880, 890, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(197,162,189)", "18", labelSize, "300m", sublabelSize, 1);

    //   //** Oa19 - NIR-9 */
    //   addBox(895, 905, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(197,162,189)", "19", labelSize, "300m", sublabelSize, 1);

    //   //** Oa20 - NIR-10 */
    //   addBox(930, 950, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(197,162,189)", "20", labelSize, "300m", sublabelSize, 1);

    //   //** Oa21 - NIR-11 */
    //   addBox(1000, 1040, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(197,162,189)", "21", labelSize, "300m", sublabelSize, 1);
    // }
    // if(groupsToggled[i] == 'EO-1')
    // {
    //   mins1.push(433);
    //   maxes1.push(2350);
      
    //   //** Band 1 CA */
    //   addBox(433, 453, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight,
    //     "rgb(103,156,191)", "1", labelSize, "30m", sublabelSize, 1);

    //   //** Band 2 Blue */
    //   addBox(450, 515, 
    //     offsetY + 0.1 + boxSeperation, 
    //     offsetY + 0.1 + boxHeight + boxSeperation, 
    //     "rgb(26,125,158)", "2", labelSize, "30m", sublabelSize, 1);

    //   //** Band 3 - Green */
    //   addBox(525, 605, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight,
    //     "rgb(116,169,124)", "3", labelSize, "30m", sublabelSize, 1);

    //   //** Band 4 - Red */
    //   addBox(630, 690, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight,
    //     "rgb(182,61,76)", "4", labelSize, "30m", sublabelSize, 1);

    //   //** Band 5 - NIR-1 */
    //   addBox(775, 805, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight,
    //     "rgb(105,0,34)", "5", labelSize, "30m", sublabelSize, 1);

    //   //** Band 6 - NIR-2 */
    //   addBox(845, 890, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight,
    //     "rgb(181,176,196)", "6", labelSize, "30m", sublabelSize, 1);
      
    //   //** Band 7 - NIR-3 */
    //   addBox(1200, 1300, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight,
    //     "rgb(141,150,171)", "7", labelSize, "30m", sublabelSize, 1);

    //   //** Band 8 - SWIR1 */
    //   addBox(1550, 1750, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight,
    //     "rgb(211,153,121)", "8", labelSize, "30m", sublabelSize, 1);

    //   //** Band 9 - SWIR2 */
    //   addBox(2080, 2350, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight,
    //     "rgb(200,134,71)", "9", labelSize, "30m", sublabelSize, 1);

    //   //** Band 10 - Panchromatic */
    //   addBox(480, 690, 
    //     (offsetY + 0.1) - boxSeperation, 
    //     (offsetY + 0.1 + boxHeight) - boxSeperation,
    //     "rgb(103,156,191)", "10", labelSize, "10m", sublabelSize, 1); 
    // }
    // else if(groupsToggled[i] == 'DESIS')
    // {
    //   mins1.push(400);
    //   maxes1.push(1000);
      
    //   var width = 2.5;
    //   var length = (600/width);

    //   // addBox(402, 1000, 
    //   //   offsetY + 0.1, 
    //   //   offsetY + 0.1 + boxHeight,
    //   //   "rgb(103,156,191)", "", labelSize, "", sublabelSize, 1);

    //   addInLine(400, width, length, offsetY, "rgb(142,172,130)");
      
    //   // for(var i = 0; i <= length; i++)
    //   // {
    //   //   var start = 400 + (width * i);
        
    //   //   addBox(start, start + width, 
    //   //     offsetY + 0.1, 
    //   //     offsetY + 0.1 + boxHeight,
    //   //     "rgb(103,156,191)", "", labelSize, "", sublabelSize, 1); 
    //   // }
    // }
    // if(groupsToggled[i] == 'ECOSTRESS')
    // {
    //   mins1.push(1475);
    //   mins2.push(8113);

    //   maxes1.push(1845);
    //   maxes2.push(12395.5);
      
    //   //** B1 */
    //   addBox(1475, 1845, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight,
    //     "rgb(146,208,80)", "1", labelSize, "70m", sublabelSize, 1);

    //   //** B2 */
    //   addBox(8113, 8467, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight,
    //     "rgb(146,208,80)", "2", labelSize, "70m", sublabelSize, 2);
      
    //   //** B3 */
    //   addBox(8625, 8935, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight,
    //     "rgb(146,208,80)", "3", labelSize, "70m", sublabelSize, 2);
      
    //   //** B4 */
    //   addBox(9002, 9398, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight,
    //     "rgb(146,208,80)", "4", labelSize, "70m", sublabelSize, 2);
      
    //   //** B5 */
    //   addBox(10285, 10695, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight,
    //     "rgb(146,208,80)", "5", labelSize, "70m", sublabelSize, 2);

    //   //** B6 */
    //   addBox(11784.5, 12395.5, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight,
    //     "rgb(146,208,80)", "6", labelSize, "70m", sublabelSize, 2);
    // }
    // else if(groupsToggled[i] == 'EMIT')
    // {
    //   mins1.push(380);
    //   maxes1.push(2500);
      
    //   var width = 7.5;
    //   var length = (2070/width);
      
    //   addInLine(380, width, length, offsetY, "rgb(226,178,128)");
    // }
    // if(groupsToggled[i] == 'MODIS')
    // {
    //   mins1.push(405);
    //   mins2.push(3660);

    //   maxes1.push(2155);
    //   maxes2.push(14385);
      
    //   //** Band 1 - Shortwave/VIS	*/
    //   addBox(620, 670, 
    //     offsetY + 0.1 + boxSeperation, 
    //     offsetY + 0.1 + boxHeight + boxSeperation, 
    //     "rgb(202,165,83)", "1", labelSize, "250m", sublabelSize, 1);

    //   //** Band 2 - Shortwave/NIR	*/
    //   addBox(841, 876, 
    //     offsetY + 0.1 + boxSeperation, 
    //     offsetY + 0.1 + boxHeight + boxSeperation,
    //     "rgb(181,176,196)", "2", labelSize, "250m", sublabelSize, 1);

    //   //** Band 3 - Shortwave/VIS	*/
    //   addBox(459, 479, 
    //     offsetY + 0.1 + boxSeperation, 
    //     offsetY + 0.1 + boxHeight + boxSeperation,
    //     "rgb(26,125,158)", "3", labelSize, "500m", sublabelSize, 1);

    //   //** Band 4 - Shortwave/VIS	*/
    //   addBox(545, 565, 
    //     offsetY + 0.1 + boxSeperation, 
    //     offsetY + 0.1 + boxHeight + boxSeperation,
    //     "rgb(116,169,124)", "4", labelSize, "500m", sublabelSize, 1);

    //   //** Band 5 - Shortwave/NIR	*/
    //   addBox(1230, 1250, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(141,150,171)", "5", labelSize, "500m", sublabelSize, 1);

    //   //** Band 6 - Shortwave/NIR	*/
    //   addBox(1628, 1652, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(194,170,148)", "6", labelSize, "500m", sublabelSize, 1);

    //   //** Band 7 - Shortwave/NIR	*/
    //   addBox(2105, 2155, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(200,134,71)", "7", labelSize, "500m", sublabelSize, 1);
      
    //   //** Band 8 - Shortwave/VIS	*/
    //   addBox(405, 420, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(127,176,198)", "8", labelSize, "1000m", sublabelSize, 1);

    //   //** Band 9 - Shortwave/VIS	*/
    //   addBox(438, 448, 
    //     (offsetY + 0.1) - boxSeperation, 
    //     (offsetY + 0.1 + boxHeight) - boxSeperation, 
    //     "rgb(127,176,198)", "9", labelSize, "1000m", sublabelSize, 1);

    //   //** Band 10 - Shortwave/VIS	*/
    //   addBox(483, 493, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(26,125,158)", "10", labelSize, "1000m", sublabelSize, 1);

    //   //** Band 11 - Shortwave/VIS	*/
    //   addBox(526, 536, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(26,125,158)", "11", labelSize, "1000m", sublabelSize, 1);

    //   //** Band 12 - Shortwave/VIS	*/
    //   addBox(546, 556, 
    //     (offsetY + 0.1) - boxSeperation, 
    //     (offsetY + 0.1 + boxHeight) - boxSeperation, 
    //     "rgb(116,169,124)", "12", labelSize, "1000m", sublabelSize, 1);
      
    //   //** Band 13 - Shortwave/VIS	*/
    //   addBox(662, 672, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(182,61,76)", "13", labelSize, "1000m", sublabelSize, 1);

    //   //** Band 14 - Shortwave/VIS	*/
    //   addBox(673, 683, 
    //     (offsetY + 0.1) - boxSeperation, 
    //     (offsetY + 0.1 + boxHeight) - boxSeperation, 
    //     "rgb(182,61,76)", "14", labelSize, "1000m", sublabelSize, 1);

    //   //** Band 15 - Shortwave/VIS	*/
    //   addBox(743, 753, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(127,176,198)", "15", labelSize, "1000m", sublabelSize, 1);

    //   //** Band 16 - Shortwave/VIS	*/
    //   addBox(862, 877, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(181,176,196)", "16", labelSize, "1000m", sublabelSize, 1);

    //   //** Band 17 - Shortwave/VIS	*/
    //   addBox(890, 920, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(181,176,196)", "17", labelSize, "1000m", sublabelSize, 1);

    //   //** Band 18 - Shortwave/VIS	*/
    //   addBox(931, 941, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(181,176,196)", "18", labelSize, "1000m", sublabelSize, 1);

    //   //** Band 19 - Shortwave/VIS	*/
    //   addBox(915, 965, 
    //     (offsetY + 0.1) - boxSeperation, 
    //     (offsetY + 0.1 + boxHeight) - boxSeperation, 
    //     "rgb(121,57,160)", "19", labelSize, "1000m", sublabelSize, 1);

    //   //** Band 20 - Longwave thermal Infrared/TIR	*/
    //   addBox(3660, 3840, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(127,176,198)", "20", labelSize, "1000m", sublabelSize, 2);

    //   //** Band 21 - Longwave thermal Infrared/TIR	*/
    //   addBox(3929, 3989, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(127,176,198)", "21", labelSize, "1000m", sublabelSize, 2);

    //   //** Band 22 - Longwave thermal Infrared/TIR	*/
    //   addBox(3929, 3989, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(127,176,198)", "22", labelSize, "1000m", sublabelSize, 2);

    //   //** Band 23 - Longwave thermal Infrared/TIR	*/
    //   addBox(4020, 4080, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(127,176,198)", "23", labelSize, "1000m", sublabelSize, 2);

    //   //** Band 24 - Longwave thermal Infrared/TIR	*/
    //   addBox(4433, 4498, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(127,176,198)", "24", labelSize, "1000m", sublabelSize, 2);

    //   //** Band 25 - Longwave thermal Infrared/TIR	*/
    //   addBox(4482, 4549, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(127,176,198)", "25", labelSize, "1000m", sublabelSize, 2);

    //   //** Band 26 - Longwave thermal Infrared/TIR	*/
    //   addBox(1360, 1390, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(127,176,198)", "26", labelSize, "1000m", sublabelSize, 1);

    //   //** Band 27 - Longwave thermal Infrared/TIR	*/
    //   addBox(6535, 6895, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(127,176,198)", "27", labelSize, "1000m", sublabelSize, 2);

    //   //** Band 28 - Longwave thermal Infrared/TIR	*/
    //   addBox(7175, 7475, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(183,148,152)", "28", labelSize, "1000m", sublabelSize, 2);

    //   //** Band 29 - Longwave thermal Infrared/TIR	*/
    //   addBox(8400, 8700, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(183,148,152)", "29", labelSize, "1000m", sublabelSize, 2);

    //   //** Band 30 - Longwave thermal Infrared/TIR	*/
    //   addBox(9580, 9880, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(183,148,152)", "30", labelSize, "1000m", sublabelSize, 2);

    //   //** Band 31 - Longwave thermal Infrared/TIR	*/
    //   addBox(10780, 11280, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(182,127,129)", "31", labelSize, "1000m", sublabelSize, 2);

    //   //** Band 32 - Longwave thermal Infrared/TIR	*/
    //   addBox(11770, 12270, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(182,127,129)", "32", labelSize, "1000m", sublabelSize, 2);

    //   //** Band 33 - Longwave thermal Infrared/TIR	*/
    //   addBox(13185, 13485, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(182,127,129)", "33", labelSize, "1000m", sublabelSize, 2);

    //   //** Band 34 - Longwave thermal Infrared/TIR	*/
    //   addBox(13485, 13785, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(182,127,129)", "34", labelSize, "1000m", sublabelSize, 2);

    //   //** Band 35 - Longwave thermal Infrared/TIR	*/
    //   addBox(13785, 14085, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(182,127,129)", "35", labelSize, "1000m", sublabelSize, 2);

    //   //** Band 36 - Longwave thermal Infrared/TIR	*/
    //   addBox(14085, 14385, 
    //     offsetY + 0.1, 
    //     offsetY + 0.1 + boxHeight, 
    //     "rgb(182,127,129)", "36", labelSize, "1000m", sublabelSize, 2);
    // }
  }

  if(mins1.length > 0 && mins2.length > 0)
  {
    //** Update min and max values of charts manually *//
    updateMinAndMax(
      Math.min.apply(Math, mins1), 
      Math.min.apply(Math, mins2),
      Math.max.apply(Math, maxes1),
      Math.max.apply(Math, maxes2));
  }
  else
  {
    updateMinAndMax(
      450, 
      7050,
      2450,
      13950);
  }

  chart.update();
  chart2.update();
}

//** UPDATE MIN AND MAX FOR CHARTS DEPENDING ON PRESETS SELECTED */
function updateMinAndMax(min1, min2, max1, max2)
{
  var padding = 50;

  chart.options.scales.x.min = parseInt(min1) - padding;
  chart.options.scales.x.max = parseInt(max1) + padding;

  chart2.options.scales.x.min = parseInt(min2) - padding;
  chart2.options.scales.x.max = parseInt(max2) + padding;

  Chart1_min.value = parseInt(min1) - padding;
  Chart1_max.value = parseInt(max1) + padding;

  Chart2_min.value = parseInt(min2) - padding;
  Chart2_max.value = parseInt(max2) + padding;

  //console.log("min1: " + Chart1_min.value);
  //console.log("max1: " + Chart1_max.value);
  //console.log("min2: " + Chart2_min.value);
  //console.log("max2: " + Chart2_max.value);

  chart.update();
  chart2.update();
}

function addInLine(startNmb, width, length, offsetY, color)
{ 
  for(var i = 0; i <= length; i++)
  {
    var start = startNmb + (width * i);
    
    addBox(start, start + width, 
      offsetY + 0.1, 
      offsetY + 0.1 + boxHeight,
      color, "", labelSize, "", sublabelSize, 1); 
  }
}

//** ARRAYS OF PRESET VALUES */
var Landsat1_3_values = [
  {
    color: '#4c9d5f',
    xMin: 500, 
    xMax: 600,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "1",
    sublabelSize: 15, 
    subLabelText: '80m',
    graphNumb: 1,
    yOffset: 0,
    link: "https://landsat.gsfc.nasa.gov/satellites/",
  },
  {
    color: '#c22036',
    xMin: 600, 
    xMax: 700,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "2",
    sublabelSize: 15, 
    subLabelText: '80m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    color: '#7d2652',
    xMin: 700, 
    xMax: 800,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "3",
    sublabelSize: 15, 
    subLabelText: '80m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    color: '#c5a2bd',
    xMin: 800, 
    xMax: 1100,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "4",
    sublabelSize: 15, 
    subLabelText: '80m',
    graphNumb: 1,
    yOffset: 0,
  },  
];
var Landsat4_5_values = [
  {
    color: '#00658d',
    xMin: 450, 
    xMax: 520,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "1",
    sublabelSize: 15, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0,
    link: "https://landsat.gsfc.nasa.gov/satellites/",
  },
  {
    color: '#4c9d5f',
    xMin: 520, 
    xMax: 600,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "2",
    sublabelSize: 15, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    color: '#c22036',
    xMin: 630, 
    xMax: 690,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "3",
    sublabelSize: 15, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    color: '#c5a2bd',
    xMin: 760, 
    xMax: 900,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "4",
    sublabelSize: 15, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0,
  },  
  {
    color: '#d39979',
    xMin: 1550, 
    xMax: 1750,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "5",
    sublabelSize: 15, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0,
  },  
  {
    color: '#bc7a82',
    xMin: 10400, 
    xMax: 12500,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "6",
    sublabelSize: 15, 
    subLabelText: '120m',
    graphNumb: 2,
    yOffset: 0,
  },  
  {
    color: '#999c96',
    xMin: 2080, 
    xMax: 2350,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "7",
    sublabelSize: 15, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0,
  },  
];
var Landsat8_9_values = [
  {
    //** Band 1 - Coastal aerosol	*/
    color: '#679cbf',
    xMin: 430, 
    xMax: 450,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "1",
    sublabelSize: 15, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0.05,
    link: "https://landsat.gsfc.nasa.gov/satellites/",
  },
  {
    //** Band 2 - Blue */
    color: '#00658d',
    xMin: 450, 
    xMax: 510,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "2",
    sublabelSize: 15, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 3 - Green */
    color: '#4c9d5f',
    xMin: 530, 
    xMax: 590,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "3",
    sublabelSize: 15, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 4 - Red */
    color: '#c22036',
    xMin: 640, 
    xMax: 670,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "4",
    sublabelSize: 15, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 5 - Near Infrared (NIR) */
    color: '#c5a2bd',
    xMin: 850, 
    xMax: 880,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "5",
    sublabelSize: 15, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 6 - Shortwave Infrared (SWIR) 1	 */
    color: '#d39979',
    xMin: 1570, 
    xMax: 1650,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "6",
    sublabelSize: 15, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 7 - Shortwave Infrared (SWIR) 2 */
    color: '#999c96',
    xMin: 2110, 
    xMax: 2290,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "7",
    sublabelSize: 15, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 8 - Panchromatic */
    color: '#008fa2',
    xMin: 500, 
    xMax: 680,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "8",
    sublabelSize: 15, 
    subLabelText: '15m',
    graphNumb: 1,
    yOffset: -0.05,
  },
  {
    //** Band 9 - Panchromatic */
    color: '#7480a1',
    xMin: 1360, 
    xMax: 1380,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "9",
    sublabelSize: 15, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0.05,
  },
  {
    //** Band 10 - Thermal Infrared (TIRS) 1 */
    color: '#bc7a82',
    xMin: 10600, 
    xMax: 11190,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "10",
    sublabelSize: 15, 
    subLabelText: '100m',
    graphNumb: 2,
    yOffset: 0,
  },
  {
    //** Band 11 - Thermal Infrared (TIRS) 2 */
    color: '#bc7a82',
    xMin: 11500, 
    xMax: 12510,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "11",
    sublabelSize: 15, 
    subLabelText: '100m',
    graphNumb: 2,
    yOffset: 0,
  },
];
var LandsatNext_values = [
  {
    //** Band 1 - Violet	*/
    color: '#7fb0c6',
    xMin: 402, 
    xMax: 422,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "1",
    sublabelSize: 15, 
    subLabelText: '60m',
    graphNumb: 1,
    yOffset: 0,
    link: "https://landsat.gsfc.nasa.gov/satellites/",
  },
  {
    //** Band 2 - Coastal/Aerosol		*/
    color: '#7fb0c6',
    xMin: 433, 
    xMax: 453,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "2",
    sublabelSize: 15, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 0.05,
  },
  {
    //** Band 3 - Blue 	*/
    color: '#1a7d9e',
    xMin: 457.5, 
    xMax: 522.5,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "3",
    sublabelSize: 15, 
    subLabelText: '10m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 4 - Green 	*/
    color: '#74a97c',
    xMin: 542.5, 
    xMax: 577.5,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "4",
    sublabelSize: 15, 
    subLabelText: '10m',
    graphNumb: 1,
    yOffset: 0,
  },  
  {
    //** Band 5 - Yellow 	*/
    color: '#cac53f',
    xMin: 585, 
    xMax: 615,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "5",
    sublabelSize: 15, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 0,
  },  
  {
    //** Band 6 - Orange	*/
    color: '#caa553',
    xMin: 610, 
    xMax: 630,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "6",
    sublabelSize: 15, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 0.05,
  },  
  {
    //** Band 7 - Red 1	 */
    color: '#b63d4c',
    xMin: 640, 
    xMax: 660,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "7",
    sublabelSize: 15, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 0,
  },  
  {
    //** Band 8 - Red 2  */
    color: '#b63d4c',
    xMin: 650, 
    xMax: 680,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "8",
    sublabelSize: 15, 
    subLabelText: '10m',
    graphNumb: 1,
    yOffset: 0.05,
  },  
  {
    //** Band 9 - Red Edge 1  */
    color: '#690022',
    xMin: 697.5, 
    xMax: 712.5,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "9",
    sublabelSize: 15, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 10 - Red Edge 2  */
    color: '#690022',
    xMin: 732.5, 
    xMax: 747.5,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "10",
    sublabelSize: 15, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 0.05,
  },
  {
    //** Band 11 - NIR Broad  */
    color: '#b5b0c4',
    xMin: 784.5, 
    xMax: 899.5,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "11",
    sublabelSize: 15, 
    subLabelText: '10m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 12 - NIR 1  */
    color: '#b5b0c4',
    xMin: 855, 
    xMax: 875,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "12",
    sublabelSize: 15, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 0.05,
  },
  {
    //** Band 13 - Water Vapor  */
    color: '#7939a0',
    xMin: 935, 
    xMax: 955,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "13",
    sublabelSize: 15, 
    subLabelText: '60m',
    graphNumb: 1,
    yOffset: 0.05,
  },
  {
    //** Band 14 - Liquid Water  */
    color: '#b5b0c4',
    xMin: 975, 
    xMax: 995,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "14",
    sublabelSize: 15, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 15 - Snow/Ice 1  */
    color: '#b5b0c4',
    xMin: 1025, 
    xMax: 1045,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "15",
    sublabelSize: 15, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 0.05,
  },
  {
    //** Band 16 - Snow/Ice 2  */
    color: '#b5b0c4',
    xMin: 1080, 
    xMax: 1100,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "16",
    sublabelSize: 15, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 17 - Cirrus  */
    color: '#8d96ab',
    xMin: 1360, 
    xMax: 1390,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "17",
    sublabelSize: 15, 
    subLabelText: '60m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 18 - SWIR 1  */
    color: '#c2aa94',
    xMin: 1565, 
    xMax: 1655,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "18",
    sublabelSize: 15, 
    subLabelText: '10m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 19 - SWIR 2a  */
    color: '#c88647',
    xMin: 2025.5, 
    xMax: 2050.5,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "19",
    sublabelSize: 15, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 20 - SWIR 2b  */
    color: '#c88647',
    xMin: 2088, 
    xMax: 2128,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "20",
    sublabelSize: 15, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 0.05,
  },
  {
    //** Band 21 - SWIR 2c  */
    color: '#c88647',
    xMin: 2191, 
    xMax: 2231,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "21",
    sublabelSize: 15, 
    subLabelText: '20m',
    graphNumb: 2,
    yOffset: 0,
  },
  {
    //** Band 22 - TIR 1  */
    color: '#b79498',
    xMin: 8050, 
    xMax: 8425,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "22",
    sublabelSize: 15, 
    subLabelText: '60m',
    graphNumb: 2,
    yOffset: 0,
  },
  {
    //** Band 23 - TIR 2  */
    color: '#b79498',
    xMin: 8425, 
    xMax: 8775,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "23",
    sublabelSize: 15, 
    subLabelText: '60m',
    graphNumb: 2,
    yOffset: 0,
  },
  {
    //** Band 24 - TIR 2  */
    color: '#b79498',
    xMin: 8925, 
    xMax: 9275,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "24",
    sublabelSize: 15, 
    subLabelText: '60m',
    graphNumb: 2,
    yOffset: 0,
  },
  {
    //** Band 25 - TIR 4  */
    color: '#b67f81',
    xMin: 11025, 
    xMax: 11575,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "25",
    sublabelSize: 15, 
    subLabelText: '60m',
    graphNumb: 2,
    yOffset: 0,
  },
  {
    //** Band 26 - TIR 5  */
    color: '#b67f81',
    xMin: 11775, 
    xMax: 12225,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "26",
    sublabelSize: 15, 
    subLabelText: '60m',
    graphNumb: 2,
    yOffset: 0,
  },
];
var Sentinel2_values = [
  {
    //** B1 - CA */
    color: '#679cbf',
    xMin: 433, 
    xMax: 453,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "1",
    sublabelSize: 15, 
    subLabelText: '60m',
    graphNumb: 1,
    yOffset: 0.05,
  },
  {
    //** B2 - Blue */
    color: '#00658d',
    xMin: 457.5, 
    xMax: 522.5,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "2",
    sublabelSize: 15, 
    subLabelText: '10m',
    graphNumb: 1,
    yOffset: -0.05,
  },
  {
    //** B3 - Green */
    color: '#4c9d5f',
    xMin: 542, 
    xMax: 577.5,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "3",
    sublabelSize: 15, 
    subLabelText: '10m',
    graphNumb: 1,
    yOffset: -0.05,
  },
  {
    //** B4 - Red */
    color: '#c22036',
    xMin: 649.5, 
    xMax: 680.5,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "4",
    sublabelSize: 15, 
    subLabelText: '10m',
    graphNumb: 1,
    yOffset: -0.05,
  }, 
  {
    //** B5 - Red Edge */
    color: '#c5a2bd',
    xMin: 697.5, 
    xMax: 712.5,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "5",
    sublabelSize: 15, 
    subLabelText: '10m',
    graphNumb: 1,
    yOffset: 0,
  },  
  {
    //** B6 - NIR-1 */
    color: '#d39979',
    xMin: 732.5, 
    xMax: 747.5,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "6",
    sublabelSize: 15, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 0.05,
  },  
  {
    //** B7 - NIR-2 */
    color: '#999c96',
    xMin: 773, 
    xMax: 793,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "7",
    sublabelSize: 15, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 0,
  }, 
  {
    //** B8 - NIR-3	 */
    color: '#008fa2',
    xMin: 784.5, 
    xMax: 899.5,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "8",
    sublabelSize: 15, 
    subLabelText: '10m',
    graphNumb: 1,
    yOffset: -0.05,
  }, 
  {
    //** B8a - Water Vapor-1	 */
    color: '#7480a1',
    xMin: 855, 
    xMax: 875,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "8a",
    sublabelSize: 15, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 0.05,
  }, 
  {
    //** B9 - Water Vapor-2 */
    color: '#d39979',
    xMin: 935, 
    xMax: 945,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "9",
    sublabelSize: 15, 
    subLabelText: '60m',
    graphNumb: 1,
    yOffset: 0,
  }, 
  {
    //** B10 - Cirrus */
    color: '#bc7a82',
    xMin: 1365, 
    xMax: 1395,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "10",
    sublabelSize: 15, 
    subLabelText: '60m',
    graphNumb: 1,
    yOffset: 0.05,
  }, 
  {
    //** B11 - SWIR1 */
    color: '#bc7a82',
    xMin: 1565, 
    xMax: 1655,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "11",
    sublabelSize: 15, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** B12 - SWIR2 */
    color: '#bc7a82',
    xMin: 2100, 
    xMax: 2280,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "12",
    sublabelSize: 15, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 0,
  },
];
var Sentinel3_values = [
  {
    //** Oa01 - CA-1 */
    color: '#679cbf',
    xMin: 395, 
    xMax: 405,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "1",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Oa02 - CA-2 */
    color: '#00658d',
    xMin: 407, 
    xMax: 417,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "2",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Oa03 - CA-3 */
    color: '#4c9d5f',
    xMin: 438, 
    xMax: 448,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "3",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Oa04 - Blue-1 */
    color: '#c22036',
    xMin: 485, 
    xMax: 495,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "4",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 0,
  },  
  {
    //** Oa05 - Blue-2 */
    color: '#c5a2bd',
    xMin: 505, 
    xMax: 515,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "5",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 0,
  }, 
  {
    //** Oa06 - Green */
    color: '#c5a2bd',
    xMin: 555, 
    xMax: 565,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "6",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 0,
  }, 
  {
    //** Oa07 - Red-1 */
    color: '#c5a2bd',
    xMin: 615, 
    xMax: 625,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "7",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Oa08 - Red-2 */
    color: '#c5a2bd',
    xMin: 660, 
    xMax: 670,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "8",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Oa09 - Red-3 */
    color: '#c5a2bd',
    xMin: 670, 
    xMax: 677,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "9",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 0.05,
  },
  {
    //** Oa10 - Red-4 */
    color: '#c5a2bd',
    xMin: 677, 
    xMax: 685,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "10",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: -0.05,
  },
  {
    //** Oa11 - NIR-1 */
    color: '#c5a2bd',
    xMin: 703, 
    xMax: 713,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "11",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Oa12 - NIR-2 */
    color: '#c5a2bd',
    xMin: 750, 
    xMax: 757,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "12",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Oa13 - NIR-3 */
    color: '#c5a2bd',
    xMin: 760, 
    xMax: 762,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "13",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 0.05,
  },
  {
    //** Oa14 - NIR-4 */
    color: '#c5a2bd',
    xMin: 762, 
    xMax: 766,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "14",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: -0.05,
  },
  {
    //** Oa15 - NIR-5 */
    color: '#c5a2bd',
    xMin: 766, 
    xMax: 769,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "15",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Oa16 - NIR-6 */
    color: '#c5a2bd',
    xMin: 771, 
    xMax: 786,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "16",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Oa17 - NIR-7 */
    color: '#c5a2bd',
    xMin: 855, 
    xMax: 875,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "17",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Oa18 - NIR-8 */
    color: '#c5a2bd',
    xMin: 880, 
    xMax: 890,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "18",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 0.05,
  },
  {
    //** Oa19 - NIR-9 */
    color: '#c5a2bd',
    xMin: 895, 
    xMax: 905,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "19",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Oa20 - NIR-10 */
    color: '#c5a2bd',
    xMin: 930, 
    xMax: 950,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "20",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Oa21 - NIR-11 */
    color: '#c5a2bd',
    xMin: 1000, 
    xMax: 1040,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "21",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 0,
  },
];
var EO1_values = [
  {
    //** Band 1 CA */
    color: '#679cbf',
    xMin: 433, 
    xMax: 453,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "1",
    sublabelSize: 15, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 2 Blue */
    color: '#1a7d9e',
    xMin: 450, 
    xMax: 515,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "2",
    sublabelSize: 15, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0.05,
  },
  {
    //** Band 3 - Green */
    color: '#74a97c',
    xMin: 525, 
    xMax: 605,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "3",
    sublabelSize: 15, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 4 - Red */
    color: '#b63d4c',
    xMin: 630, 
    xMax: 690,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "4",
    sublabelSize: 15, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 5 - NIR-1 */
    color: '#690022',
    xMin: 775, 
    xMax: 805,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "5",
    sublabelSize: 15, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 6 - NIR-2 */
    color: '#b5b0c4',
    xMin: 845, 
    xMax: 890,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "6",
    sublabelSize: 15, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: -0.05,
  },
  {
    //** Band 7 - NIR-3 */
    color: '#8d96ab',
    xMin: 1200, 
    xMax: 1300,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "7",
    sublabelSize: 15, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 8 - SWIR1 */
    color: '#d39979',
    xMin: 1550, 
    xMax: 1750,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "8",
    sublabelSize: 15, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 9 - SWIR2 */
    color: '#c88647',
    xMin: 2080, 
    xMax: 2350,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "9",
    sublabelSize: 15, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 10 - Panchromatic */
    color: '#679cbf',
    xMin: 480, 
    xMax: 690,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "10",
    sublabelSize: 15, 
    subLabelText: '10m',
    graphNumb: 1,
    yOffset: -0.05,
  },
];
var DESIS_values = [
  {
    color: '#679cbf',
    xMin: 402, 
    xMax: 1000,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "",
    sublabelSize: 15, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: 0,
  }, 
];
var ECOSTRESS_values = [
  {
    //** B1 */
    color: '#92d050',
    xMin: 1475, 
    xMax: 1845,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "1",
    sublabelSize: 15, 
    subLabelText: '70m',
    graphNumb: 1,
    yOffset: 0,
  }, 
  {
    //** B2 */
    color: '#92d050',
    xMin: 8113, 
    xMax: 8467,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "2",
    sublabelSize: 15, 
    subLabelText: '70m',
    graphNumb: 2,
    yOffset: 0,
  }, 
  {
    //** B3 */
    color: '#92d050',
    xMin: 8625, 
    xMax: 8935,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "3",
    sublabelSize: 15, 
    subLabelText: '70m',
    graphNumb: 2,
    yOffset: 0,
  }, 
  {
    //** B4 */
    color: '#92d050',
    xMin: 9002, 
    xMax: 9398,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "4",
    sublabelSize: 15, 
    subLabelText: '70m',
    graphNumb: 2,
    yOffset: 0,
  }, 
  {
    //** B5 */
    color: '#92d050',
    xMin: 10285, 
    xMax: 10695,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "5",
    sublabelSize: 15, 
    subLabelText: '70m',
    graphNumb: 2,
    yOffset: 0,
  }, 
  {
    //** B6 */
    color: '#92d050',
    xMin: 11784.5, 
    xMax: 12395.5,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "6",
    sublabelSize: 15, 
    subLabelText: '70m',
    graphNumb: 2,
    yOffset: 0,
  }, 
];
var EMIT_values = [
  {
    color: '#e2b280',
    xMin: 381, 
    xMax: 2493,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "",
    sublabelSize: 15, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: 0,
  }, 
];
var MODIS_values = [
  {
    //** Band 1 - Shortwave/VIS	*/
    color: '#caa553',
    xMin: 620, 
    xMax: 670,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "1",
    sublabelSize: 0, 
    subLabelText: '250m',
    graphNumb: 1,
    yOffset: 0.05,
  },
  {
    //** Band 2 - Shortwave/NIR	*/
    color: '#b5b0c4',
    xMin: 841, 
    xMax: 876,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "2",
    sublabelSize: 0, 
    subLabelText: '250m',
    graphNumb: 1,
    yOffset: 0.05,
  },
  {
    //** Band 3 - Shortwave/VIS	*/
    color: '#1a7d9e',
    xMin: 459, 
    xMax: 479,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "3",
    sublabelSize: 0, 
    subLabelText: '500m',
    graphNumb: 1,
    yOffset: 0.05,
  },
  {
    //** Band 4 - Shortwave/VIS	*/
    color: '#1a7d9e',
    xMin: 545, 
    xMax: 565,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "4",
    sublabelSize: 0, 
    subLabelText: '500m',
    graphNumb: 1,
    yOffset: 0.05,
  }, 
  {
    //** Band 5 - Shortwave/NIR	*/
    color: '#1a7d9e',
    xMin: 1230, 
    xMax: 1250,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "5",
    sublabelSize: 0, 
    subLabelText: '500m',
    graphNumb: 1,
    yOffset: 0,
  }, 
  {
    //** Band 6 - Shortwave/NIR	*/
    color: '#c2aa94',
    xMin: 1628, 
    xMax: 1652,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "6",
    sublabelSize: 0, 
    subLabelText: '500m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 7 - Shortwave/NIR	*/
    color: '#c88647',
    xMin: 2105, 
    xMax: 2155,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "7",
    sublabelSize: 0, 
    subLabelText: '500m',
    graphNumb: 1,
    yOffset: 0,
  }, 
  {
    //** Band 8 - Shortwave/VIS	*/
    color: '#7fb0c6',
    xMin: 405, 
    xMax: 420,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "8",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 9 - Shortwave/VIS	*/
    color: '#7fb0c6',
    xMin: 438, 
    xMax: 448,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "9",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 1,
    yOffset: -0.05,
  }, 
  {
    //** Band 10 - Shortwave/VIS	*/
    color: '#1a7d9e',
    xMin: 483, 
    xMax: 493,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "10",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 1,
    yOffset: 0,
  }, 
  {
    //** Band 11 - Shortwave/VIS	*/
    color: '#1a7d9e',
    xMin: 483, 
    xMax: 493,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "11",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 1,
    yOffset: 0,
  }, 
  {
    //** Band 12 - Shortwave/VIS	*/
    color: '#1a7d9e',
    xMin: 546, 
    xMax: 556,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "12",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 1,
    yOffset: -0.05,
  }, 
  {
    //** Band 13 - Shortwave/VIS	*/
    color: '#b63d4c',
    xMin: 662, 
    xMax: 672,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "13",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 1,
    yOffset: 0,
  }, 
  {
    //** Band 14 - Shortwave/VIS	*/
    color: '#b63d4c',
    xMin: 673, 
    xMax: 683,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "14",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 1,
    yOffset: -0.05,
  }, 
  {
    //** Band 15 - Shortwave/VIS	*/
    color: '#b63d4c',
    xMin: 743, 
    xMax: 753,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "15",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 1,
    yOffset: 0,
  }, 
  {
    //** Band 16 - Shortwave/VIS	*/
    color: '#b5b0c4',
    xMin: 862, 
    xMax: 877,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "16",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 1,
    yOffset: 0,
  }, 
  {
    //** Band 17 - Shortwave/VIS	*/
    color: '#b5b0c4',
    xMin: 890, 
    xMax: 920,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "17",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 1,
    yOffset: 0.05,
  }, 
  {
    //** Band 18 - Shortwave/VIS	*/
    color: '#b5b0c4',
    xMin: 931, 
    xMax: 941,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "18",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 1,
    yOffset: 0,
  }, 
  {
    //** Band 19 - Shortwave/VIS	*/
    color: '#7939a0',
    xMin: 915, 
    xMax: 965,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "19",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 1,
    yOffset: -0.05,
  }, 
  {
    //** Band 20 - Longwave thermal Infrared/TIR	*/
    color: '#7fb0c6',
    xMin: 3660, 
    xMax: 3840,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "20",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 0,
  }, 
  {
    //** Band 21 - Longwave thermal Infrared/TIR	*/
    color: '#7fb0c6',
    xMin: 3929, 
    xMax: 3989,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "21",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 0,
  }, 
  {
    //** Band 22 - Longwave thermal Infrared/TIR	*/
    color: '#7fb0c6',
    xMin: 3929, 
    xMax: 3989,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "21",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: -0.05,
  }, 
  {
    //** Band 23 - Longwave thermal Infrared/TIR	*/
    color: '#7fb0c6',
    xMin: 4020, 
    xMax: 4080,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "23",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 0.05,
  }, 
  {
    //** Band 24 - Longwave thermal Infrared/TIR	*/
    color: '#7fb0c6',
    xMin: 4433, 
    xMax: 4498,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "24",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 0.05,
  }, 
  {
    //** Band 25 - Longwave thermal Infrared/TIR	*/
    color: '#7fb0c6',
    xMin: 4482, 
    xMax: 4549,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "25",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 0,
  }, 
  {
    //** Band 26 - Longwave thermal Infrared/TIR	*/
    color: '#7fb0c6',
    xMin: 1360, 
    xMax: 1390,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "26",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 1,
    yOffset: 0,
  }, 
  {
    //** Band 27 - Longwave thermal Infrared/TIR	*/
    color: '#7fb0c6',
    xMin: 6535, 
    xMax: 6895,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "27",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 0,
  }, 
  {
    //** Band 28 - Longwave thermal Infrared/TIR	*/
    color: '#b79498',
    xMin: 7175, 
    xMax: 7475,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "28",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 0,
  }, 
  {
    //** Band 29 - Longwave thermal Infrared/TIR	*/
    color: '#b79498',
    xMin: 8400, 
    xMax: 8700,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "29",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 0,
  }, 
  {
    //** Band 30 - Longwave thermal Infrared/TIR	*/
    color: '#b79498',
    xMin: 9580, 
    xMax: 9880,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "30",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 0,
  }, 
  {
    //** Band 31 - Longwave thermal Infrared/TIR	*/
    color: '#b67f81',
    xMin: 10780, 
    xMax: 11280,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "31",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 0,
  }, 
  {
    //** Band 32 - Longwave thermal Infrared/TIR	*/
    color: '#b67f81',
    xMin: 11770, 
    xMax: 12270,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "32",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 0,
  }, 
  {
    //** Band 33 - Longwave thermal Infrared/TIR	*/
    color: '#b67f81',
    xMin: 13185, 
    xMax: 13485,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "33",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 0,
  }, 
  {
    //** Band 34 - Longwave thermal Infrared/TIR	*/
    color: '#b67f81',
    xMin: 13485, 
    xMax: 13785,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "34",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 0,
  }, 
  {
    //** Band 35 - Longwave thermal Infrared/TIR	*/
    color: '#b67f81',
    xMin: 13785, 
    xMax: 14085,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "35",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 0,
  }, 
  {
    //** Band 36 - Longwave thermal Infrared/TIR	*/
    color: '#b67f81',
    xMin: 14085, 
    xMax: 14385,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "36",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 0,
  }, 
];

var PACE_values = [
  {
    //** Band 1 - Hyperspectral	*/
    color: '#c22036',
    xMin: 340, 
    xMax: 890,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "1",
    sublabelSize: 15, 
    subLabelText: '50m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 2 - NIR-1	*/
    color: '#c5a2bd',
    xMin: 900, 
    xMax: 980,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "2",
    sublabelSize: 15, 
    subLabelText: '50m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 3 - NIR-2	*/
    color: '#c5a2bd',
    xMin: 938, 
    xMax: 1138,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "3",
    sublabelSize: 15, 
    subLabelText: '50m',
    graphNumb: 1,
    yOffset: 0.05,
  },
  {
    //** Band 4 - NIR-3	*/
    color: '#7480a1',
    xMin: 1278, 
    xMax: 1478,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "4",
    sublabelSize: 15, 
    subLabelText: '50m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 5 - SWIR1-1	*/
    color: '#d39979',
    xMin: 1515, 
    xMax: 1715,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "5",
    sublabelSize: 15, 
    subLabelText: '50m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 6 - SWIR2-1	*/
    color: '#999c96',
    xMin: 2030, 
    xMax: 2230,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "6",
    sublabelSize: 15, 
    subLabelText: '50m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 7 - SWIR2-2	*/
    color: '#999c96',
    xMin: 2160, 
    xMax: 2360,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "7",
    sublabelSize: 15, 
    subLabelText: '50m',
    graphNumb: 1,
    yOffset: -0.05,
  },
];


var STELLA_values = [
  {
    //** Band 1 - Violet	*/
    color: '#B930D5',
    xMin: 410, 
    xMax: 490,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "1",
    sublabelSize: 15, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: 0.05,
  },
  {
    //** Band 2 - Blue	*/
    color: '#00658d',
    xMin: 460, 
    xMax: 540,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "2",
    sublabelSize: 15, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 3 - Green	*/
    color: '#4C9D5F',
    xMin: 510, 
    xMax: 590,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "3",
    sublabelSize: 15, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: -0.05,
  },
  {
    //** Band 4 - Yellow	*/
    color: '#caa553',
    xMin: 530, 
    xMax: 610,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "4",
    sublabelSize: 15, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: 0.05,
  },
  {
    //** Band 5 - Orange	*/
    color: '#d9964e',
    xMin: 560, 
    xMax: 640,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "5",
    sublabelSize: 15, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: 0.1,
  },
  {
    //** Band 6 - Red	*/
    color: '#c44354',
    xMin: 590, 
    xMax: 630,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "6",
    sublabelSize: 15, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 7 - Red 2	*/
    color: '#c22036',
    xMin: 610, 
    xMax: 690,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "7",
    sublabelSize: 15, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: -0.05,
  },
  {
    //** Band 8 - NIR*/
    color: '#b5b3b3',
    xMin: 660, 
    xMax: 700,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "8",
    sublabelSize: 15, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 9 - NIR*/
    color: '#b5b3b3',
    xMin: 710, 
    xMax: 750,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "9",
    sublabelSize: 15, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 10 - NIR*/
    color: '#b5b3b3',
    xMin: 740, 
    xMax: 780,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "10",
    sublabelSize: 15, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: -0.05,
  },
  {
    //** Band 11 - NIR*/
    color: '#b5b3b3',
    xMin: 790, 
    xMax: 830,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "11",
    sublabelSize: 15, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 12 - NIR*/
    color: '#b5b3b3',
    xMin: 840, 
    xMax: 880,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "12",
    sublabelSize: 15, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: 0,
  },
];

var CUSTOM_values = [
  {
    //** Band 1 - Violet	*/
    color: '#d6d6d6',
    xMin: 500, 
    xMax: 700,
    yHeight: 0.05,
    labelSize: 15,
    labelText: "1",
    sublabelSize: 15, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: 0,
  },
];

//addPreset("Landsat 1-3", Landsat1_3_values);

//** CREATES HTML FOR PRESETS IN THE LAYERS TAB */

var enabledPresets = [];

function addPreset(title, preset)
{
  enabledPresets.push(title);
  var count = 0; 
  enabledPresets.forEach((v) => (v=== title && count++));
  
  if(count > 1)
  {
    title += " (" + count + ")";
  }

  console.log("count: " + count);

  //var tree = document.createDocumentFragment();
  
  //** OUTSIDE NAV */
  var nav = document.createElement("nav");
  nav.classList = "nav";
  nav.role = "navigation";
  
  //** OUTSIDE UL */
  var ul = document.createElement("ul");
  ul.classList = "nav__list";
  nav.appendChild(ul);

  //** LIST CONTAINER */
  var li = document.createElement("li");
  ul.appendChild(li);

  //** HIDDEN CHECK BOX FOR TITLE TOGGLE */
  var title_checkbox = document.createElement("input");
  title_checkbox.id = title;
  title_checkbox.type = "checkbox";
  title_checkbox.hidden = true;
  li.appendChild(title_checkbox);
  
  //** TITLE LABEL */
  var title_label = document.createElement("label");
  title_label.classList = "title_Label";
  title_label.setAttribute("for", title);
  title_label.innerHTML = title;
  title_label.setAttribute("contentEditable", true);
  li.appendChild(title_label);

  //** TITLE LABEL SPAN */
  var title_label_span = document.createElement("span");
  title_label_span.innerHTML = "›";
  title_label_span.setAttribute("contentEditable", false);
  title_label_span.setAttribute("contentEditable", false);
  title_label.appendChild(title_label_span);

  //** TITLE REMOVE ICON */
  var title_label_removeIcon = document.createElement("i");
  title_label_removeIcon.classList = "fa fa-trash";
  title_label_removeIcon.id = "removeIcon";
  title_label_removeIcon.setAttribute("contentEditable", false);
  title_label.appendChild(title_label_removeIcon);

  //** ON CHANGE EVENT FOR COLOR PICKER */
  title_label_removeIcon.addEventListener('click', function() {
    nav.innerHTML = "";
    nav.remove();
    var index = enabledPresets.indexOf(this.title);
    enabledPresets.splice(index, 1);
    loopThroughLayers();
  }, false);

  // //** I ICON */
  // var title_label_moreInfo = document.createElement("i");
  // title_label_moreInfo.classList = "fa fa-info-circle";
  // title_label_moreInfo.id = "removeIcon";
  // title_label_moreInfo.style = "float: left";
  // title_label_moreInfo.style.transform = "translate(-30%, 50%)";
  // title_label_moreInfo.setAttribute("contentEditable", false);
  // title_label.appendChild(title_label_moreInfo);

  // //** CLICK EVENT FOR MORE INFO ICON */
  // title_label_moreInfo.addEventListener('click', function() {
  //   window.open(preset[0].link);
  // }, false);

  //** GROUP LIST CONTAINER, CONTAINS ALL GROUP VALUES */
  var groupList = document.createElement("ul");
  groupList.classList = "group-list";
  li.appendChild(groupList);

  //** ADD SPECIFIC BANDS */
  for(var i = 0; i < preset.length; i++)
  {
    //** BAND LIST CONTAINER */
    var band_li = document.createElement("li");
    groupList.appendChild(band_li);

    //** BAND HIDDEN CHECKBOX */
    var band_checkbox = document.createElement("input");
    band_checkbox.id = "sub-group-b" + (i+1) + title;
    band_checkbox.type = "checkbox";
    band_checkbox.hidden = true;
    band_li.appendChild(band_checkbox);

    //** BAND LABEL */
    var band_label = document.createElement("label");
    band_label.setAttribute("for", "sub-group-b" + (i+1) + title);
    band_label.innerHTML = "B" + (i+1);
    band_label.setAttribute("contentEditable", true);
    band_label.id = "band_label_b" + (i+1) + title;
    band_li.appendChild(band_label);

      //** BAND LABEL SPAN */
      var band_label_span = document.createElement("span");
      band_label_span.innerHTML = "›";
      band_label_span.setAttribute("contentEditable", false);
      band_label.appendChild(band_label_span);

    //** BAND CONTENT CONTAINER */
    var band_content = document.createElement("ul");
    band_content.classList = "sub-group-list";
    band_li.appendChild(band_content);

      //** INPUT - COLOR */
      var input_container_color = document.createElement('div');
      input_container_color.classList = "inputContainer";
      band_content.appendChild(input_container_color);

        //** INPUT - COLOR - TITLE */
        var input_container_color_title = document.createElement('div');
        input_container_color_title.innerHTML = "Color";
        input_container_color.appendChild(input_container_color_title);

        //** INPUT - COLOR - INPUT */
        var input_container_color_input = document.createElement('input');
        input_container_color_input.id = "b" + (i+1) + title;
        input_container_color_input.type = "color";
        input_container_color_input.value = preset[i].color;
        band_label.style.backgroundColor = preset[i].color;
        input_container_color.appendChild(input_container_color_input);
        
        //** ON CHANGE EVENT FOR COLOR PICKER */
        input_container_color_input.addEventListener('change', function() {
          //var bandLabel = document.getElementById("band_label_b" + input_container_color_input.id);
          var id = "band_label_" + this.id;
          console.log(id);
          document.getElementById(id).style.backgroundColor = this.value;
          loopThroughLayers();
        }, false);

      //** INPUT - xMin */
      var input_container_xMin = document.createElement('div');
      input_container_xMin.classList = "inputContainer";
      band_content.appendChild(input_container_xMin);

        //** INPUT - xMin - TITLE */
        var input_container_xMin_title = document.createElement('div');
        input_container_xMin_title.innerHTML = "xMin";
        input_container_xMin.appendChild(input_container_xMin_title);

        //** INPUT - xMin - INPUT */
        var input_container_xMin_input = document.createElement('input');
        input_container_xMin_input.type = "number";
        input_container_xMin_input.value = preset[i].xMin;
        input_container_xMin.appendChild(input_container_xMin_input);

        //** ON CHANGE EVENT FOR XMIN */
        input_container_xMin_input.addEventListener('change', function() {
          loopThroughLayers();
        }, false);

      //** INPUT - xMax */
      var input_container_xMax = document.createElement('div');
      input_container_xMax.classList = "inputContainer";
      band_content.appendChild(input_container_xMax);

        //** INPUT - xMax - TITLE */
        var input_container_xMax_title = document.createElement('div');
        input_container_xMax_title.innerHTML = "xMax";
        input_container_xMax.appendChild(input_container_xMax_title);

        //** INPUT - xMax - INPUT */
        var input_container_xMax_input = document.createElement('input');
        input_container_xMax_input.type = "number";
        input_container_xMax_input.value = preset[i].xMax;
        input_container_xMax.appendChild(input_container_xMax_input);

        //** ON CHANGE EVENT FOR xMax */
        input_container_xMax_input.addEventListener('change', function() {
          loopThroughLayers();
        }, false);

      //** INPUT - LABEL SIZE */
      var input_container_labelSize = document.createElement('div');
      input_container_labelSize.classList = "inputContainer";
      band_content.appendChild(input_container_labelSize);

        //** INPUT - LABEL SIZE - TITLE */
        var input_container_labelSize_title = document.createElement('div');
        input_container_labelSize_title.innerHTML = "Label size";
        input_container_labelSize.appendChild(input_container_labelSize_title);

        //** INPUT - LABEL SIZE - INPUT */
        var input_container_labelSize_input = document.createElement('input');
        input_container_labelSize_input.id = "b" + (i+1) + title + "color_input";
        input_container_labelSize_input.type = "number";
        input_container_labelSize_input.value = "15";
        input_container_labelSize.appendChild(input_container_labelSize_input);

        //** ON CHANGE EVENT FOR LABEL SIZE */
        input_container_labelSize_input.addEventListener('change', function() {
          loopThroughLayers();
        }, false);

      //** INPUT - LABEL CONTENT */
      var input_container_labelContent = document.createElement('div');
      input_container_labelContent.classList = "inputContainer";
      band_content.appendChild(input_container_labelContent);

        //** INPUT - LABEL CONTENT - TITLE */
        var input_container_labelContent_title = document.createElement('div');
        input_container_labelContent_title.innerHTML = "Label Text";
        input_container_labelContent.appendChild(input_container_labelContent_title);

        //** INPUT - LABEL CONTENT - INPUT */
        var input_container_labelContent_input = document.createElement('input');
        input_container_labelContent_input.type = "text";
        input_container_labelContent_input.value = preset[i].labelText;
        input_container_labelContent.appendChild(input_container_labelContent_input);

        //** ON CHANGE EVENT FOR LABEL CONTENT */
        input_container_labelContent_input.addEventListener('change', function() {
          loopThroughLayers();
        }, false);

      //** INPUT - SUBLABEL SIZE */
      var input_container_subLabelSize = document.createElement('div');
      input_container_subLabelSize.classList = "inputContainer";
      band_content.appendChild(input_container_subLabelSize);

        //** INPUT - SUBLABEL SIZE - TITLE */
        var input_container_subLabelSize_title = document.createElement('div');
        input_container_subLabelSize_title.innerHTML = "SubLabel Size";
        input_container_subLabelSize.appendChild(input_container_subLabelSize_title);

        //** INPUT - SUBLABEL SIZE - INPUT */
        var input_container_sublabel_input = document.createElement('input');
        input_container_sublabel_input.type = "number";
        input_container_sublabel_input.value = preset[i].sublabelSize;
        input_container_subLabelSize.appendChild(input_container_sublabel_input);

        //** ON CHANGE EVENT FOR SUBLABEL SIZE */
        input_container_sublabel_input.addEventListener('change', function() {
          loopThroughLayers();
        }, false);

      //** INPUT - SUBLABEL OFFSET */
      var input_container_subLabelOffset = document.createElement('div');
      input_container_subLabelOffset.classList = "inputContainer";
      band_content.appendChild(input_container_subLabelOffset);

        //** INPUT - SUBLABEL OFFSET - TITLE */
        var input_container_subLabelOffset_title = document.createElement('div');
        input_container_subLabelOffset_title.innerHTML = "SubLabel Offset";
        input_container_subLabelOffset.appendChild(input_container_subLabelOffset_title);

        //** INPUT - SUBLABEL OFFSET - INPUT */
        var input_container_sublabelOffset_input = document.createElement('input');
        input_container_sublabelOffset_input.type = "number";
        input_container_sublabelOffset_input.value = 0.1;
        input_container_subLabelOffset.appendChild(input_container_sublabelOffset_input);

        //** ON CHANGE EVENT FOR SUBLABEL OFFSET */
        input_container_sublabelOffset_input.addEventListener('change', function() {
          loopThroughLayers();
        }, false);

      //** INPUT - SUBLABEL CONTENT */
      var input_container_subLabelContent = document.createElement('div');
      input_container_subLabelContent.classList = "inputContainer";
      band_content.appendChild(input_container_subLabelContent);

        //** INPUT - SUBLABEL Content - TITLE */
        var input_container_subLabelContent_title = document.createElement('div');
        input_container_subLabelContent_title.innerHTML = "SubLabel Text";
        input_container_subLabelContent.appendChild(input_container_subLabelContent_title);

        //** INPUT - SUBLABEL Content - INPUT */
        var input_container_sublabelContent_input = document.createElement('input');
        input_container_sublabelContent_input.type = "text";
        input_container_sublabelContent_input.value = preset[i].subLabelText;
        input_container_subLabelContent.appendChild(input_container_sublabelContent_input);

        //** ON CHANGE EVENT FOR SUBLABEL CONTENT */
        input_container_sublabelContent_input.addEventListener('change', function() {
          loopThroughLayers();
        }, false);

      //** INPUT - GRAPH NUMB */
      var input_container_graphNumb = document.createElement('div');
      input_container_graphNumb.classList = "inputContainer";
      band_content.appendChild(input_container_graphNumb);

        //** INPUT - SUBLABEL Content - TITLE */
        var input_container_graphNumb_title = document.createElement('div');
        input_container_graphNumb_title.innerHTML = "Graph Number";
        input_container_graphNumb.appendChild(input_container_graphNumb_title);

        //** INPUT - SUBLABEL Content - INPUT */
        var input_container_graphNumb_input = document.createElement('input');
        input_container_graphNumb_input.type = "number";
        input_container_graphNumb_input.value = preset[i].graphNumb;
        input_container_graphNumb_input.min = 1;
        input_container_graphNumb_input.max = 2;
        input_container_graphNumb.appendChild(input_container_graphNumb_input);

        //** ON CHANGE EVENT FOR SUBLABEL CONTENT */
        input_container_graphNumb_input.addEventListener('change', function() {
          loopThroughLayers();
        }, false);

      //** INPUT - yOffset */
      var input_container_yOffset = document.createElement('div');
      input_container_yOffset.classList = "inputContainer";
      band_content.appendChild(input_container_yOffset);

        //** INPUT - yOffset - TITLE */
        var input_container_yOffset_title = document.createElement('div');
        input_container_yOffset_title.innerHTML = "yOffset";
        input_container_yOffset.appendChild(input_container_yOffset_title);

        //** INPUT - yOffset - INPUT */
        var input_container_yOffset_input = document.createElement('input');
        input_container_yOffset_input.type = "number";
        input_container_yOffset_input.value = preset[i].yOffset;
        input_container_yOffset_input.step = 0.1;
        input_container_yOffset.appendChild(input_container_yOffset_input);

        //** ON CHANGE EVENT FOR xMax */
        input_container_yOffset_input.addEventListener('change', function() {
          loopThroughLayers();
        }, false);

  }

  //** FOR ADDING ADDITIONAL BANDS */
  
  //** ADDITIONAL BAND LIST CONTAINER */
  var add_band_li = document.createElement("li");
  add_band_li.id = "add_" + title;
  add_band_li.title = "add additional bands";
  groupList.appendChild(add_band_li);

  //** ADDITIONAL BAND LABEL */
  var add_band_label = document.createElement("label");
  add_band_label.innerHTML = "+";
  add_band_label.id = "add_label_" + title;
  add_band_label.style = "text-align: center;";
  add_band_li.appendChild(add_band_label);

  //**----      CLICK EVENT FOR ADDING ADDITIONAL BAND       ----*/
  add_band_label.addEventListener('click', function() {
    
    //** BAND LIST CONTAINER */
    var band_li = document.createElement("li");

    //* PLACE BEFORE THE LAST ELEMENT (add icon) */
    var label_index = (groupList.children.length);
    groupList.insertBefore(band_li, groupList.childNodes[label_index-1]);

    console.log(groupList.childNodes[label_index-2]);
    console.log(groupList.childNodes[label_index-2].childNodes[2].childNodes[8].childNodes[1].value);

    var previousColor = groupList.childNodes[label_index-2].childNodes[2].childNodes[0].childNodes[1].value;
    var previousMax = groupList.childNodes[label_index-2].childNodes[2].childNodes[2].childNodes[1].value;
    var previous_labelSize = groupList.childNodes[label_index-2].childNodes[2].childNodes[5].childNodes[1].value;
    var previous_sublabelSize = groupList.childNodes[label_index-2].childNodes[2].childNodes[5].childNodes[1].value;
    var previous_graphNumb = groupList.childNodes[label_index-2].childNodes[2].childNodes[8].childNodes[1].value;
    var previous_Label_Text = groupList.childNodes[label_index-2].childNodes[2].childNodes[4].childNodes[1].value;
    var previous_subLabel_Text = groupList.childNodes[label_index-2].childNodes[2].childNodes[7].childNodes[1].value;

    //** BAND HIDDEN CHECKBOX */
    var band_checkbox = document.createElement("input");
    band_checkbox.id = "sub-group-b" + label_index + title;
    band_checkbox.type = "checkbox";
    band_checkbox.hidden = true;
    band_li.appendChild(band_checkbox);

    //** BAND LABEL */
    var band_label = document.createElement("label");
    band_label.setAttribute("for", "sub-group-b" + label_index + title);
    band_label.innerHTML = "B" + label_index;
    band_label.id = "band_label_b" + label_index + title;
    band_label.setAttribute("contentEditable", true);
    band_li.appendChild(band_label);

      //** BAND LABEL SPAN */
      var band_label_span = document.createElement("span");
      band_label_span.innerHTML = "›";
      band_label.appendChild(band_label_span);

    //** BAND CONTENT CONTAINER */
    var band_content = document.createElement("ul");
    band_content.classList = "sub-group-list";
    band_li.appendChild(band_content);

      //** INPUT - COLOR */
      var input_container_color = document.createElement('div');
      input_container_color.classList = "inputContainer";
      band_content.appendChild(input_container_color);

        //** INPUT - COLOR - TITLE */
        var input_container_color_title = document.createElement('div');
        input_container_color_title.innerHTML = "Color";
        input_container_color.appendChild(input_container_color_title);

        //** INPUT - COLOR - INPUT */
        var input_container_color_input = document.createElement('input');
        input_container_color_input.id = "b" + label_index + title;
        input_container_color_input.type = "color";
        input_container_color_input.value = previousColor;
        band_label.style.backgroundColor = previousColor;
        input_container_color.appendChild(input_container_color_input);
        
        //** ON CHANGE EVENT FOR COLOR PICKER */
        input_container_color_input.addEventListener('change', function() {
          //var bandLabel = document.getElementById("band_label_b" + input_container_color_input.id);
          var id = "band_label_" + this.id;
          console.log(id);
          document.getElementById(id).style.backgroundColor = this.value;
          loopThroughLayers();
        }, false);

      //** INPUT - xMin */
      var input_container_xMin = document.createElement('div');
      input_container_xMin.classList = "inputContainer";
      band_content.appendChild(input_container_xMin);

        //** INPUT - xMin - TITLE */
        var input_container_xMin_title = document.createElement('div');
        input_container_xMin_title.innerHTML = "xMin";
        input_container_xMin.appendChild(input_container_xMin_title);

        //** INPUT - xMin - INPUT */
        var input_container_xMin_input = document.createElement('input');
        input_container_xMin_input.type = "number";
        input_container_xMin_input.value = previousMax;
        input_container_xMin.appendChild(input_container_xMin_input);

        //** ON CHANGE EVENT FOR XMIN */
        input_container_xMin_input.addEventListener('change', function() {
          loopThroughLayers();
        }, false);

      //** INPUT - xMax */
      var input_container_xMax = document.createElement('div');
      input_container_xMax.classList = "inputContainer";
      band_content.appendChild(input_container_xMax);

        //** INPUT - xMax - TITLE */
        var input_container_xMax_title = document.createElement('div');
        input_container_xMax_title.innerHTML = "xMax";
        input_container_xMax.appendChild(input_container_xMax_title);

        //** INPUT - xMax - INPUT */
        var input_container_xMax_input = document.createElement('input');
        input_container_xMax_input.type = "number";
        input_container_xMax_input.value = parseFloat(previousMax) + 100;
        input_container_xMax.appendChild(input_container_xMax_input);

        //** ON CHANGE EVENT FOR xMax */
        input_container_xMax_input.addEventListener('change', function() {
          loopThroughLayers();
        }, false);

      //** INPUT - LABEL SIZE */
      var input_container_labelSize = document.createElement('div');
      input_container_labelSize.classList = "inputContainer";
      band_content.appendChild(input_container_labelSize);

        //** INPUT - LABEL SIZE - TITLE */
        var input_container_labelSize_title = document.createElement('div');
        input_container_labelSize_title.innerHTML = "Label size";
        input_container_labelSize.appendChild(input_container_labelSize_title);

        //** INPUT - LABEL SIZE - INPUT */
        var input_container_labelSize_input = document.createElement('input');
        input_container_labelSize_input.id = "b" + label_index + title + "color_input";
        input_container_labelSize_input.type = "number";
        input_container_labelSize_input.value = previous_labelSize;
        input_container_labelSize.appendChild(input_container_labelSize_input);

        //** ON CHANGE EVENT FOR LABEL SIZE */
        input_container_labelSize_input.addEventListener('change', function() {
          loopThroughLayers();
        }, false);

      //** INPUT - LABEL CONTENT */
      var input_container_labelContent = document.createElement('div');
      input_container_labelContent.classList = "inputContainer";
      band_content.appendChild(input_container_labelContent);

        //** INPUT - LABEL CONTENT - TITLE */
        var input_container_labelContent_title = document.createElement('div');
        input_container_labelContent_title.innerHTML = "Label Text";
        input_container_labelContent.appendChild(input_container_labelContent_title);

        //** INPUT - LABEL CONTENT - INPUT */
        var input_container_labelContent_input = document.createElement('input');
        input_container_labelContent_input.type = "text";
        input_container_labelContent_input.value = previous_Label_Text;
        input_container_labelContent.appendChild(input_container_labelContent_input);

        //** ON CHANGE EVENT FOR LABEL CONTENT */
        input_container_labelContent_input.addEventListener('change', function() {
          loopThroughLayers();
        }, false);

      //** INPUT - SUBLABEL SIZE */
      var input_container_subLabelSize = document.createElement('div');
      input_container_subLabelSize.classList = "inputContainer";
      band_content.appendChild(input_container_subLabelSize);

        //** INPUT - SUBLABEL SIZE - TITLE */
        var input_container_subLabelSize_title = document.createElement('div');
        input_container_subLabelSize_title.innerHTML = "SubLabel Size";
        input_container_subLabelSize.appendChild(input_container_subLabelSize_title);

        //** INPUT - SUBLABEL SIZE - INPUT */
        var input_container_sublabel_input = document.createElement('input');
        input_container_sublabel_input.type = "number";
        input_container_sublabel_input.value = previous_sublabelSize;
        input_container_subLabelSize.appendChild(input_container_sublabel_input);

        //** ON CHANGE EVENT FOR SUBLABEL SIZE */
        input_container_sublabel_input.addEventListener('change', function() {
          loopThroughLayers();
        }, false);

      //** INPUT - SUBLABEL OFFSET */
      var input_container_subLabelOffset = document.createElement('div');
      input_container_subLabelOffset.classList = "inputContainer";
      band_content.appendChild(input_container_subLabelOffset);

        //** INPUT - SUBLABEL OFFSET - TITLE */
        var input_container_subLabelOffset_title = document.createElement('div');
        input_container_subLabelOffset_title.innerHTML = "SubLabel Offset";
        input_container_subLabelOffset.appendChild(input_container_subLabelOffset_title);

        //** INPUT - SUBLABEL OFFSET - INPUT */
        var input_container_sublabelOffset_input = document.createElement('input');
        input_container_sublabelOffset_input.type = "number";
        input_container_sublabelOffset_input.value = 0;
        input_container_subLabelOffset.appendChild(input_container_sublabelOffset_input);

        //** ON CHANGE EVENT FOR SUBLABEL OFFSET */
        input_container_sublabelOffset_input.addEventListener('change', function() {
          loopThroughLayers();
        }, false);

      //** INPUT - SUBLABEL CONTENT */
      var input_container_subLabelContent = document.createElement('div');
      input_container_subLabelContent.classList = "inputContainer";
      band_content.appendChild(input_container_subLabelContent);

        //** INPUT - SUBLABEL Content - TITLE */
        var input_container_subLabelContent_title = document.createElement('div');
        input_container_subLabelContent_title.innerHTML = "SubLabel Text";
        input_container_subLabelContent.appendChild(input_container_subLabelContent_title);

        //** INPUT - SUBLABEL Content - INPUT */
        var input_container_sublabelContent_input = document.createElement('input');
        input_container_sublabelContent_input.type = "text";
        input_container_sublabelContent_input.value = previous_subLabel_Text;
        input_container_subLabelContent.appendChild(input_container_sublabelContent_input);

        //** ON CHANGE EVENT FOR SUBLABEL CONTENT */
        input_container_sublabelContent_input.addEventListener('change', function() {
          loopThroughLayers();
        }, false);

      //** INPUT - GRAPH NUMB */
      var input_container_graphNumb = document.createElement('div');
      input_container_graphNumb.classList = "inputContainer";
      band_content.appendChild(input_container_graphNumb);

        //** INPUT - SUBLABEL Content - TITLE */
        var input_container_graphNumb_title = document.createElement('div');
        input_container_graphNumb_title.innerHTML = "Graph Number";
        input_container_graphNumb.appendChild(input_container_graphNumb_title);

        //** INPUT - SUBLABEL Content - INPUT */
        var input_container_graphNumb_input = document.createElement('input');
        input_container_graphNumb_input.type = "number";
        input_container_graphNumb_input.value = previous_graphNumb;
        input_container_graphNumb_input.min = 1;
        input_container_graphNumb_input.max = 2;
        input_container_graphNumb.appendChild(input_container_graphNumb_input);

        //** ON CHANGE EVENT FOR SUBLABEL CONTENT */
        input_container_graphNumb_input.addEventListener('change', function() {
          loopThroughLayers();
        }, false);

      //** INPUT - yOffset */
      var input_container_yOffset = document.createElement('div');
      input_container_yOffset.classList = "inputContainer";
      band_content.appendChild(input_container_yOffset);

        //** INPUT - yOffset - TITLE */
        var input_container_yOffset_title = document.createElement('div');
        input_container_yOffset_title.innerHTML = "yOffset";
        input_container_yOffset.appendChild(input_container_yOffset_title);

        //** INPUT - yOffset - INPUT */
        var input_container_yOffset_input = document.createElement('input');
        input_container_yOffset_input.type = "number";
        input_container_yOffset_input.value = 0;
        input_container_yOffset_input.step = 0.1;
        input_container_yOffset.appendChild(input_container_yOffset_input);

        //** ON CHANGE EVENT FOR xMax */
        input_container_yOffset_input.addEventListener('change', function() {
          loopThroughLayers();
        }, false);
      
        loopThroughLayers();
  })
  

  //tree.appendChild(div);
  layers.appendChild(nav);
}

function loopThroughLayers()
{
  clearAnnotations();
  console.log("START OF LOOP");

  //** GRAB ALL NAVS */
  let navs = layers.getElementsByClassName("nav");
  var offsetY = 0;

  var min_1 = [];
  var min_2 = [];
  var max_1 = [];
  var max_2 = [];

  Array.from(navs).forEach(function (element, i) {
    //** Band LIST */
    let bandList = element.children[0].children[0].children[2];
    offsetY = groupSeperation_Global.value * i;
    i++;

    console.log("group: " + groupSeperation_Global.value);

    for(var i = 0; i < bandList.children.length; i++)
    {
      if(!bandList.children[i].id.includes("add_"))
      {
        var color = bandList.children[i].children[2].children[0].children[1].value;
        var xMin = bandList.children[i].children[2].children[1].children[1].value;
        var xMax = bandList.children[i].children[2].children[2].children[1].value
        var labelSize_ = bandList.children[i].children[2].children[3].children[1].value;
        var labelText = bandList.children[i].children[2].children[4].children[1].value;
        var sublabelSize_ = bandList.children[i].children[2].children[5].children[1].value;
        var sublabelOffset = bandList.children[i].children[2].children[6].children[1].value;
        var sublabelText = bandList.children[i].children[2].children[7].children[1].value;
        var graphNumb = bandList.children[i].children[2].children[8].children[1].value;
        var Offset = bandList.children[i].children[2].children[9].children[1].value;
  
        //** PUSH THE MIN NUMBERS TO EACH GROUP */
        if(graphNumb == 1)
        {
          min_1.push(xMin);
          max_1.push(xMax);
        }
        else
        {
          min_2.push(xMin);
          max_2.push(xMax);
        }
  
        var yStart = offsetY + 0.1 + parseFloat(Offset);
        var yEnd = yStart + boxHeight;
  
        addBox(xMin, xMax, 
          yStart, 
          yEnd, 
          color, labelText, labelSize_, sublabelText, sublabelSize_, graphNumb);
  
        chart.update();
        chart2.update();
      }
    }

    console.log(min_1);
    console.log(min_2);
  });

  if(min_1.length > 0 && min_2.length > 0)
    {
      //** Update min and max values of charts manually *//
      updateMinAndMax(
      Math.min.apply(Math, min_1), 
      Math.min.apply(Math, min_2),
      Math.max.apply(Math, max_1),
      Math.max.apply(Math, max_2));
  }
  else if(min_1.length > 0)
  {
    updateMinAndMax(
    Math.min.apply(Math, min_1), 
    7050,
    Math.max.apply(Math, max_1),
    13950);
  }
  else if(min_2.length > 0)
  {
    updateMinAndMax(
    450, 
    Math.min.apply(Math, min_2),
    2450,
    Math.max.apply(Math, max_2));
  }
  else
  {
    updateMinAndMax(
    450, 
    7050,
    2450,
    13950);
  }
  
  //loadingScreen.classList.toggle('active');
  console.log("END OF LOOP");

  chart.update();
  chart2.update();
}


// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
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
// L8_9_Toggle.addEventListener("click", function () {
//   //** CLEARING */
//   if(L8_9_Toggle.classList.contains("selected"))
//   {
//     clearAnnotations('L8-9');
//     console.log("CLEAR");
//   }
//   //** ADDING */
//   else
//   {
//     groupsToggled.push('L8-9');
//     clearAnnotations();
//   }
//   L8_9_Toggle.classList.toggle("selected");
// });
// L7Toggle.addEventListener("click", function () {
//   //** CLEARING */
//   if(L7Toggle.classList.contains("selected"))
//   {
//     clearAnnotations('L7');
//     console.log("CLEAR");
//   }
//   //** ADDING */
//   else
//   {
//     groupsToggled.push('L7');
//     clearAnnotations();
//   }
//   L7Toggle.classList.toggle("selected");
// });
// L4_5_Toggle.addEventListener("click", function () {
//   //** CLEARING */
//   if(L4_5_Toggle.classList.contains("selected"))
//   {
//     clearAnnotations('L4-5');
//     console.log("CLEAR");
//   }
//   //** ADDING */
//   else
//   {
//     groupsToggled.push('L4-5');
//     clearAnnotations();
//   }
//   L4_5_Toggle.classList.toggle("selected");
// });
// L1_3_Toggle.addEventListener("click", function () {
//   //** CLEARING */
//   if(L1_3_Toggle.classList.contains("selected"))
//   {
//     clearAnnotations('L1-3');
//     console.log("CLEAR");
//   }
//   //** ADDING */
//   else
//   {
//     groupsToggled.push('L1-3');
//     clearAnnotations();
//   }
//   L1_3_Toggle.classList.toggle("selected");
// });
// LNext_Toggle.addEventListener("click", function () {
//   //** CLEARING */
//   if(LNext_Toggle.classList.contains("selected"))
//   {
//     clearAnnotations('LNext');
//     console.log("CLEAR");
//   }
//   //** ADDING */
//   else
//   {
//     groupsToggled.push('LNext');
//     clearAnnotations();
//   }
//   LNext_Toggle.classList.toggle("selected");
// });
// Sentintel2_Toggle.addEventListener("click", function () {
//   //** CLEARING */
//   if(Sentintel2_Toggle.classList.contains("selected"))
//   {
//     clearAnnotations('Sent-2');
//     console.log("CLEAR");
//   }
//   //** ADDING */
//   else
//   {
//     groupsToggled.push('Sent-2');
//     clearAnnotations();
//   }
//   Sentintel2_Toggle.classList.toggle("selected");
// });
// Sentintel3_Toggle.addEventListener("click", function () {
//   //** CLEARING */
//   if(Sentintel3_Toggle.classList.contains("selected"))
//   {
//     clearAnnotations('Sent-3');
//     console.log("CLEAR");
//   }
//   //** ADDING */
//   else
//   {
//     groupsToggled.push('Sent-3');
//     clearAnnotations();
//   }
//   Sentintel3_Toggle.classList.toggle("selected");
// });
// EO1_Toggle.addEventListener("click", function () {
//   //** CLEARING */
//   if(EO1_Toggle.classList.contains("selected"))
//   {
//     clearAnnotations('EO-1');
//     console.log("CLEAR");
//   }
//   //** ADDING */
//   else
//   {
//     groupsToggled.push('EO-1');
//     clearAnnotations();
//   }
//   EO1_Toggle.classList.toggle("selected");
// });
// DESIS_Toggle.addEventListener("click", function () {
//   //** CLEARING */
//   if(DESIS_Toggle.classList.contains("selected"))
//   {
//     clearAnnotations('DESIS');
//     console.log("CLEAR");
//   }
//   //** ADDING */
//   else
//   {
//     groupsToggled.push('DESIS');
//     clearAnnotations();
//   }
//   DESIS_Toggle.classList.toggle("selected");
// });
// ECOSTRESS_Toggle.addEventListener("click", function () {
//   //** CLEARING */
//   if(ECOSTRESS_Toggle.classList.contains("selected"))
//   {
//     clearAnnotations('ECOSTRESS');
//     console.log("CLEAR");
//   }
//   //** ADDING */
//   else
//   {
//     groupsToggled.push('ECOSTRESS');
//     clearAnnotations();
//   }
//   ECOSTRESS_Toggle.classList.toggle("selected");
// });
// EMIT_Toggle.addEventListener("click", function () {
//   //** CLEARING */
//   if(EMIT_Toggle.classList.contains("selected"))
//   {
//     clearAnnotations('EMIT');
//     console.log("CLEAR");
//   }
//   //** ADDING */
//   else
//   {
//     groupsToggled.push('EMIT');
//     clearAnnotations();
//   }
//   EMIT_Toggle.classList.toggle("selected");
// });
// MODIS_Toggle.addEventListener("click", function () {
//   //** CLEARING */
//   if(MODIS_Toggle.classList.contains("selected"))
//   {
//     clearAnnotations('MODIS');
//     console.log("CLEAR");
//   }
//   //** ADDING */
//   else
//   {
//     groupsToggled.push('MODIS');
//     clearAnnotations();
//   }
//   MODIS_Toggle.classList.toggle("selected");
// });

//** PRESET TOGGLES */
L1_3_Dropdown.addEventListener("click", function () {
  addPreset("Landsat 1-3", Landsat1_3_values);
  loopThroughLayers();
});
L4_5_Dropdown.addEventListener("click", function () {
  addPreset("Landsat 4-5", Landsat4_5_values);
  loopThroughLayers();
});
L8_9_Dropdown.addEventListener("click", function () {
  addPreset("Landsat 8-9", Landsat8_9_values);
  loopThroughLayers();
});
LNext_Dropdown.addEventListener("click", function () {
  addPreset("Landsat Next", LandsatNext_values);
  loopThroughLayers();
});
Sentinel2_Dropdown.addEventListener("click", function () {
  addPreset("Sentinel 2", Sentinel2_values);
  loopThroughLayers();
});
Sentinel3_Dropdown.addEventListener("click", function () {
  addPreset("Sentinel 3", Sentinel3_values);
  loopThroughLayers();
});
EO1_Dropdown.addEventListener("click", function () {
  addPreset("EO1", EO1_values);
  loopThroughLayers();
});
DESIS_Dropdown.addEventListener("click", function () {
  addPreset("DESIS", DESIS_values);
  loopThroughLayers();
});
ECOSTRESS_Dropdown.addEventListener("click", function () {
  addPreset("ECOSTRESS", ECOSTRESS_values);
  loopThroughLayers();
});
EMIT_Dropdown.addEventListener("click", function () {
  addPreset("EMIT", EMIT_values);
  loopThroughLayers();
});
MODIS_Dropdown.addEventListener("click", function () {
  addPreset("MODIS", MODIS_values);
  loopThroughLayers();
});
PACE_Dropdown.addEventListener("click", function () {
  addPreset("PACE", PACE_values);
  loopThroughLayers();
});
STELLA_Dropdown.addEventListener("click", function () {
  addPreset("STELLA", STELLA_values);
  loopThroughLayers();
});

CUSTOM_Dropdown.addEventListener("click", function () {
  addPreset("Custom", CUSTOM_values);
  loopThroughLayers();
});

//** TOGGLE GLOBALY STYLE */
// boxHeight_Global.addEventListener("change", function () {
//   console.log("change BoxHeight to: " + boxHeight_Global.value);
//   boxHeight = parseFloat(boxHeight_Global.value);
//   clearAnnotations();
// });
// boxSeperation_Global.addEventListener("change", function () {
//   console.log("change BoxHeight to: " + boxSeperation_Global.value);
//   boxSeperation = parseFloat(boxSeperation_Global.value);
//   clearAnnotations();
// });

groupSeperation_Global.addEventListener("change", function () {
  console.log("change BoxHeight to: " + groupSeperation_Global.value);
  groupSeperation = parseFloat(groupSeperation_Global.value);
  loopThroughLayers();
});

// labelSize_Global.addEventListener("change", function () {
//   labelSize = labelSize_Global.value + "%";
//   console.log("Label size: " + labelSize);
//   clearAnnotations();
// });
// labelSublabelSize_Global.addEventListener("change", function () {
//   sublabelSize = labelSublabelSize_Global.value + "%";
//   console.log("Label size: " + sublabelSize);
//   clearAnnotations();
// });
  
  //** TOGGLES OFF AN ON SECOND GRAPH */
secondGraph_Toggle.addEventListener("change", function () {
  if(!secondGraph_Toggle.checked)
  {
    chart_container.style.gridTemplateColumns = "minmax(200px, 1fr)";
  }
  else
  {
    chart_container.style.gridTemplateColumns = "minmax(200px, 1fr) minmax(200px, 1fr)";
  }
  chart2_element.classList.toggle("active");
});
  //** TOGGLES TRANSMISSION CURVE */
transmission_Toggle.addEventListener("change", function () {
  //console.log(chart.datasets);
  if(!transmission_Toggle.checked)
  {
    chart.hide(0);
    chart2.hide(0);
  }
  else
  {
    chart.show(0);
    chart2.show(0);
  }
});
  //** TOGGLES TRANSMISSION CURVE */
transmission_Toggle.addEventListener("change", function () {
  //console.log(chart.datasets);
  if(!transmission_Toggle.checked)
  {
    chart.hide(0);
    chart2.hide(0);
  }
  else
  {
    chart.show(0);
    chart2.show(0);
  }
});

//** DOWNLOAD SCREENSHOT */
downloadScreenshot.addEventListener("click", function () {
  const captureElement = document.getElementById('chart_container');

  html2canvas(captureElement, {
    scale: 3,
    dpi: 300,
  })
    .then(canvas => {
      canvas.style.display = 'none'
      document.body.appendChild(canvas)
      return canvas
    })
    .then(canvas => {
      const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
      const a = document.createElement('a')
      a.setAttribute('download', 'myGraph.png')
      a.setAttribute('href', image)
      a.click()
      canvas.remove()
    });
});

Chart1_min.addEventListener("change", function () {
  console.log(chart.options.scales.x.min);
  chart.options.scales.x.min = parseInt(Chart1_min.value);
  chart.update();
});
Chart1_max.addEventListener("change", function () {
  console.log(chart.options.scales.x.max);
  chart.options.scales.x.max = parseInt(Chart1_max.value);
  chart.update();
});
Chart2_min.addEventListener("change", function () {
  console.log(chart2.options.scales.x.min);
  chart2.options.scales.x.min = parseInt(Chart2_min.value);
  chart2.update();
});
Chart2_max.addEventListener("change", function () {
  console.log(Chart2_max.value);
  chart2.options.scales.x.max = parseInt(Chart2_max.value);
  chart2.update();
});

presetDropDown.addEventListener("click", function () {
  document.getElementById("myDropdown").classList.toggle("show");
  //console.log('dropdown');
});

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

console.log(boxAnnotations);
console.log(boxAnnotations2);

//** REMOVE BOX ANNOTATION */
// setTimeout(() => {
//   boxAnnotations.splice(0, 3);
//   console.log(boxAnnotations);
//   chart.update();
// }, 2000);
