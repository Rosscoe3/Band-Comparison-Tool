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
let L8_9_Toggle = document.getElementById("Landsat8-9");
let L4_5_Toggle = document.getElementById("Landsat4-5");
let L1_3_Toggle = document.getElementById("Landsat1-3");
let L7Toggle = document.getElementById("Landsat7");
let LNext_Toggle = document.getElementById("LandsatNext");

let Sentintel2_Toggle = document.getElementById("Sentinel-2");
let Sentintel3_Toggle = document.getElementById("Sentinel-3");
let EO1_Toggle = document.getElementById("EO1");
let DESIS_Toggle = document.getElementById("DESIS");
let ECOSTRESS_Toggle = document.getElementById("ECOSTRESS");
let EMIT_Toggle = document.getElementById("EMIT");
let MODIS_Toggle = document.getElementById("MODIS");

//** Graphs Styling */
let secondGraph_Toggle = document.getElementById("secondGraph_Toggle");
let transmission_Toggle = document.getElementById("transmission_Toggle");
let Chart1_min = document.getElementById("Chart1_min");
let Chart1_max = document.getElementById("Chart1_max");
let Chart2_min = document.getElementById("Chart2_min");
let Chart2_max = document.getElementById("Chart2_max");

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
function plotCSV() 
{
  let compressedArray = transmissionData.filter((element, index) => {
    return index % transmissionDataResolution === 0;
  });
  console.log(compressedArray);

  //** DETERMINE TRANSMISSION CURVE FOR CHART 1 */
  for (var i = 0; i < compressedArray.length - arrayEndCut_chart1; i++) 
  {
    chart.data.datasets[0].data[i] = {
      x: compressedArray[i].Wave * 1000,
      y: compressedArray[i].TotTrans,
    };
  }

  //** DETERMINE TRANSMISSION CURVE FOR CHART 2 */
  for (var i = 0; i < compressedArray.length; i++) 
  {
    if((compressedArray[i].Wave * 1000) >= minChartTwo)
    {
      console.log(compressedArray[i].Wave * 1000);
      //** HAVE TO MAKE IT START AT DATA 0 */
      chart2.data.datasets[0].data.push({
        x: compressedArray[i].Wave * 1000,
        y: compressedArray[i].TotTrans,
      });
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

var labelSize = "15%";
var sublabelSize = "15%";
var sublabelXOffset = 0.1;
var sublabelYOffset = 0.01;

//** ADD ALL BOX VALUES TO GRAPH */
addBox(430, 450, 
  0.1 + boxSeperation, 
  0.1 + boxHeight + boxSeperation, 
  "rgb(103,156,191)", "1", labelSize, "30m", sublabelSize, 1);
addBox(450, 510, 0.1, 0.1 + boxHeight, "rgb(0,101,141)", "2", labelSize, "30m", sublabelSize, 1);
addBox(530, 590, 0.1, 0.1 + boxHeight, "rgb(76,157,95)", "3", labelSize, "30m", sublabelSize, 1);
addBox(640, 670, 0.1, 0.1 + boxHeight, "rgb(194,32,54)", "4", labelSize, "30m", sublabelSize, 1);
addBox(850, 880, 0.1, 0.1 + boxHeight, "rgb(197,162,189)", "5", labelSize, "30m", sublabelSize, 1);
addBox(1570, 1650, 0.1, 0.1 + boxHeight, "rgb(211,153,121)", "6", labelSize, "30m", sublabelSize, 1);
addBox(2110, 2290, 0.1, 0.1 + boxHeight, "rgb(153,156,150)", "7", labelSize, "30m", sublabelSize, 1);
addBox(500, 680, 
  (0.1) - boxSeperation, 
  (0.1 + boxHeight) - boxSeperation, 
  "rgb(0,143,162)", "8", labelSize, "15m", sublabelSize, 1);
addBox(1360, 1380, 
  0.1 + boxSeperation, 
  0.1 + boxHeight + boxSeperation, 
  "rgb(116,128,161)", "9", labelSize, "30m", sublabelSize, 1);
addBox(10600, 11190, 0.1, 0.1 + boxHeight, "rgb(188,122,130)", "10", labelSize, "100m", sublabelSize, 2);
addBox(11500, 12510, 0.1, 0.1 + boxHeight, "rgb(188,122,130)", "11", labelSize, "100m", sublabelSize, 2);
addBox(12610, 12640, (0.1) - boxSeperation, 0.1 + boxHeight + boxSeperation, "rgba(150,150,150, 0.5)", "", labelSize, "MSS", sublabelSize, 2);

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

  //** takes out specific graph in the graph list */
  if(groupsToggled.includes(graph))
  {          
    groupsToggled.splice(groupsToggled.indexOf(graph), 1);
  }
  console.log(groupsToggled);
  updateAnnotations();
}

var minChart1 = 400;
var minChart1 = 7000;

//** UPDATES ALL CURRENTLY SELECTED ANNOTATIONS */
function updateAnnotations()
{

  var offsetY = groupSeperation; 
  var min1;

  for(var i = 0; i < groupsToggled.length; i++)
  {
    offsetY = groupSeperation * i;
    console.log(groupsToggled[i]);

    if(groupsToggled[i] == 'L8-9')
    {
      //** Band 1 - Coastal aerosol	*/
      addBox(430, 450, 
        offsetY + 0.1 + boxSeperation, 
        offsetY + 0.1 + boxHeight + boxSeperation, 
        "rgb(103,156,191)", "1", labelSize, "30m", sublabelSize, 1);
      
      //** Band 2 - Blue */
      addBox(450, 510, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(0,101,141)", "2", labelSize, "30m", sublabelSize, 1);
      
      //** Band 3 - Green */
      addBox(530, 590, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(76,157,95)", "3", labelSize, "30m", sublabelSize, 1);
      
      //** Band 4 - Red */
      addBox(640, 670, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(194,32,54)", "4", labelSize, "30m", sublabelSize, 1);
      
      //** Band 5 - Near Infrared (NIR) */
      addBox(850, 880, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(197,162,189)", "5", labelSize, "30m", sublabelSize, 1);
      
      //** Band 6 - Shortwave Infrared (SWIR) 1	 */
      addBox(1570, 1650, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(211,153,121)", "6", labelSize, "30m", sublabelSize, 1);
      
      //** Band 7 - Shortwave Infrared (SWIR) 2 */
      addBox(2110, 2290, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(153,156,150)", "7", labelSize, "30m", sublabelSize, 1);
      
      //** Band 8 - Panchromatic */
      addBox(500, 680, 
        (offsetY + 0.1) - boxSeperation, 
        (offsetY + 0.1 + boxHeight) - boxSeperation, 
        "rgb(0,143,162)", "8", labelSize, "15m", sublabelSize, 1);
      
      //** Band 9 - Cirrus */
      addBox(1360, 1380, 
        offsetY + 0.1 + boxSeperation, 
        offsetY + 0.1 + boxHeight + boxSeperation, 
        "rgb(116,128,161)", "9", labelSize, "30m", sublabelSize, 1);
      
      //** Band 10 - Thermal Infrared (TIRS) 1 */
      addBox(10600, 11190, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(188,122,130)", "10", labelSize, "100m", sublabelSize, 2);
      
      //** Band 11 - Thermal Infrared (TIRS) 2 */
      addBox(11500, 12510, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(188,122,130)", "11", labelSize, "100m", sublabelSize, 2);
    }
    else if(groupsToggled[i] == 'L7')
    {
      addBox(450, 520, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(0,101,141)", "1", labelSize, "30m", sublabelSize, 1);
      addBox(520, 600, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(76,157,95)", "2", labelSize, "30m", sublabelSize, 1);
      addBox(630, 690, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(194,32,54)", "3", labelSize, "30m", sublabelSize, 1);
      addBox(770, 900, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(197,162,189)", "4", labelSize, "30m", sublabelSize, 1);
      addBox(1550, 1750, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(211,153,121)", "5", labelSize, "30m", sublabelSize, 1);
      addBox(10400, 12500, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(188,122,130)", "6", labelSize, "60m", sublabelSize, 2);
      addBox(2090, 2350, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(153,156,150)", "7", labelSize, "30m", sublabelSize, 1);
      addBox(520, 900, 
        (offsetY + 0.1) - boxSeperation, 
        (offsetY + 0.1 + boxHeight) - boxSeperation, 
        "rgb(0,143,162)", "8", labelSize, "15m", sublabelSize, 1);
    }
    else if(groupsToggled[i] == 'L4-5')
    {
      addBox(450, 520, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(0,101,141)", "1", labelSize, "30m", sublabelSize, 1);
      addBox(520, 600, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(76,157,95)", "2", labelSize, "30m", sublabelSize, 1);
      addBox(630, 690, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(194,32,54)", "3", labelSize, "30m", sublabelSize, 1);
      addBox(760, 900, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(197,162,189)", "4", labelSize, "30m", sublabelSize, 1);
      addBox(1550, 1750, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(211,153,121)", "5", labelSize, "30m", sublabelSize, 1);
      addBox(10400, 12500, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(188,122,130)", "6", labelSize, "120m", sublabelSize, 2);
      addBox(2080, 2350, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(153,156,150)", "7", labelSize, "30m", sublabelSize, 1);
    }
    else if(groupsToggled[i] == 'L1-3')
    {
      addBox(500, 600, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(76,157,95)", "1", labelSize, "80m", sublabelSize, 1);
      addBox(600, 700, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(194,32,54)", "2", labelSize, "80m", sublabelSize, 1);
      addBox(700, 800, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(125,38,82)", "3", labelSize, "80m", sublabelSize, 1);
      addBox(800, 1100, offsetY + 0.1, offsetY + 0.1 + boxHeight, "rgb(197,162,189)", "4", labelSize, "80m", sublabelSize, 1);
    }
    
    else if(groupsToggled[i] == 'LNext')
    {
      //** Band 1 - Violet	*/
      addBox(402, 422, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(103,156,191)", "1", labelSize, "60m", sublabelSize, 1);

      //** Band 2 - Coastal/Aerosol		*/
      addBox(433, 453, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(103,156,191)", "2", labelSize, "20m", sublabelSize, 1);

      //** Band 3 - Blue 	*/
      addBox(457.5, 522.5, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(103,156,191)", "3", labelSize, "10m", sublabelSize, 1);

      //** Band 4 - Green 	*/
      addBox(542.5, 577.5, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight,
        "rgb(103,156,191)", "4", labelSize, "10m", sublabelSize, 1);

      //** Band 5 - Yellow 	*/
      addBox(585, 615, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(103,156,191)", "5", labelSize, "20m", sublabelSize, 1);

      //** Band 6 - Orange	*/
      addBox(610, 630, 
        offsetY + 0.1 + boxSeperation, 
        offsetY + 0.1 + boxHeight + boxSeperation, 
        "rgb(103,156,191)", "6", labelSize, "20m", sublabelSize, 1);

      //** Band 7 - Red 1	 */
      addBox(640, 660, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(103,156,191)", "7", labelSize, "20m", sublabelSize, 1);

      //** Band 8 - Red 2  */
      addBox(650, 680, 
        offsetY + 0.1 + boxSeperation, 
        offsetY + 0.1 + boxHeight + boxSeperation, 
        "rgb(103,156,191)", "8", labelSize, "10m", sublabelSize, 1);

      //** Band 9 - Red Edge 1  */
      addBox(697.5, 712.5, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(103,156,191)", "9", labelSize, "20m", sublabelSize, 1);
      
      //** Band 10 - Red Edge 2  */
      addBox(732.5, 747.5, 
        offsetY + 0.1 + boxSeperation, 
        offsetY + 0.1 + boxHeight + boxSeperation, 
        "rgb(103,156,191)", "10", labelSize, "20m", sublabelSize, 1);

      //** Band 11 - NIR Broad  */
      addBox(784.5, 899.5, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight,
        "rgb(103,156,191)", "11", labelSize, "10m", sublabelSize, 1);

      //** Band 12 - NIR 1  */
      addBox(855, 875, 
        offsetY + 0.1 + boxSeperation, 
        offsetY + 0.1 + boxHeight + boxSeperation, 
        "rgb(103,156,191)", "12", labelSize, "20m", sublabelSize, 1);

      //** Band 13 - Water Vapor  */
      addBox(935, 955, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(103,156,191)", "13", labelSize, "60m", sublabelSize, 1);

      //** Band 14 - Liquid Water  */
      addBox(975, 995, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight,
        "rgb(103,156,191)", "14", labelSize, "20m", sublabelSize, 1);
      
      //** Band 15 - Snow/Ice 1  */
      addBox(1025, 1045, 
        offsetY + 0.1 + boxSeperation, 
        offsetY + 0.1 + boxHeight + boxSeperation, 
        "rgb(103,156,191)", "15", labelSize, "20m", sublabelSize, 1);
      
      //** Band 16 - Snow/Ice 2  */
      addBox(1080, 1100, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight,
        "rgb(103,156,191)", "16", labelSize, "20m", sublabelSize, 1);
      
      //** Band 17 - Cirrus  */
      addBox(1360, 1390, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(103,156,191)", "17", labelSize, "60m", sublabelSize, 1);
      
      //** Band 18 - SWIR 1  */
      addBox(1565, 1655, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(103,156,191)", "18", labelSize, "10m", sublabelSize, 1);

      //** Band 19 - SWIR 2a  */
      addBox(2025.5, 2050.5, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(103,156,191)", "19", labelSize, "20m", sublabelSize, 1);
      
      //** Band 20 - SWIR 2b  */
      addBox(2088, 2128, 
        offsetY + 0.1 + boxSeperation, 
        offsetY + 0.1 + boxHeight + boxSeperation, 
        "rgb(103,156,191)", "20", labelSize, "20m", sublabelSize, 1);

      //** Band 21 - SWIR 2c  */
      addBox(2191, 2231, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(103,156,191)", "21", labelSize, "20m", sublabelSize, 1);

      //** Band 22 - TIR 1  */
      addBox(8050, 8425, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(103,156,191)", "22", labelSize, "60m", sublabelSize, 2);

      //** Band 23 - TIR 2  */
      addBox(8425, 8775, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(103,156,191)", "23", labelSize, "60m", sublabelSize, 2);
      
      //** Band 24 - TIR 3  */
      addBox(8925, 9275, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(103,156,191)", "24", labelSize, "60m", sublabelSize, 2);

      //** Band 25 - TIR 4  */
      addBox(11025, 11575, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(103,156,191)", "25", labelSize, "60m", sublabelSize, 2);

      //** Band 26 - TIR 5  */
      addBox(11775, 12225, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(103,156,191)", "26", labelSize, "60m", sublabelSize, 2);
    }

    else if(groupsToggled[i] == 'Sent-2')
    {
      //** B1 - CA */
      addBox(433, 453, 
        offsetY + 0.1 + boxSeperation, 
        offsetY + 0.1 + boxHeight + boxSeperation, 
        "rgb(103,156,191)", "1", labelSize, "60m", sublabelSize, 1);
      
      //** B2 - Blue */
        addBox(457.5, 522.5, 
        (offsetY + 0.1) - boxSeperation, 
        (offsetY + 0.1 + boxHeight) - boxSeperation,
         "rgb(0,101,141)", "2", labelSize, "10m", sublabelSize, 1);
      
      //** B3 - Green */
      addBox(542, 577.5, 
        (offsetY + 0.1) - boxSeperation, 
        (offsetY + 0.1 + boxHeight) - boxSeperation, 
        "rgb(76,157,95)", "3", labelSize, "10m", sublabelSize, 1);
      
      //** B4 - Red */
      addBox(649.5, 680.5, 
        (offsetY + 0.1) - boxSeperation, 
        (offsetY + 0.1 + boxHeight) - boxSeperation, 
        "rgb(194,32,54)", "4", labelSize, "10m", sublabelSize, 1);
      
      //** B5 - Red Edge */
      addBox(697.5, 712.5, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(197,162,189)", "5", labelSize, "20m", sublabelSize, 1);
      
      //** B6 - NIR-1 */
      addBox(732.5, 747.5, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(211,153,121)", "6", labelSize, "20m", sublabelSize, 1);
      
      //** B7 - NIR-2 */
      addBox(773, 793, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(153,156,150)", "7", labelSize, "20m", sublabelSize, 1);
      
      //** B8 - NIR-3	 */
      addBox(784.5, 899.5, 
        (offsetY + 0.1) - boxSeperation, 
        (offsetY + 0.1 + boxHeight) - boxSeperation, 
        "rgb(0,143,162)", "8", labelSize, "10m", sublabelSize, 1);
      
      //** B8a - Water Vapor-1	 */
      addBox(855, 875, 
        offsetY + 0.1 + boxSeperation, 
        offsetY + 0.1 + boxHeight + boxSeperation, 
        "rgb(116,128,161)", "8a", labelSize, "20m", sublabelSize, 1);

      //** B9 - Water Vapor-2 */
      addBox(935, 945, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(211,153,121)", "9", labelSize, "60m", sublabelSize, 1);  
      
      //** B10 - Cirrus */
      addBox(1365, 1395, 
        offsetY + 0.1 + boxSeperation, 
        offsetY + 0.1 + boxHeight + boxSeperation, 
        "rgb(188,122,130)", "10", labelSize, "60m", sublabelSize, 1);
      
      //** B11 - SWIR1 */
      addBox(1565, 1655, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(188,122,130)", "11", labelSize, "20m", sublabelSize, 1);
      
      //** B12 - SWIR2 */
      addBox(2100, 2280, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(188,122,130)", "12", labelSize, "20m", sublabelSize, 1);
    }
    else if(groupsToggled[i] == 'Sent-3')
    {
      chart.options.scales.x.min = 395;

      //** Oa01 - CA-1 */
      addBox(395, 405, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight,
        "rgb(103,156,191)", "1", labelSize, "300m", sublabelSize, 1);
      
      //** Oa02 - CA-2 */
        addBox(407, 417, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight,
        "rgb(0,101,141)", "2", labelSize, "300m", sublabelSize, 1);
      
      //** Oa03 - CA-3 */
      addBox(438, 448, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(76,157,95)", "3", labelSize, "300m", sublabelSize, 1);
      
      //** Oa04 - Blue-1 */
      addBox(485, 495, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(194,32,54)", "4", labelSize, "300m", sublabelSize, 1);
      
      //** Oa05 - Blue-2 */
      addBox(505, 515, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(197,162,189)", "5", labelSize, "300m", sublabelSize, 1);
      
      //** Oa06 - Green */
      addBox(555, 565, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(197,162,189)", "6", labelSize, "300m", sublabelSize, 1);

      //** Oa07 - Red-1 */
      addBox(615, 625, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(197,162,189)", "7", labelSize, "300m", sublabelSize, 1);
      
      //** Oa08 - Red-2 */
      addBox(660, 670, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(197,162,189)", "8", labelSize, "300m", sublabelSize, 1);
      
      //** Oa09 - Red-3 */
      addBox(670, 677, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(197,162,189)", "9", labelSize, "300m", sublabelSize, 1);
      
      //** Oa10 - Red-4 */
      addBox(677, 685, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(197,162,189)", "10", labelSize, "300m", sublabelSize, 1);

      //** Oa11 - NIR-1 */
      addBox(703, 713, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(197,162,189)", "11", labelSize, "300m", sublabelSize, 1);
      
      //** Oa12 - NIR-2 */
      addBox(750, 757, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(197,162,189)", "12", labelSize, "300m", sublabelSize, 1);

      //** Oa13 - NIR-3 */
      addBox(760, 762, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(197,162,189)", "13", labelSize, "300m", sublabelSize, 1);

      //** Oa14 - NIR-4 */
      addBox(762, 766, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(197,162,189)", "14", labelSize, "300m", sublabelSize, 1);

      //** Oa15 - NIR-5 */
      addBox(766, 769, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(197,162,189)", "15", labelSize, "300m", sublabelSize, 1);

      //** Oa16 - NIR-6 */
      addBox(771, 786, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(197,162,189)", "16", labelSize, "300m", sublabelSize, 1);

      //** Oa17 - NIR-7 */
      addBox(855, 875, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(197,162,189)", "17", labelSize, "300m", sublabelSize, 1);

      //** Oa18 - NIR-8 */
      addBox(880, 890, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(197,162,189)", "18", labelSize, "300m", sublabelSize, 1);

      //** Oa19 - NIR-9 */
      addBox(895, 905, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(197,162,189)", "19", labelSize, "300m", sublabelSize, 1);

      //** Oa20 - NIR-10 */
      addBox(930, 950, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(197,162,189)", "20", labelSize, "300m", sublabelSize, 1);

      //** Oa21 - NIR-11 */
      addBox(1000, 1040, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight, 
        "rgb(197,162,189)", "21", labelSize, "300m", sublabelSize, 1);
    }
    else if(groupsToggled[i] == 'EO-1')
    {
      //** CA */
      addBox(433, 453, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight,
        "rgb(103,156,191)", "1", labelSize, "30m", sublabelSize, 1);

      //** Blue */
      addBox(450, 515, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight,
        "rgb(103,156,191)", "1", labelSize, "30m", sublabelSize, 1);

      //** Green */
      addBox(525, 605, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight,
        "rgb(103,156,191)", "1", labelSize, "30m", sublabelSize, 1);

      //** Red */
      addBox(630, 690, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight,
        "rgb(103,156,191)", "1", labelSize, "30m", sublabelSize, 1);

      //** NIR-1 */
      addBox(775, 805, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight,
        "rgb(103,156,191)", "1", labelSize, "30m", sublabelSize, 1);

      //** NIR-2 */
      addBox(845, 890, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight,
        "rgb(103,156,191)", "1", labelSize, "30m", sublabelSize, 1);
      
      //** NIR-3 */
      addBox(1200, 1300, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight,
        "rgb(103,156,191)", "1", labelSize, "30m", sublabelSize, 1);

      //** SWIR1 */
      addBox(1550, 1750, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight,
        "rgb(103,156,191)", "1", labelSize, "30m", sublabelSize, 1);

      //** SWIR2 */
      addBox(2080, 2350, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight,
        "rgb(103,156,191)", "1", labelSize, "30m", sublabelSize, 1);

      //** Panchromatic */
      addBox(480, 690, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight,
        "rgb(103,156,191)", "1", labelSize, "10m", sublabelSize, 1); 
    }
    else if(groupsToggled[i] == 'DESIS')
    {
      var width = 2.5;
      var length = (600/width);
      
      for(var i = 0; i <= length; i++)
      {
        var start = 400 + (width * i);
        
        addBox(start, start + width, 
          offsetY + 0.1, 
          offsetY + 0.1 + boxHeight,
          "rgb(103,156,191)", "", labelSize, "", sublabelSize, 1); 
      }
    }
    else if(groupsToggled[i] == 'ECOSTRESS')
    {
      //** B1 */
      addBox(1475, 1845, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight,
        "rgb(103,156,191)", "1", labelSize, "70m", sublabelSize, 1);

      //** B2 */
      addBox(8113, 8467, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight,
        "rgb(103,156,191)", "2", labelSize, "70m", sublabelSize, 2);
      
      //** B3 */
      addBox(8625, 8935, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight,
        "rgb(103,156,191)", "3", labelSize, "70m", sublabelSize, 2);
      
      //** B4 */
      addBox(9002, 9398, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight,
        "rgb(103,156,191)", "4", labelSize, "70m", sublabelSize, 2);
      
      //** B5 */
      addBox(10285, 10695, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight,
        "rgb(103,156,191)", "5", labelSize, "70m", sublabelSize, 2);

      //** B6 */
      addBox(11784.5, 12395.5, 
        offsetY + 0.1, 
        offsetY + 0.1 + boxHeight,
        "rgb(103,156,191)", "6", labelSize, "70m", sublabelSize, 2);
    }
    else if(groupsToggled[i] == 'EMIT')
    {
      var width = 7.5;
      var length = (2070/width);
      
      addInLine(width, length, offsetY);
    }
  }

  chart.update();
  chart2.update();
}

function updateMinAndMax(min)
{
  if(transmission_Toggle.checked)
  {
    chart.data.datasets.scales.x.min = 400;
  }
  else
  {
    if(min < minChart1)
    {
      minChart1 = min;
      chart.data.datasets.scales.x.min = minChart1;
    }
    if(min < minChart2)
    {
      
    }
  }
}

function addInLine(width, length, offsetY)
{ 
  for(var i = 0; i <= length; i++)
  {
    var start = 380 + (width * i);
    
    addBox(start, start + width, 
      offsetY + 0.1, 
      offsetY + 0.1 + boxHeight,
      "rgb(103,156,191)", "", labelSize, "", sublabelSize, 1); 
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
L4_5_Toggle.addEventListener("click", function () {
  //** CLEARING */
  if(L4_5_Toggle.classList.contains("selected"))
  {
    clearAnnotations('L4-5');
    console.log("CLEAR");
  }
  //** ADDING */
  else
  {
    groupsToggled.push('L4-5');
    clearAnnotations();
  }
  L4_5_Toggle.classList.toggle("selected");
});
L1_3_Toggle.addEventListener("click", function () {
  //** CLEARING */
  if(L1_3_Toggle.classList.contains("selected"))
  {
    clearAnnotations('L1-3');
    console.log("CLEAR");
  }
  //** ADDING */
  else
  {
    groupsToggled.push('L1-3');
    clearAnnotations();
  }
  L1_3_Toggle.classList.toggle("selected");
});
LNext_Toggle.addEventListener("click", function () {
  //** CLEARING */
  if(LNext_Toggle.classList.contains("selected"))
  {
    clearAnnotations('LNext');
    console.log("CLEAR");
  }
  //** ADDING */
  else
  {
    groupsToggled.push('LNext');
    clearAnnotations();
  }
  LNext_Toggle.classList.toggle("selected");
});
Sentintel2_Toggle.addEventListener("click", function () {
  //** CLEARING */
  if(Sentintel2_Toggle.classList.contains("selected"))
  {
    clearAnnotations('Sent-2');
    console.log("CLEAR");
  }
  //** ADDING */
  else
  {
    groupsToggled.push('Sent-2');
    clearAnnotations();
  }
  Sentintel2_Toggle.classList.toggle("selected");
});
Sentintel3_Toggle.addEventListener("click", function () {
  //** CLEARING */
  if(Sentintel3_Toggle.classList.contains("selected"))
  {
    clearAnnotations('Sent-3');
    console.log("CLEAR");
  }
  //** ADDING */
  else
  {
    groupsToggled.push('Sent-3');
    clearAnnotations();
  }
  Sentintel3_Toggle.classList.toggle("selected");
});
EO1_Toggle.addEventListener("click", function () {
  //** CLEARING */
  if(EO1_Toggle.classList.contains("selected"))
  {
    clearAnnotations('EO-1');
    console.log("CLEAR");
  }
  //** ADDING */
  else
  {
    groupsToggled.push('EO-1');
    clearAnnotations();
  }
  EO1_Toggle.classList.toggle("selected");
});
DESIS_Toggle.addEventListener("click", function () {
  //** CLEARING */
  if(DESIS_Toggle.classList.contains("selected"))
  {
    clearAnnotations('DESIS');
    console.log("CLEAR");
  }
  //** ADDING */
  else
  {
    groupsToggled.push('DESIS');
    clearAnnotations();
  }
  DESIS_Toggle.classList.toggle("selected");
});
ECOSTRESS_Toggle.addEventListener("click", function () {
  //** CLEARING */
  if(ECOSTRESS_Toggle.classList.contains("selected"))
  {
    clearAnnotations('ECOSTRESS');
    console.log("CLEAR");
  }
  //** ADDING */
  else
  {
    groupsToggled.push('ECOSTRESS');
    clearAnnotations();
  }
  ECOSTRESS_Toggle.classList.toggle("selected");
});
EMIT_Toggle.addEventListener("click", function () {
  //** CLEARING */
  if(EMIT_Toggle.classList.contains("selected"))
  {
    clearAnnotations('EMIT');
    console.log("CLEAR");
  }
  //** ADDING */
  else
  {
    groupsToggled.push('EMIT');
    clearAnnotations();
  }
  EMIT_Toggle.classList.toggle("selected");
});
MODIS_Toggle.addEventListener("click", function () {
  //** CLEARING */
  if(MODIS_Toggle.classList.contains("selected"))
  {
    clearAnnotations('MODIS');
    console.log("CLEAR");
  }
  //** ADDING */
  else
  {
    groupsToggled.push('MODIS');
    clearAnnotations();
  }
  MODIS_Toggle.classList.toggle("selected");
});

//** TOGGLE GLOBALY STYLE */
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
groupSeperation_Global.addEventListener("change", function () {
  console.log("change BoxHeight to: " + groupSeperation_Global.value);
  groupSeperation = parseFloat(groupSeperation_Global.value);
  clearAnnotations();
});
labelSize_Global.addEventListener("change", function () {
  labelSize = labelSize_Global.value + "%";
  console.log("Label size: " + labelSize);
  clearAnnotations();
});
labelSublabelSize_Global.addEventListener("change", function () {
  sublabelSize = labelSublabelSize_Global.value + "%";
  console.log("Label size: " + sublabelSize);
  clearAnnotations();
});
  
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

console.log(boxAnnotations);
console.log(boxAnnotations2);

//** REMOVE BOX ANNOTATION */
// setTimeout(() => {
//   boxAnnotations.splice(0, 3);
//   console.log(boxAnnotations);
//   chart.update();
// }, 2000);
