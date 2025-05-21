//* FOR LANDSAT SITE - COMMENT THIS OUT */
import "./style.css";

//** CHART JS SETUP */
const ctx = document.getElementById("VSWIR");
const ctx2 = document.getElementById("TIR");
var chart1_element = document.getElementById("VSWIR_Chart");
var chart2_element = document.getElementById("TIRS_Chart");
var chart_container = document.getElementById("chart_container");
let myData = "/files/myData.csv";
//* FOR LANDSAT SITE - UNCOMMENT */
// let myData = "https://landsat.gsfc.nasa.gov/apps/Spectral-Band-Comparison-Tool/public/files/myData.csv";

let transmissionData = [];
var boxAnnotations = [];
var boxAnnotations2 = [];
var groupsToggled = ['L8-9'];
var labels = [];

//** MIN AND MAX VALUES */
var arrayEndCut_chart1 = 1150;
var transmissionDataResolution = 1;
var minChartTwo = 7000;
var boxSeperation = 0.0;
var boxHeight = 3;
var groupSeperation = 22;
var yStartValue = 5;
var boxPadding = 2;

var sensorNumb = 0;

// Parse URL search parameters for "mode"
const urlParams = new URLSearchParams(window.location.search);
//For the link + /?mode=commercial
const commercialMode = urlParams.get("mode") === "commercial";
console.log(commercialMode);

// Now you can use the Commercial variable anywhere in your code
// Example: console.log("Commercial mode:", Commercial);

//** TUTORIAL HTML ELEMENTS */
let tut_btn_prev = document.getElementById("tut-prev");
let tut_btn_next = document.getElementById("tut-next");
let tut_btn_skip = document.getElementById("tut-skip");
let tut_text = document.getElementById("tut_text");
let tut_wrap = document.getElementById("tutorial-wrap");
let tutorialTextList = [
  "Welcome to the <b>Spectral Band Comparison Tool!</b> This app helps you compare different Earth-observing satellites and the spectral bands they can detect.",
  "To get started, select the <b>+</b> button to add an instrument.",
  "Select an instrument from the list.",
  "All the instruments you have selected will appear here under the <b>Layers</b> tab. Select the dropdown icon “<b>›</b>” to expand your selection.",
  "Each instrument’s values are customizable, select the dropdown icon “<b>›</b>” next to <b>Global Style</b> to affect all bands within an instrument.",
  "These values control how the bands are displayed on the graph. Try toggling the <b>Labels</b> checkmark to see how it affects the visualization.",
  "After you have edited the values to your liking, click on <b>Export (PNG)</b> to download an image of your creation.",
];
let tutorialIndex = 0;
let tutorial = true;

//** GRAB HTML OBJECTS */
let sidebarButton = document.getElementById("openSidebarIcon");
let layers = document.getElementById("layers");
let infoIcon = document.getElementById("infoIcon");

//** TUTORIAL BUTTONS */

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
let L7_Dropdown = document.getElementById("preset_L7");
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
let WorldView_1_Dropdown = document.getElementById("preset_Worldview1");
let WorldView_2_Dropdown = document.getElementById("preset_Worldview2");
let WorldView_3_Dropdown = document.getElementById("preset_Worldview3");
let WorldView_4_Dropdown = document.getElementById("preset_Worldview4");

//** IF THE COMMERCIAL MODE IS LOADED */
if(commercialMode)
{
  // Create a new <a> element for the commercial preset
  const commercialPreset = document.createElement("a");
  commercialPreset.id = "preset_Commercial";
  commercialPreset.textContent = "Commercial";
  document.getElementById("myDropdown").appendChild(commercialPreset);

  // Add event listener for the new preset
  commercialPreset.addEventListener("click", function () {
    addPreset("Commercial", Commercial_values);
    if (tutorial && tutorialIndex == 2) {
      progressTutorial(true);
    }
  });
}

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

let presetDropDown = document.getElementById("dropDownBtn_layers");

let graphConnector = document.getElementById("graphConnector");
let boxHeight_Global = document.getElementById("boxHeight_Global");
let boxSeperation_Global = document.getElementById("boxSeperation_Global");
let groupSeperation_Global = document.getElementById("groupSeperation_Global");
let yStart_Global = document.getElementById("yStart_Global");
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
      lineTension: 0.0,
      tension: 0.2,
      cubicInterpolationMode: "default",
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
          text: "Atmospheric Transmission (%)",
          font: {
            size: 15,
          },
        },
        min: 0.0,
        max: 90.0,
      },
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "Wavelength (nm)",
          align: "center",
          font: {
            size: 15,
          },
        },
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
        min: 0.0,
        max: 90.0,
      },
      x: {
        title: {
          display: true,
          text: "",
          align: "center",
          font: {
            size: 15,
          },
        },
        min: parseInt(Chart2_min.value),
        max: parseInt(Chart2_max.value),
      },
    },
    tooltips: {
      mode: 'nearest',
      intersect: false,
      callbacks: {
        label: (item) => item.dataset.label + ': ' + 
           this.originalValues[item.datasetIndex].data[item.dataIndex]
      }
    },
    hover: {
      mode: 'index',
      intersect: false
    }
  },
  plugins: ["chartjs-plugin-annotation"],
  options2,
};

const chart = new Chart(ctx, config);
const chart2 = new Chart(ctx2, config2);

init();
function init() {
  setTimeout(() => {
    addPreset("Landsat 8-9 (OLI & TIRS)", Landsat8_9_values);
  }, 1000);
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
  // let compressedArray = transmissionData.filter((element, index) => {
  //   return index % transmissionDataResolution === 0;
  // });

  let compressedArray = transmissionData;

  //** DETERMINE TRANSMISSION CURVE FOR CHART 1 */
  // - arrayEndCut_chart1
  for (var i = 0; i < compressedArray.length; i++) 
  {
    chart.data.datasets[0].data[i] = {
      x: Number(compressedArray[i].Wave) * 1000,
      y: Number(compressedArray[i].TotTrans) * 100,
    };

    chart2.data.datasets[0].data[i] = {
      x: Number(compressedArray[i].Wave) * 1000,
      y: Number(compressedArray[i].TotTrans) * 100,
    };
  }

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
var sublabelXOffset = 10;
var sublabelYOffset = 1;

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
  graphNumb, 
  title,
  visibility,
) {
  
  var extraText = "";
  var y_padding_box = 0;
  var borderWidth = 1;
  var color_update = color;
  var labelColor = "rgb(245,245,245)";
  var yAdjust = 0;
  var textWeight = "bold"; 

  var box_visibility = true;
  var label_visibility = true;
  var sublabel_visibility = true;

  //sulabel
  var sub_rotation = 0;
  var sub_yMin = yHeight + sublabelYOffset + y_padding_box;
  var sub_yMax = yHeight + sublabelYOffset + y_padding_box;
  var sub_xMin = xMin;
  var sub_xMax = xMax;
  box_visibility = visibility;

  if(title.includes("_Title"))
  {
    extraText = "_Title";
    borderWidth = 0;
    color_update = addAlpha("#000000", '0.5');
    labelColor = "rgb(0, 0, 0)";
    textWeight = "lighter";

    box_visibility = false;
    label_visibility = false;
    sublabel_visibility = true;

    var subLabelPadding = 25;

    if(graphNumb == 2)
    {
      subLabelPadding = 50;
    }

    //sublabel
    // sub_rotation = 0;
    // sub_yMin = yMin;
    // sub_yMax = yHeight;
    // sub_xMin = xMax;
    // sub_xMax = xMax;
  }

  var box = {
    type: "box",
    xMin: xMin,
    xMax: xMax,
    yMin: yMin - y_padding_box,
    yMax: yHeight + y_padding_box,
    borderWidth: borderWidth,
    backgroundColor: color_update,
    title: title + "_box" + extraText,
    display: box_visibility,
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
      borderColor: labelColor,
      color: labelColor,
    },
    color: labelColor,
    title: title + "_label" + extraText,
    yAdjust: yAdjust,
    display: label_visibility,
  };
  var subLabel = {
    type: "label",
    xMin: sub_xMin,
    xMax: sub_xMax,
    yMin: sub_yMin,
    yMax: sub_yMax,
    content: [subLabelText],
    font: {
      size: sublabelSize,
      color: "rgb(245,245,245)",
    },
    rotation: sub_rotation,
    color: "rgb(0, 0, 0)",
    title: title + "_sublabel" + extraText,
    display: sublabel_visibility,
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

//** ARRAYS OF PRESET VALUES */
var Landsat1_3_values = [
  //** TITLE */
  {
    title: "Title",
    color: '#d1d1d1',
    xMin: 430, 
    xMax: 2290,
    yHeight: boxHeight,
    labelSize: 50,
    labelText: "",
    sublabelSize: 15, 
    subLabelText: 'Landsat 1-5 (MSS)',
    graphNumb: 1,
    yOffset: 4,
  },
  {
    title: "Band 4 - Green",
    color: '#418652',
    xMin: 500, 
    xMax: 600,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "4",
    sublabelSize: 9, 
    subLabelText: '60m',
    graphNumb: 1,
    yOffset: 0,
    link: "https://landsat.gsfc.nasa.gov/satellites/",
  },
  {
    title: "Band 5 - Red",
    color: '#DD2C44',
    xMin: 600, 
    xMax: 700,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "5",
    sublabelSize: 9, 
    subLabelText: '60m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    title: 'Band 6 - Near Infrared (NIR)',
    color: '#EA0652',
    xMin: 700, 
    xMax: 800,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "6",
    sublabelSize: 9, 
    subLabelText: '60m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    title: 'Band 7 - Near Infrared (NIR)',
    color: '#9D6289',
    xMin: 800, 
    xMax: 1100,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "7",
    sublabelSize: 9, 
    subLabelText: '60m',
    graphNumb: 1,
    yOffset: 0,
  },  
];
var Landsat4_5_values = [
  //** TITLE */
  {
    title: "Title",
    color: '#d1d1d1',
    xMin: 450, 
    xMax: 2350,
    yHeight: boxHeight,
    labelSize: 50,
    labelText: "",
    sublabelSize: 15, 
    subLabelText: 'Landsat 4-5 (TM)',
    graphNumb: 1,
    yOffset: 4,
  },
  {
    title: 'Band 1 - Blue',
    color: '#0084B8',
    xMin: 450, 
    xMax: 520,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "1",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0,
    link: "https://landsat.gsfc.nasa.gov/satellites/",
  },
  {
    title: 'Band 2 - Green',
    color: '#418652',
    xMin: 520, 
    xMax: 600,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "2",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    title: 'Band 3 - Red',
    color: '#DD2C44',
    xMin: 630, 
    xMax: 690,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "3",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    title: 'Band 4 - Near Infrared (NIR)',
    color: '#9D6289',
    xMin: 760, 
    xMax: 900,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "4",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0,
  },  
  {
    title: 'Band 5 - Shortwave Infrared (SWIR) 1',
    color: '#D76B23',
    xMin: 1550, 
    xMax: 1750,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "5",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0,
  },  
  {
    title: 'Band 6 - Thermal',
    color: '#AD5C64',
    xMin: 10400, 
    xMax: 12500,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "6",
    sublabelSize: 9, 
    subLabelText: '120m',
    graphNumb: 2,
    yOffset: 0,
  },  
  {
    title: 'Band 7 - Shortwave Infrared (SWIR) 2',
    color: '#7B8179',
    xMin: 2080, 
    xMax: 2350,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "7",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0,
  },  
];
var Landsat7_values = [
  //** TITLE */
  {
    title: "Title",
    color: '#d1d1d1',
    xMin: 450, 
    xMax: 2350,
    yHeight: boxHeight,
    labelSize: 50,
    labelText: "",
    sublabelSize: 15, 
    subLabelText: 'Landsat 7 (ETM+)',
    graphNumb: 1,
    yOffset: 9,
  },
  {
    title: 'Band 1 - Blue',
    color: '#0084B8',
    xMin: 450, 
    xMax: 520,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "1",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    title: 'Band 2 - Green',
    color: '#418652',
    xMin: 520, 
    xMax: 600,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "2",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    title: 'Band 3 - Red',
    color: '#DD2C44',
    xMin: 630, 
    xMax: 690,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "3",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    title: 'Band 4 - Near Infrared (NIR)',
    color: '#9D6289',
    xMin: 770, 
    xMax: 900,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "4",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 5,
  },  
  {
    title: 'Band 5 - Shortwave Infrared (SWIR) 1',
    color: '#D76B23',
    xMin: 1550, 
    xMax: 1750,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "5",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 5,
  },  
  {
    title: 'Band 6 - Thermal',
    color: '#AD5C64',
    xMin: 10400, 
    xMax: 12500,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "6",
    sublabelSize: 9, 
    subLabelText: '60m',
    graphNumb: 2,
    yOffset: 5,
  },  
  {
    title: 'Band 7 - Shortwave Infrared (SWIR) 2',
    color: '#7B8179',
    xMin: 2090, 
    xMax: 2350,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "7",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    title: 'Band 8 - Panchromatic',
    color: '#7B8179',
    xMin: 520, 
    xMax: 900,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "8",
    sublabelSize: 9, 
    subLabelText: '15m',
    graphNumb: 1,
    yOffset: 0,
  },  
];
var Landsat8_9_values = [
  //** TITLE */
  {
    title: "Title",
    color: '#d1d1d1',
    xMin: 430, 
    xMax: 2290,
    xMin_2: 430, 
    xMax_2: 2290,
    yHeight: boxHeight,
    labelSize: 50,
    labelText: "",
    sublabelSize: 15, 
    subLabelText: 'Landsat 8-9 (OLI & TIRS)',
    graphNumb: 1,
    yOffset: 14,
  },
  
  //** Band 1 - Coastal aerosol	*/
  {
    title: "Band 1 - Coastal aerosol",
    color: '#4884AD',
    xMin: 430, 
    xMax: 450,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "1",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 10,
    link: "https://landsat.gsfc.nasa.gov/satellites/",
  },
  //** Band 2 - Blue */
  {
    title: "Band 2 - Blue",
    color: '#0084B8',
    xMin: 450, 
    xMax: 510,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "2",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 5,
  },
  //** Band 3 - Green */
  {
    title: "Band 3 - Green",
    color: '#418652',
    xMin: 530, 
    xMax: 590,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "3",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 5,
  },
  //** Band 4 - Red */
  {
    title: "Band 4 - Red",
    color: '#DD2C44',
    xMin: 640, 
    xMax: 670,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "4",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 5,
  },
  //** Band 5 - Near Infrared (NIR) */
  {
    title: "Band 5 - Near Infrared (NIR)",
    color: '#9D6289',
    xMin: 850, 
    xMax: 880,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "5",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 5,
  },
  //** Band 6 - Shortwave Infrared (SWIR) 1	 */
  {
    title: "Band 6 - Shortwave Infrared (SWIR) 1",
    color: '#D76B23',
    xMin: 1570, 
    xMax: 1650,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "6",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 5,
  },
  //** Band 7 - Shortwave Infrared (SWIR) 2 */
  {
    title: "Band 7 - Shortwave Infrared (SWIR) 2",
    color: '#7B8179',
    xMin: 2110, 
    xMax: 2290,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "7",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 5,
  },
  //** Band 8 - Panchromatic */
  {
    title: "Band 8 - Panchromatic",
    color: '#008799',
    xMin: 500, 
    xMax: 680,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "8",
    sublabelSize: 9, 
    subLabelText: '15m',
    graphNumb: 1,
    yOffset: 0,
  },
  //** Band 9 - Cirrus */
  {
    title: "Band 9 - Cirrus",
    color: '#657795',
    xMin: 1360, 
    xMax: 1380,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "9",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 10,
  },
  //** Band 10 - Thermal Infrared (TIR) 1 */
  {
    title: "Band 10 - Thermal Infrared (TIR) 1",
    color: '#AD5C64',
    xMin: 10600, 
    xMax: 11190,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "10",
    sublabelSize: 9, 
    subLabelText: '100m',
    graphNumb: 2,
    yOffset: 5,
  },
  //** Band 11 - Thermal Infrared (TIR) 2 */
  {
    title: "Band 11 - Thermal Infrared (TIR) 2",
    color: '#AD5C64',
    xMin: 11500, 
    xMax: 12510,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "11",
    sublabelSize: 9, 
    subLabelText: '100m',
    graphNumb: 2,
    yOffset: 5,
  },
];
var LandsatNext_values = [
  //** TITLE */
  {
    title: "Title",
    color: '#d1d1d1',
    xMin: 400, 
    xMax: 2290,
    xMin_2: 430, 
    xMax_2: 2290,
    yHeight: boxHeight,
    labelSize: 50,
    labelText: "",
    sublabelSize: 15, 
    subLabelText: 'Landsat Next',
    graphNumb: 1,
    yOffset: 9,
  },
  
  //** Band 1 - Violet	*/
  {
    color: '#4884AD',
    xMin: 402, 
    xMax: 422,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "1",
    sublabelSize: 9, 
    subLabelText: '60m',
    graphNumb: 1,
    yOffset: 0,
    link: "https://landsat.gsfc.nasa.gov/satellites/",
  },
  //** Band 2 - Coastal/Aerosol		*/
  {
    color: '#4884AD',
    xMin: 433, 
    xMax: 453,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "2",
    sublabelSize: 9, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 5,
  },
  //** Band 3 - Blue 	*/
  {
    color: '#0084B8',
    xMin: 457.5, 
    xMax: 522.5,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "3",
    sublabelSize: 9, 
    subLabelText: '10m',
    graphNumb: 1,
    yOffset: 0,
  },
  //** Band 4 - Green 	*/
  {
    color: '#418652',
    xMin: 542.5, 
    xMax: 577.5,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "4",
    sublabelSize: 9, 
    subLabelText: '10m',
    graphNumb: 1,
    yOffset: 0,
  },  
  //** Band 5 - Yellow 	*/
  {
    color: '#cac53f',
    xMin: 585, 
    xMax: 615,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "5",
    sublabelSize: 9, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 0,
  },  
  //** Band 6 - Orange	*/
  {
    color: '#caa553',
    xMin: 610, 
    xMax: 630,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "6",
    sublabelSize: 9, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 5,
  },  
  //** Band 7 - Red 1	 */
  {
    color: '#DD2C44',
    xMin: 640, 
    xMax: 660,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "7",
    sublabelSize: 9, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 0,
  },  
  //** Band 8 - Red 2  */
  {
    color: '#DD2C44',
    xMin: 650, 
    xMax: 680,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "8",
    sublabelSize: 9, 
    subLabelText: '10m',
    graphNumb: 1,
    yOffset: 5,
  },  
  //** Band 9 - Red Edge 1  */
  {
    color: '#EA0652',
    xMin: 697.5, 
    xMax: 712.5,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "9",
    sublabelSize: 9, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 0,
  },
  //** Band 10 - Red Edge 2  */
  {
    color: '#EA0652',
    xMin: 732.5, 
    xMax: 747.5,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "10",
    sublabelSize: 9, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 5,
  },
  //** Band 11 - NIR Broad  */
  {
    color: '#9D6289',
    xMin: 784.5, 
    xMax: 899.5,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "11",
    sublabelSize: 9, 
    subLabelText: '10m',
    graphNumb: 1,
    yOffset: 0,
  },
  //** Band 12 - NIR 1  */
  {
    color: '#9D6289',
    xMin: 855, 
    xMax: 875,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "12",
    sublabelSize: 9, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 5,
  },
  //** Band 13 - Water Vapor  */
  {
    color: '#9D5EC5',
    xMin: 935, 
    xMax: 955,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "13",
    sublabelSize: 9, 
    subLabelText: '60m',
    graphNumb: 1,
    yOffset: 5,
  },
  //** Band 14 - Liquid Water  */
  {
    color: '#b5b0c4',
    xMin: 975, 
    xMax: 995,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "14",
    sublabelSize: 9, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 0,
  },
  //** Band 15 - Snow/Ice 1  */
  {
    color: '#b5b0c4',
    xMin: 1025, 
    xMax: 1045,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "15",
    sublabelSize: 9, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 5,
  },
  //** Band 16 - Snow/Ice 2  */
  {
    color: '#b5b0c4',
    xMin: 1080, 
    xMax: 1100,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "16",
    sublabelSize: 9, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 0,
  },
  //** Band 17 - Cirrus  */
  {
    color: '#657795',
    xMin: 1360, 
    xMax: 1390,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "17",
    sublabelSize: 9, 
    subLabelText: '60m',
    graphNumb: 1,
    yOffset: 0,
  },
  //** Band 18 - SWIR 1  */
  {
    color: '#D76B23',
    xMin: 1565, 
    xMax: 1655,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "18",
    sublabelSize: 9, 
    subLabelText: '10m',
    graphNumb: 1,
    yOffset: 0,
  },
  //** Band 19 - SWIR 2a  */
  {
    color: '#c88647',
    xMin: 2025.5, 
    xMax: 2050.5,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "19",
    sublabelSize: 9, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 0,
  },
  //** Band 20 - SWIR 2b  */
  {
    color: '#c88647',
    xMin: 2088, 
    xMax: 2128,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "20",
    sublabelSize: 9, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 5,
  },
  //** Band 21 - SWIR 2c  */
  {
    color: '#7B8179',
    xMin: 2191, 
    xMax: 2231,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "21",
    sublabelSize: 9, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 0,
  },
  //** Band 22 - TIR 1  */
  {
    color: '#b79498',
    xMin: 8050, 
    xMax: 8425,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "22",
    sublabelSize: 9, 
    subLabelText: '60m',
    graphNumb: 2,
    yOffset: 0,
  },
  //** Band 23 - TIR 2  */
  {
    color: '#b79498',
    xMin: 8425, 
    xMax: 8775,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "23",
    sublabelSize: 9, 
    subLabelText: '60m',
    graphNumb: 2,
    yOffset: 0,
  },
  //** Band 24 - TIR 2  */
  {
    color: '#b79498',
    xMin: 8925, 
    xMax: 9275,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "24",
    sublabelSize: 9, 
    subLabelText: '60m',
    graphNumb: 2,
    yOffset: 0,
  },
  //** Band 25 - TIR 4  */
  {
    color: '#AD5C64',
    xMin: 11025, 
    xMax: 11575,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "25",
    sublabelSize: 9, 
    subLabelText: '60m',
    graphNumb: 2,
    yOffset: 0,
  },
  //** Band 26 - TIR 5  */
  {
    color: '#AD5C64',
    xMin: 11775, 
    xMax: 12225,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "26",
    sublabelSize: 9, 
    subLabelText: '60m',
    graphNumb: 2,
    yOffset: 0,
  },
];
var Sentinel2_values = [
  //** TITLE */
  {
    title: "Title",
    color: '#d1d1d1',
    xMin: 430, 
    xMax: 2290,
    xMin_2: 430, 
    xMax_2: 2290,
    yHeight: boxHeight,
    labelSize: 50,
    labelText: "",
    sublabelSize: 15, 
    subLabelText: 'Sentinel-2 (MSI)',
    graphNumb: 1,
    yOffset: 14,
  },
  //** B1 - CA */
  {
    title: "B1 - CA",
    color: '#4884AD',
    xMin: 433, 
    xMax: 453,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "1",
    sublabelSize: 9, 
    subLabelText: '60m',
    graphNumb: 1,
    yOffset: 10,
  },
  //** B2 - Blue */
  {
    title: "B2 - Blue",
    color: '#0084B8',
    xMin: 457.5, 
    xMax: 522.5,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "2",
    sublabelSize: 9, 
    subLabelText: '10m',
    graphNumb: 1,
    yOffset: 0,
  },
  //** B3 - Green */
  {
    title: "B3 - Green",
    color: '#418652',
    xMin: 542, 
    xMax: 577.5,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "3",
    sublabelSize: 9, 
    subLabelText: '10m',
    graphNumb: 1,
    yOffset: 0,
  },
  //** B4 - Red */
  {
    title: "B4 - Red",
    color: '#DD2C44',
    xMin: 649.5, 
    xMax: 680.5,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "4",
    sublabelSize: 9, 
    subLabelText: '10m',
    graphNumb: 1,
    yOffset: 0,
  }, 
  //** B5 - Red Edge */
  {
    title: "B5 - Red Edge",
    color: '#EA0652',
    xMin: 697.5, 
    xMax: 712.5,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "5",
    sublabelSize: 9, 
    subLabelText: '10m',
    graphNumb: 1,
    yOffset: 5,
  },  
  //** B6 - NIR-1 */
  {
    title: "B6 - NIR-1",
    color: '#EA0652',
    xMin: 732.5, 
    xMax: 747.5,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "6",
    sublabelSize: 9, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 10,
  },  
  //** B7 - NIR-2 */
  {
    title: "B7 - NIR-2",
    color: '#9D6289',
    xMin: 773, 
    xMax: 793,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "7",
    sublabelSize: 9, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 5,
  }, 
  //** B8 - NIR-3	 */
  {
    title: "B8 - NIR-3",
    color: '#9D6289',
    xMin: 784.5, 
    xMax: 899.5,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "8",
    sublabelSize: 9, 
    subLabelText: '10m',
    graphNumb: 1,
    yOffset: 0,
  }, 
  //** B8a - Water Vapor-1	 */
  {
    title: "B8a - Water Vapor-1",
    color: '#9D6289',
    xMin: 855, 
    xMax: 875,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "8a",
    sublabelSize: 9, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 10,
  }, 
  //** B9 - Water Vapor-2 */
  {
    title: "B9 - Water Vapor-2",
    color: '#9D5EC5',
    xMin: 935, 
    xMax: 945,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "9",
    sublabelSize: 9, 
    subLabelText: '60m',
    graphNumb: 1,
    yOffset: 5,
  }, 
  //** B10 - Cirrus */
  {
    title: "B10 - Cirrus",
    color: '#657795',
    xMin: 1365, 
    xMax: 1395,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "10",
    sublabelSize: 9, 
    subLabelText: '60m',
    graphNumb: 1,
    yOffset: 10,
  }, 
  //** B11 - SWIR1 */
  {
    title: "B11 - SWIR1",
    color: '#D76B23',
    xMin: 1565, 
    xMax: 1655,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "11",
    sublabelSize: 9, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 5,
  },
  //** B12 - SWIR2 */
  {
    title: "B12 - SWIR2",
    color: '#c88647',
    xMin: 2100, 
    xMax: 2280,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "12",
    sublabelSize: 9, 
    subLabelText: '20m',
    graphNumb: 1,
    yOffset: 5,
  },
];
var Sentinel3_values = [
  //** TITLE */
  {
    title: "Title",
    color: '#d1d1d1',
    xMin: 430, 
    xMax: 2290,
    xMin_2: 430, 
    xMax_2: 2290,
    yHeight: boxHeight,
    labelSize: 50,
    labelText: "",
    sublabelSize: 15, 
    subLabelText: 'Sentinel-3 (OLCI)',
    graphNumb: 1,
    yOffset: 10,
  },
  //** Oa01 - CA-1 */
  {
    title: "B1 - CA-1",
    color: '#4884AD',
    xMin: 395, 
    xMax: 405,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "1",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 5,
  },
  //** Oa02 - CA-2 */
  {
    title: "B2 - CA-2",
    color: '#4884AD',
    xMin: 407, 
    xMax: 417,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "2",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 5,
  },
  //** Oa03 - CA-3 */
  {
    title: "B3 - CA-3",
    color: '#4884AD',
    xMin: 438, 
    xMax: 448,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "3",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 5,
  },
  //** Oa04 - Blue-1 */
  {
    title: "B4 - Blue-1",
    color: '#0084B8',
    xMin: 485, 
    xMax: 495,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "4",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 5,
  },  
  //** Oa05 - Blue-2 */
  {
    title: "B5 - Blue-2",
    color: '#0084B8',
    xMin: 505, 
    xMax: 515,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "5",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 5,
  }, 
  //** Oa06 - Green */
  {
    title: "B6 - Green",
    color: '#418652',
    xMin: 555, 
    xMax: 565,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "6",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 5,
  }, 
  //** Oa07 - Red-1 */
  {
    title: "B7 - Red-1",
    color: '#caa553',
    xMin: 615, 
    xMax: 625,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "7",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** Oa08 - Red-2 */
    title: "B8 - Red-2",
    color: '#DD2C44',
    xMin: 660, 
    xMax: 670,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "8",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** Oa09 - Red-3 */
    title: "B9 - Red-3",
    color: '#DD2C44',
    xMin: 670, 
    xMax: 677,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "9",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 10,
  },
  {
    //** Oa10 - Red-4 */
    title: "B10 - Red-4",
    color: '#DD2C44',
    xMin: 677, 
    xMax: 685,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "10",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Oa11 - NIR-1 */
    title: "B11 - NIR-1",
    color: '#DD2C44',
    xMin: 703, 
    xMax: 713,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "11",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** Oa12 - NIR-2 */
    title: "B12 - NIR-2",
    color: '#EA0652',
    xMin: 750, 
    xMax: 757,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "12",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** Oa13 - NIR-3 */
    title: "B13 - NIR-3",
    color: '#EA0652',
    xMin: 760, 
    xMax: 762,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "13",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 10,
  },
  {
    //** Oa14 - NIR-4 */
    title: "B14 - NIR-4",
    color: '#EA0652',
    xMin: 762, 
    xMax: 766,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "14",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Oa15 - NIR-5 */
    title: "B15 - NIR-5",
    color: '#EA0652',
    xMin: 766, 
    xMax: 769,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "15",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** Oa16 - NIR-6 */
    title: "B16 - NIR-6",
    color: '#9D6289',
    xMin: 771, 
    xMax: 786,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "16",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** Oa17 - NIR-7 */
    title: "B17 - NIR-7",
    color: '#9D6289',
    xMin: 855, 
    xMax: 875,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "17",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** Oa18 - NIR-8 */
    title: "B18 - NIR-8",
    color: '#9D6289',
    xMin: 880, 
    xMax: 890,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "18",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 10,
  },
  {
    //** Oa19 - NIR-9 */
    title: "B19 - NIR-9",
    color: '#9D6289',
    xMin: 895, 
    xMax: 905,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "19",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** Oa20 - NIR-10 */
    title: "B20 - NIR-10",
    color: '#9D5EC5',
    xMin: 930, 
    xMax: 950,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "20",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** Oa21 - NIR-11 */
    title: "B21 - NIR-11",
    color: '#b5b0c4',
    xMin: 1000, 
    xMax: 1040,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "21",
    sublabelSize: 0, 
    subLabelText: '300m',
    graphNumb: 1,
    yOffset: 5,
  },
];
var EO1_values = [
  //** TITLE */
  {
    title: "Title",
    color: '#d1d1d1',
    xMin: 430, 
    xMax: 2290,
    xMin_2: 430, 
    xMax_2: 2290,
    yHeight: boxHeight,
    labelSize: 50,
    labelText: "",
    sublabelSize: 15, 
    subLabelText: 'EO1 (ALI)',
    graphNumb: 1,
    yOffset: 12,
  },
  //** Band 1 CA */
  {
    title: "B1 - CA",
    color: '#4884AD',
    xMin: 433, 
    xMax: 453,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "1",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 5,
  },
  //** Band 2 Blue */
  {
    title: "B2 - Blue",
    color: '#0084B8',
    xMin: 450, 
    xMax: 515,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "2",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 10,
  },
  //** Band 3 - Green */
  {
    title: "B3 - Green",
    color: '#418652',
    xMin: 525, 
    xMax: 605,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "3",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 5,
  },
  //** Band 4 - Red */
  {
    title: "B4 - Red",
    color: '#DD2C44',
    xMin: 630, 
    xMax: 690,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "4",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 5,
  },
  //** Band 5 - NIR-1 */
  {
    title: "B5 - NIR-1",
    color: '#DD2C44',
    xMin: 775, 
    xMax: 805,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "5",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 5,
  },
  //** Band 6 - NIR-2 */
  {
    title: "B6 - NIR-2",
    color: '#9D6289',
    xMin: 845, 
    xMax: 890,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "6",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0,
  },
  //** Band 7 - NIR-3 */
  {
    title: "B7 - NIR-3",
    color: '#657795',
    xMin: 1200, 
    xMax: 1300,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "7",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 5,
  },
  //** Band 8 - SWIR1 */
  {
    title: "B8 - SWIR1",
    color: '#D76B23',
    xMin: 1550, 
    xMax: 1750,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "8",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 5,
  },
  //** Band 9 - SWIR2 */
  {
    title: "B9 - SWIR2",
    color: '#7B8179',
    xMin: 2080, 
    xMax: 2350,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "9",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** Band 10 - Panchromatic */
    title: "B10 - Panchromatic",
    color: '#418652',
    xMin: 480, 
    xMax: 690,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "10",
    sublabelSize: 9, 
    subLabelText: '10m',
    graphNumb: 1,
    yOffset: 0,
  },
];
var DESIS_values = [
  //** TITLE */
  {
    title: "Title",
    color: '#d1d1d1',
    xMin: 430, 
    xMax: 2290,
    xMin_2: 430, 
    xMax_2: 2290,
    yHeight: boxHeight,
    labelSize: 50,
    labelText: "",
    sublabelSize: 15, 
    subLabelText: 'DESIS',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    title: "402nm-1000nm",
    color: '#4884AD',
    xMin: 402, 
    xMax: 1000,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: 0,
  }, 
];
var ECOSTRESS_values = [
  //** TITLE */
  {
    title: "Title",
    color: '#d1d1d1',
    xMin: 430, 
    xMax: 2290,
    xMin_2: 430, 
    xMax_2: 2290,
    yHeight: boxHeight,
    labelSize: 50,
    labelText: "",
    sublabelSize: 15, 
    subLabelText: 'ECOSTRESS',
    graphNumb: 1,
    yOffset: 3,
  },
  //** B1 */
  {
    color: '#D76B23',
    xMin: 1475, 
    xMax: 1845,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "1",
    sublabelSize: 9, 
    subLabelText: '70m',
    graphNumb: 1,
    yOffset: 0,
  }, 
  //** B2 */
  {
    color: '#b79498',
    xMin: 8113, 
    xMax: 8467,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "2",
    sublabelSize: 9, 
    subLabelText: '70m',
    graphNumb: 2,
    yOffset: 0,
  }, 
  //** B3 */
  {
    color: '#b79498',
    xMin: 8625, 
    xMax: 8935,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "3",
    sublabelSize: 9, 
    subLabelText: '70m',
    graphNumb: 2,
    yOffset: 0,
  }, 
  //** B4 */
  {
    color: '#b79498',
    xMin: 9002, 
    xMax: 9398,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "4",
    sublabelSize: 9, 
    subLabelText: '70m',
    graphNumb: 2,
    yOffset: 0,
  }, 
  //** B5 */
  {
    color: '#AD5C64',
    xMin: 10285, 
    xMax: 10695,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "5",
    sublabelSize: 9, 
    subLabelText: '70m',
    graphNumb: 2,
    yOffset: 0,
  }, 
  //** B6 */
  {
    color: '#AD5C64',
    xMin: 11784.5, 
    xMax: 12395.5,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "6",
    sublabelSize: 9, 
    subLabelText: '70m',
    graphNumb: 2,
    yOffset: 0,
  }, 
];
var EMIT_values = [
  //** TITLE */
  {
    title: "Title",
    color: '#d1d1d1',
    xMin: 430, 
    xMax: 2290,
    xMin_2: 430, 
    xMax_2: 2290,
    yHeight: boxHeight,
    labelSize: 50,
    labelText: "",
    sublabelSize: 15, 
    subLabelText: 'EMIT',
    graphNumb: 1,
    yOffset: 3,
  },
  {
    title: "381nm-2493nm",
    color: '#D76B23',
    xMin: 381, 
    xMax: 2493,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: 0,
  }, 
];
var MODIS_values = [
  //** TITLE */
  {
    title: "Title",
    color: '#d1d1d1',
    xMin: 430, 
    xMax: 2290,
    xMin_2: 430, 
    xMax_2: 2290,
    yHeight: boxHeight,
    labelSize: 50,
    labelText: "",
    sublabelSize: 15, 
    subLabelText: 'Terra/Aqua (MODIS)',
    graphNumb: 1,
    yOffset: 10,
  },
  //** Band 1 - Shortwave/VIS	*/
  {
    title: "B1 - Shortwave/VIS",
    color: '#DD2C44',
    xMin: 620, 
    xMax: 670,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "1",
    sublabelSize: 0, 
    subLabelText: '21.2km',
    graphNumb: 1,
    yOffset: 10,
  },
  //** Band 2 - Shortwave/NIR	*/
  {
    title: "B2 - Shortwave/NIR",
    color: '#9D6289',
    xMin: 841, 
    xMax: 876,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "2",
    sublabelSize: 0, 
    subLabelText: '250m',
    graphNumb: 1,
    yOffset: 10,
  },
  {
    //** Band 3 - Shortwave/VIS	*/
    title: "B3 - Shortwave/VIS",
    color: '#1a7d9e',
    xMin: 459, 
    xMax: 479,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "3",
    sublabelSize: 0, 
    subLabelText: '500m',
    graphNumb: 1,
    yOffset: 10,
  },
  {
    //** Band 4 - Shortwave/VIS	*/
    title: "B4 - Shortwave/VIS",
    color: '#418652',
    xMin: 545, 
    xMax: 565,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "4",
    sublabelSize: 0, 
    subLabelText: '500m',
    graphNumb: 1,
    yOffset: 10,
  }, 
  {
    //** Band 5 - Shortwave/NIR	*/
    title: "B5 - Shortwave/NIR",
    color: '#657795',
    xMin: 1230, 
    xMax: 1250,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "5",
    sublabelSize: 0, 
    subLabelText: '500m',
    graphNumb: 1,
    yOffset: 5,
  }, 
  {
    //** Band 6 - Shortwave Infrared/SWIR	*/
    title: "B6 - Shortwave Infrared/SWIR",
    color: '#D76B23',
    xMin: 1628, 
    xMax: 1652,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "6",
    sublabelSize: 0, 
    subLabelText: '500m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** Band 7 - Shortwave Infrared/SWIR	*/
    title: "B7 - Shortwave Infrared/SWIR",
    color: '#c88647',
    xMin: 2105, 
    xMax: 2155,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "7",
    sublabelSize: 0, 
    subLabelText: '500m',
    graphNumb: 1,
    yOffset: 5,
  }, 
  {
    //** Band 8 - Shortwave/VIS	*/
    title: "B8 - Shortwave/VIS",
    color: '#4884AD',
    xMin: 405, 
    xMax: 420,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "8",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** Band 9 - Shortwave/VIS	*/
    title: "B9 - Shortwave/VIS",
    color: '#4884AD',
    xMin: 438, 
    xMax: 448,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "9",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 1,
    yOffset: 0,
  }, 
  {
    //** Band 10 - Shortwave/VIS	*/
    title: "B10 - Shortwave/VIS",
    color: '#1a7d9e',
    xMin: 483, 
    xMax: 493,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "10",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 1,
    yOffset: 5,
  }, 
  {
    //** Band 11 - Shortwave/VIS	*/
    title: "B11 - Shortwave/VIS",
    color: '#0084B8',
    xMin: 483, 
    xMax: 493,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "11",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 1,
    yOffset: 5,
  }, 
  {
    //** Band 12 - Shortwave/VIS	*/
    title: "B12 - Shortwave/VIS",
    color: '#418652',
    xMin: 546, 
    xMax: 556,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "12",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 1,
    yOffset: 0,
  }, 
  {
    //** Band 13 - Shortwave/VIS	*/
    title: "B13 - Shortwave/VIS",
    color: '#DD2C44',
    xMin: 662, 
    xMax: 672,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "13",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 1,
    yOffset: 5,
  }, 
  {
    //** Band 14 - Shortwave/VIS	*/
    title: "B14 - Shortwave/VIS",
    color: '#DD2C44',
    xMin: 673, 
    xMax: 683,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "14",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 1,
    yOffset: 0,
  }, 
  {
    //** Band 15 - Shortwave/VIS	*/
    title: "B15 - Shortwave/VIS",
    color: '#EA0652',
    xMin: 743, 
    xMax: 753,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "15",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 1,
    yOffset: 5,
  }, 
  {
    //** Band 16 - Shortwave/VIS	*/
    title: "B16 - Shortwave/VIS",
    color: '#9D6289',
    xMin: 862, 
    xMax: 877,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "16",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 1,
    yOffset: 5,
  }, 
  {
    //** Band 17 - Shortwave/VIS	*/
    title: "B17 - Shortwave/VIS",
    color: '#9D6289',
    xMin: 890, 
    xMax: 920,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "17",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 1,
    yOffset: 10,
  }, 
  {
    //** Band 18 - Shortwave/VIS	*/
    title: "B18 - Shortwave/VIS",
    color: '#9D5EC5',
    xMin: 931, 
    xMax: 941,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "18",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 1,
    yOffset: 5,
  }, 
  {
    //** Band 19 - Shortwave/VIS	*/
    title: "B19 - Shortwave/VIS",
    color: '#9D5EC5',
    xMin: 915, 
    xMax: 965,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "19",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 1,
    yOffset: 0,
  }, 
  {
    //** Band 20 - Longwave thermal Infrared/TIR	*/
    title: "B20 - Longwave thermal Infrared/TIR",
    color: '#b79498',
    xMin: 3660, 
    xMax: 3840,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "20",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 5,
  }, 
  {
    //** Band 21 - Longwave thermal Infrared/TIR	*/
    title: "B21 - Longwave thermal Infrared/TIR",
    color: '#b79498',
    xMin: 3929, 
    xMax: 3989,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "21",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 5,
  }, 
  {
    //** Band 22 - Longwave thermal Infrared/TIR	*/
    title: "B22 - Longwave thermal Infrared/TIR",
    color: '#b79498',
    xMin: 3929, 
    xMax: 3989,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "21",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 0,
  }, 
  {
    //** Band 23 - Longwave thermal Infrared/TIR	*/
    title: "B23 - Longwave thermal Infrared/TIR",
    color: '#b79498',
    xMin: 4020, 
    xMax: 4080,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "23",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 10,
  }, 
  {
    //** Band 24 - Longwave thermal Infrared/TIR	*/
    title: "B24 - Longwave thermal Infrared/TIR",
    color: '#b79498',
    xMin: 4433, 
    xMax: 4498,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "24",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 10,
  }, 
  {
    //** Band 25 - Longwave thermal Infrared/TIR	*/
    title: "B25 - Longwave thermal Infrared/TIR",
    color: '#b79498',
    xMin: 4482, 
    xMax: 4549,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "25",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 5,
  }, 
  {
    //** Band 26 - Longwave thermal Infrared/TIR	*/
    title: "B26 - Longwave thermal Infrared/TIR",
    color: '#657795',
    xMin: 1360, 
    xMax: 1390,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "26",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 1,
    yOffset: 5,
  }, 
  {
    //** Band 27 - Longwave thermal Infrared/TIR	*/
    title: "B27 - Longwave thermal Infrared/TIR",
    color: '#b79498',
    xMin: 6535, 
    xMax: 6895,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "27",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 5,
  }, 
  {
    //** Band 28 - Longwave thermal Infrared/TIR	*/
    title: "B28 - Longwave thermal Infrared/TIR",
    color: '#b79498',
    xMin: 7175, 
    xMax: 7475,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "28",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 5,
  }, 
  {
    //** Band 29 - Longwave thermal Infrared/TIR	*/
    title: "B29 - Longwave thermal Infrared/TIR",
    color: '#b79498',
    xMin: 8400, 
    xMax: 8700,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "29",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 5,
  }, 
  {
    //** Band 30 - Longwave thermal Infrared/TIR	*/
    title: "B30 - Longwave thermal Infrared/TIR",
    color: '#b79498',
    xMin: 9580, 
    xMax: 9880,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "30",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 5,
  }, 
  {
    //** Band 31 - Longwave thermal Infrared/TIR	*/
    title: "B31 - Longwave thermal Infrared/TIR",
    color: '#AD5C64',
    xMin: 10780, 
    xMax: 11280,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "31",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 5,
  }, 
  {
    //** Band 32 - Longwave thermal Infrared/TIR	*/
    title: "B32 - Longwave thermal Infrared/TIR",
    color: '#AD5C64',
    xMin: 11770, 
    xMax: 12270,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "32",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 5,
  }, 
  {
    //** Band 33 - Longwave thermal Infrared/TIR	*/
    title: "B33 - Longwave thermal Infrared/TIR",
    color: '#AD5C64',
    xMin: 13185, 
    xMax: 13485,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "33",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 5,
  }, 
  {
    //** Band 34 - Longwave thermal Infrared/TIR	*/
    title: "B34 - Longwave thermal Infrared/TIR",
    color: '#AD5C64',
    xMin: 13485, 
    xMax: 13785,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "34",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 5,
  }, 
  {
    //** Band 35 - Longwave thermal Infrared/TIR	*/
    title: "B35 - Longwave thermal Infrared/TIR",
    color: '#AD5C64',
    xMin: 13785, 
    xMax: 14085,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "35",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 5,
  }, 
  {
    //** Band 36 - Longwave thermal Infrared/TIR	*/
    title: "B36 - Longwave thermal Infrared/TIR",
    color: '#AD5C64',
    xMin: 14085, 
    xMax: 14385,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "36",
    sublabelSize: 0, 
    subLabelText: '1000m',
    graphNumb: 2,
    yOffset: 5,
  }, 
];
var PACE_values = [
  //** TITLE */
  {
    title: "Title",
    color: '#d1d1d1',
    xMin: 430, 
    xMax: 2290,
    xMin_2: 430, 
    xMax_2: 2290,
    yHeight: boxHeight,
    labelSize: 50,
    labelText: "",
    sublabelSize: 15, 
    subLabelText: 'PACE (OCI)',
    graphNumb: 1,
    yOffset: 13,
  },
  {
    //** Band 1 - Hyperspectral	*/
    color: '#caa553',
    xMin: 340, 
    xMax: 890,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "1",
    sublabelSize: 9, 
    subLabelText: '1.2km',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** Band 2 - NIR-1	*/
    color: '#9D6289',
    xMin: 900, 
    xMax: 980,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "2",
    sublabelSize: 9, 
    subLabelText: '1.2km',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** Band 3 - NIR-2	*/
    color: '#b5b0c4',
    xMin: 938, 
    xMax: 1138,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "3",
    sublabelSize: 9, 
    subLabelText: '1.2km',
    graphNumb: 1,
    yOffset: 10,
  },
  {
    //** Band 4 - NIR-3	*/
    color: '#657795',
    xMin: 1278, 
    xMax: 1478,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "4",
    sublabelSize: 9, 
    subLabelText: '1.2km',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** Band 5 - SWIR1-1	*/
    color: '#D76B23',
    xMin: 1515, 
    xMax: 1715,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "5",
    sublabelSize: 9, 
    subLabelText: '1.2km',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** Band 6 - SWIR2-1	*/
    color: '#c88647',
    xMin: 2030, 
    xMax: 2230,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "6",
    sublabelSize: 9, 
    subLabelText: '1.2km',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** Band 7 - SWIR2-2	*/
    color: '#7B8179',
    xMin: 2160, 
    xMax: 2360,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "7",
    sublabelSize: 9, 
    subLabelText: '1.2km',
    graphNumb: 1,
    yOffset: 0,
  },
];
var WorldView_1_values = [
  //** TITLE */
  {
    title: "Title",
    color: '#d1d1d1',
    xMin: 430, 
    xMax: 2290,
    xMin_2: 430, 
    xMax_2: 2290,
    yHeight: boxHeight,
    labelSize: 50,
    labelText: "",
    sublabelSize: 15, 
    subLabelText: 'Worldview-1',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 1 - Panchromatic	*/
    title: "Panchromatic",
    color: '#cac53f',
    xMin: 400, 
    xMax: 900,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '0.5m',
    graphNumb: 1,
    yOffset: 0,
  },
];
var WorldView_2_values = [
  //** TITLE */
  {
    title: "Title",
    color: '#d1d1d1',
    xMin: 430, 
    xMax: 2290,
    xMin_2: 430, 
    xMax_2: 2290,
    yHeight: boxHeight,
    labelSize: 50,
    labelText: "",
    sublabelSize: 15, 
    subLabelText: 'Worldview-2',
    graphNumb: 1,
    yOffset: 10,
  },
  {
    //** Panchromatic	*/
    title: "Panchromatic",
    color: '#cac53f',
    xMin: 450, 
    xMax: 800,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '0.46m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Multispectral - Coastal	*/
    title: "Multispectral - Coastal",
    color: '#4884AD',
    xMin: 400, 
    xMax: 450,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '1.85m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** Multispectral - Blue	*/
    title: "Multispectral - Blue",
    color: '#0084B8',
    xMin: 450, 
    xMax: 510,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '1.85m',
    graphNumb: 1,
    yOffset: 10,
  },
  {
    //** Multispectral - Green	*/
    title: "Multispectral - Green",
    color: '#418652',
    xMin: 510, 
    xMax: 580,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '1.85m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** Multispectral - Yellow	*/
    title: "Multispectral - Yellow",
    color: '#cac53f',
    xMin: 585, 
    xMax: 625,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '1.85m',
    graphNumb: 1,
    yOffset: 10,
  },
  {
    //** Multispectral - Red */
    title: "Multispectral - Red",
    color: '#DD2C44',
    xMin: 630, 
    xMax: 690,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '1.85m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** Multispectral - Red Edge */
    title: "Multispectral - Red Edge",
    color: '#EA0652',
    xMin: 705, 
    xMax: 745,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '1.85m',
    graphNumb: 1,
    yOffset: 10,
  },
  {
    //** Multispectral - Near-IR1 */
    title: "Multispectral - Near-IR1",
    color: '#9D6289',
    xMin: 770, 
    xMax: 895,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '1.85m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** Multispectral - Near-IR2 */
    title: "Multispectral - IR2",
    color: '#9D5EC5',
    xMin: 860, 
    xMax: 1040,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '1.85m',
    graphNumb: 1,
    yOffset: 0,
  },
];
var WorldView_3_values = [
  //** TITLE */
  {
    title: "Title",
    color: '#d1d1d1',
    xMin: 430, 
    xMax: 2290,
    xMin_2: 430, 
    xMax_2: 2290,
    yHeight: boxHeight,
    labelSize: 50,
    labelText: "",
    sublabelSize: 15, 
    subLabelText: 'Worldview-3',
    graphNumb: 1,
    yOffset: 15,
  },
  {
    //** Panchromatic	*/
    title: "Panchromatic",
    color: '#cac53f',
    xMin: 450, 
    xMax: 800,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '0.31m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Multispectral - Coastal	*/
    title: "Multispectral - Coastal",
    color: '#4884AD',
    xMin: 397, 
    xMax: 454,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '1.24m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** Multispectral - Blue	*/
    title: "Multispectral - Blue",
    color: '#0084B8',
    xMin: 445, 
    xMax: 517,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '1.24m',
    graphNumb: 1,
    yOffset: 10,
  },
  {
    //** Multispectral - Green */
    title: "Multispectral - Green",
    color: '#418652',
    xMin: 507, 
    xMax: 586,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '1.24m',
    graphNumb: 1,
    yOffset: 15,
  },
  {
    //** Multispectral - Yellow */
    title: "Multispectral - Yellow",
    color: '#cac53f',
    xMin: 580, 
    xMax: 629,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '1.24m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** Multispectral - Red */
    title: "Multispectral - Red",
    color: '#DD2C44',
    xMin: 626, 
    xMax: 696,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '1.24m',
    graphNumb: 1,
    yOffset: 10,
  },
  {
    //** Multispectral - Red Edge */
    title: "Multispectral - Red Edge",
    color: '#EA0652',
    xMin: 698, 
    xMax: 749,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '1.24m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** Multispectral - Near-IR1 */
    title: "Multispectral - Near-IR1",
    color: '#9D6289',
    xMin: 765, 
    xMax: 899,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '1.24m',
    graphNumb: 1,
    yOffset: 10,
  },
  {
    //** Multispectral - Near-IR2 */
    title: "Multispectral - Near-IR2",
    color: '#9D5EC5',
    xMin: 857, 
    xMax: 1039,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '1.24m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** SWIR - SWIR-1 */
    title: "SWIR - SWIR-1",
    color: '#b5b0c4',
    xMin: 1184, 
    xMax: 1235,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '3.70m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** SWIR - SWIR-2 */
    title: "SWIR - SWIR-2",
    color: '#D76B23',
    xMin: 1546, 
    xMax: 1598,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '3.70m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** SWIR - SWIR-3 */
    title: "SWIR - SWIR-3",
    color: '#D76B23',
    xMin: 1636, 
    xMax: 1686,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '3.70m',
    graphNumb: 1,
    yOffset: 10,
  },
  {
    //** SWIR - SWIR-4 */
    title: "SWIR - SWIR-4",
    color: '#D76B23',
    xMin: 1702, 
    xMax: 1759,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '3.70m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** SWIR - SWIR-5 */
    title: "SWIR - SWIR-5",
    color: '#c88647',
    xMin: 2137, 
    xMax: 2191,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '3.70m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** SWIR - SWIR-6 */
    title: "SWIR - SWIR-6",
    color: '#7B8179',
    xMin: 2174, 
    xMax: 2232,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '3.70m',
    graphNumb: 1,
    yOffset: 10,
  },
  {
    //** SWIR - SWIR-7 */
    title: "SWIR - SWIR-7",
    color: '#7B8179',
    xMin: 2228, 
    xMax: 2292,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '3.70m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** SWIR - SWIR-8 */
    title: "SWIR - SWIR-8",
    color: '#7B8179',
    xMin: 2285, 
    xMax: 2373,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '3.70m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** CAVIS - Desert Clouds */
    title: "CAVIS - Desert Clouds",
    color: '#4884AD',
    xMin: 405,
    xMax: 420,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 10,
  },
  {
    //** CAVIS - Aerosol-1 */
    title: "CAVIS - Aerosol-1",
    color: '#0084B8',
    xMin: 459, 
    xMax: 509,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** CAVIS - Green */
    title: "CAVIS - Green",
    color: '#418652',
    xMin: 525, 
    xMax: 585,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 10,
  },
  {
    //** CAVIS - Aerosol-2 */
    title: "CAVIS - Aerosol-2",
    color: '#DD2C44',
    xMin: 635, 
    xMax: 685,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 15,
  },
  {
    //** CAVIS - Water-1 */
    title: "CAVIS - Water-1",
    color: '#9D6289',
    xMin: 845, 
    xMax: 885,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 15,
  },
  {
    //** CAVIS - Water-2 */
    title: "CAVIS - Water-2",
    color: '#9D6289',
    xMin: 897, 
    xMax: 927,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** CAVIS - Water-3 */
    title: "CAVIS - Water-3",
    color: '#9D5EC5',
    xMin: 930, 
    xMax: 965,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 10,
  },
  {
    //** CAVIS - NDVI-SWIR */
    title: "CAVIS - NDVI-SWIR",
    color: '#b5b0c4',
    xMin: 1220, 
    xMax: 1252,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 10,
  },
  {
    //** CAVIS - Cirrus */
    title: "CAVIS - Cirrus",
    color: '#657795',
    xMin: 1365, 
    xMax: 1405,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** CAVIS - Snow */
    title: "CAVIS - Snow",
    color: '#D76B23',
    xMin: 1620, 
    xMax: 1680,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** CAVIS - Aerosol-3 */
    title: "CAVIS - Aerosol-3",
    color: '#c88647',
    xMin: 2105, 
    xMax: 2245,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '30m',
    graphNumb: 1,
    yOffset: 0,
  },
];
var WorldView_4_values = [
  //** TITLE */
  {
    title: "Title",
    color: '#d1d1d1',
    xMin: 430, 
    xMax: 2290,
    xMin_2: 430, 
    xMax_2: 2290,
    yHeight: boxHeight,
    labelSize: 50,
    labelText: "",
    sublabelSize: 15, 
    subLabelText: 'Worldview-4',
    graphNumb: 1,
    yOffset: 10,
  },
  {
    //** Panchromatic	*/
    title: "Panchromatic",
    color: '#008799',
    xMin: 450, 
    xMax: 800,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '0.31m',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Multispectral - Red */
    title: "Multispectral - Red",
    color: '#DD2C44',
    xMin: 655, 
    xMax: 690,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '1.24m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** Multispectral - Green */
    title: "Multispectral - Green",
    color: '#418652',
    xMin: 510, 
    xMax: 580,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '1.24m',
    graphNumb: 1,
    yOffset: 10,
  },
  {
    //** Multispectral - Blue */
    title: "Multispectral - Blue",
    color: '#0084B8',
    xMin: 450, 
    xMax: 510,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '1.24m',
    graphNumb: 1,
    yOffset: 5,
  },
  {
    //** Multispectral - Near-IR */
    title: "Multispectral - Near-IR",
    color: '#9D6289',
    xMin: 780, 
    xMax: 920,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "",
    sublabelSize: 9, 
    subLabelText: '1.24m',
    graphNumb: 1,
    yOffset: 5,
  },
];
var STELLA_values = [
  {
    title: "Title",
    color: '#d1d1d1',
    xMin: 14250, 
    xMax: 14750,
    yHeight: 10,
    labelSize: 250,
    labelText: "]",
    sublabelSize: 20, 
    subLabelText: 'STELLA',
    graphNumb: 2,
    yOffset: 0.0275,
  },
  {
    //** Band 1 - Violet	*/
    color: '#B930D5',
    xMin: 410, 
    xMax: 490,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "1",
    sublabelSize: 9, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: 0.05,
  },
  {
    //** Band 2 - Blue	*/
    color: '#0084B8',
    xMin: 460, 
    xMax: 540,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "2",
    sublabelSize: 9, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 3 - Green	*/
    color: '#418652',
    xMin: 510, 
    xMax: 590,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "3",
    sublabelSize: 9, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: -0.05,
  },
  {
    //** Band 4 - Yellow	*/
    color: '#caa553',
    xMin: 530, 
    xMax: 610,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "4",
    sublabelSize: 9, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: 0.05,
  },
  {
    //** Band 5 - Orange	*/
    color: '#d9964e',
    xMin: 560, 
    xMax: 640,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "5",
    sublabelSize: 9, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: 0.1,
  },
  {
    //** Band 6 - Red	*/
    color: '#c44354',
    xMin: 590, 
    xMax: 630,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "6",
    sublabelSize: 9, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 7 - Red 2	*/
    color: '#DD2C44',
    xMin: 610, 
    xMax: 690,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "7",
    sublabelSize: 9, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: -0.05,
  },
  {
    //** Band 8 - NIR*/
    color: '#b5b3b3',
    xMin: 660, 
    xMax: 700,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "8",
    sublabelSize: 9, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 9 - NIR*/
    color: '#b5b3b3',
    xMin: 710, 
    xMax: 750,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "9",
    sublabelSize: 9, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 10 - NIR*/
    color: '#b5b3b3',
    xMin: 740, 
    xMax: 780,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "10",
    sublabelSize: 9, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: -0.05,
  },
  {
    //** Band 11 - NIR*/
    color: '#b5b3b3',
    xMin: 790, 
    xMax: 830,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "11",
    sublabelSize: 9, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 12 - NIR*/
    color: '#b5b3b3',
    xMin: 840, 
    xMax: 880,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "12",
    sublabelSize: 9, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: 0,
  },
  {
    //** Band 13 - NIR*/
    color: '#b5b3b3',
    xMin: 5500, 
    xMax: 14000,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "13",
    sublabelSize: 13, 
    subLabelText: '',
    graphNumb: 2,
    yOffset: 0,
  },
];
var CUSTOM_values = [
  {
    //** Band 1 - Violet	*/
    color: '#d6d6d6',
    xMin: 500, 
    xMax: 700,
    yHeight: boxHeight,
    labelSize: 10,
    labelText: "1",
    sublabelSize: 9, 
    subLabelText: '',
    graphNumb: 1,
    yOffset: 0,
  },
];

//addPreset("Landsat 8-9", Landsat8_9_values);

//** CREATES HTML FOR PRESETS IN THE LAYERS TAB */
var enabledPresets = [];
function addPreset(title, preset)
{
  var count = 0;
  enabledPresets.forEach((v) => (v.includes(title) && count++));

  var title_text = title;
  let isCustomBand = false;
  
  //** CHECK IF THE BAND PRESET IS A CUSTOM BAND */
  if(title == "Custom")
  {
    isCustomBand = true;
  }
  if(count > 0)
  {
    title_text += "(" + count + ")";
  }
  title += count;
  enabledPresets.unshift(title);

  //** ADD PRESET TO INPUT */
  for(var i = 0; i < preset.length; i++)
  {
    //** Change Y offset depending how many layers there are */
    var offsetY = groupSeperation_Global.value * sensorNumb;
    
    var yStart = offsetY + 10 + parseFloat(preset[i].yOffset);
    var yEnd = yStart + preset[i].yHeight;

    //** TO PICK THE DISPLAY DEPENDING ON IF ITS A TITLE OR NOT */
    if(preset[i].title == "Title")
    {
      var title_var = "b" + (i+1) + title + "_Title";

      addBox(
        preset[i].xMin, preset[i].xMax, 
        yStart, yEnd, 
        preset[i].color, 
        preset[i].labelText, 
        preset[i].labelSize, 
        preset[i].subLabelText, 
        preset[i].sublabelSize, 
        preset[i].graphNumb, 
        title_var, false);
    }
    else
    {
      var title_var = "b" + (i+1) + title;

      addBox(
        preset[i].xMin, preset[i].xMax, 
        yStart, yEnd, 
        preset[i].color, 
        preset[i].labelText, 
        preset[i].labelSize, 
        preset[i].subLabelText, 
        preset[i].sublabelSize, 
        preset[i].graphNumb, 
        title_var, true);
    }

    chart.update();
    chart2.update();
  }

  //** UPDATE HOW MANY SENSORS ARE CURRENTLY VISIBLE */
  sensorNumb++;

  //var tree = document.createDocumentFragment();
  //** OUTSIDE NAV */
  var nav = document.createElement("nav");
  nav.classList = "nav";
  nav.role = "navigation";
  nav.setAttribute("name", title);
  
  //** OUTSIDE UL */
  var ul = document.createElement("ul");
  ul.classList = "nav__list";
  ul.setAttribute("name", title);
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
  // title_label.innerHTML = title_text;
  title_label.setAttribute("contentEditable", false);
  li.appendChild(title_label);

  title_label.addEventListener("click", function(){
    if(tutorial && tutorialIndex == 3)
    {
      progressTutorial(true);
    }
  }, false);

  //** 3 DOT DROPDOWN */
  // var threeDot_Dropdown = document.createElement("div")
  // threeDot_Dropdown.id = "dropdown_" + title;
  // threeDot_Dropdown.classList = "dropdown-content";
  
  // var threeDot_Btn_delete = document.createElement("a");
  // threeDot_Btn_delete.id = "dropdown_" + title;
  // threeDot_Btn_delete.innerHTML = "delete";

  // threeDot_Btn_delete.addEventListener('click', function() {
  //   nav.innerHTML = "";
  //   nav.remove();
  //   var index = enabledPresets.indexOf(this.title);
  //   enabledPresets.splice(index, 1);
  //   sensorNumb--;

  //   //** REMOVE BOX FROM GROUP */
  //   for(var i = boxAnnotations.length-1; i >=0; i--)
  //   {
  //     if(boxAnnotations[i].title.includes(this.title))
  //     {
  //       boxAnnotations.splice(i, 1);
  //     }
  //   }
  //   for(var x = boxAnnotations2.length-1; x >=0; x--)
  //   {
  //     if(boxAnnotations2[x].title.includes(this.title))
  //     {
  //       boxAnnotations2.splice(x, 1);
  //     }
  //   }

  //   correctGroupSeperation();

  //   chart.update();
  //   chart2.update();
  // }, false);
  
  // threeDot_Dropdown.appendChild(threeDot_Btn_delete);
  // nav.appendChild(threeDot_Dropdown);

  var threeDot_Dropdown = document.createElement("div");
  threeDot_Dropdown.classList = "dropdown";

  var threeDot_Button = document.createElement("button");
  threeDot_Button.id = "dropDownBtn";
  threeDot_Button.classList = "dropbtn";
  threeDot_Button.innerHTML = "&#10247";
  threeDot_Dropdown.appendChild(threeDot_Button);

  //** TITLE REMOVE ICON */
  // var title_label_removeIcon = document.createElement("i");
  // title_label_removeIcon.classList = "fa fa-ellipsis-v";
  // title_label_removeIcon.id = "removeIcon";
  // title_label_removeIcon.title = title;
  // title_label_removeIcon.setAttribute("contentEditable", false);
  // threeDot_Dropdown.appendChild(title_label_removeIcon);

  var threeDot_Dropdown_Container = document.createElement("div");
  threeDot_Dropdown_Container.id = "dropdown_" + title;
  threeDot_Dropdown_Container.classList = "dropdown-content";
  //threeDot_Dropdown.appendChild(threeDot_Dropdown_Container);
  ul.appendChild(threeDot_Dropdown_Container);
  //threeDot_Dropdown.insertBefore(threeDot_Dropdown_Container, threeDot_Dropdown.firstChild)

  threeDot_Button.addEventListener('click', function(event) {
    //var distance = document.getElementById("dropdown_" + title).offsetTop;
    console.log()
    document.getElementById("dropdown_" + title).style.top = event.clientY + "px";
    document.getElementById("dropdown_" + title).style.left = event.clientX + "px";

    // console.log('clientX:', event.clientX);
    // console.log('clientY:', event.clientY);
    // console.log('pageX:', event.pageX);
    // console.log('pageY:', event.pageY);
  }, false);

  var threeDot_Btn_delete = document.createElement("a");
  threeDot_Btn_delete.id = "dropdown_" + title;
  threeDot_Btn_delete.innerHTML = "delete";
  threeDot_Btn_delete.title = title;
  threeDot_Dropdown_Container.appendChild(threeDot_Btn_delete);

  threeDot_Btn_delete.addEventListener('click', function() {
    nav.innerHTML = "";
    nav.remove();
    var index = enabledPresets.indexOf(this.title);
    enabledPresets.splice(index, 1);
    sensorNumb--;

    //** REMOVE BOX FROM GROUP */
    for(var i = boxAnnotations.length-1; i >=0; i--)
    {
      if(boxAnnotations[i].title.includes(this.title))
      {
        boxAnnotations.splice(i, 1);
      }
    }
    for(var x = boxAnnotations2.length-1; x >=0; x--)
    {
      if(boxAnnotations2[x].title.includes(this.title))
      {
        boxAnnotations2.splice(x, 1);
      }
    }

    correctGroupSeperation();
    checkDropdowns();

    chart.update();
    chart2.update();
  }, false);

  var threeDot_Btn_moveUp = document.createElement("a");
  threeDot_Btn_moveUp.id = "dropdown_" + title;
  threeDot_Btn_moveUp.innerHTML = "move " + "&#8593";
  threeDot_Btn_moveUp.title = title;
  //threeDot_Btn_moveUp.classList.toggle("disabled");
  threeDot_Dropdown_Container.appendChild(threeDot_Btn_moveUp);

  //** EVENT LISTENER FOR MOVE UP BUTTON */
  threeDot_Btn_moveUp.addEventListener('click', function() {
    var index = enabledPresets.indexOf(this.title);
    
    //**REORDER ARRAY OF enabledPresets */
    reorderArray(enabledPresets, index, index-1)

    //** REORDER HTML */
    var navAmount = document.getElementById("layers").children.length;

    //** Move html element up in the order*/
    if(nav.previousElementSibling)
    {
      nav.parentNode.insertBefore(nav, nav.previousElementSibling);
    }

    correctGroupSeperation();
    checkDropdowns();

    chart.update();
    chart2.update();
  }, false);

  var threeDot_Btn_moveDown = document.createElement("a");
  threeDot_Btn_moveDown.id = "dropdown_" + title;
  threeDot_Btn_moveDown.innerHTML = "move " + "&#8595";
  threeDot_Btn_moveDown.title = title;
  //threeDot_Btn_moveDown.classList.toggle("disabled");
  threeDot_Dropdown_Container.appendChild(threeDot_Btn_moveDown);


  //** EVENT LISTENER FOR MOVE DOWN BUTTON */
  threeDot_Btn_moveDown.addEventListener('click', function() {
    var index = enabledPresets.indexOf(this.title);
    
    //**REORDER ARRAY OF enabledPresets */
    reorderArray(enabledPresets, index, index+1);

    //** Move html element down in the order*/
    if(nav.nextElementSibling)
    {
      nav.parentNode.insertBefore(nav.nextElementSibling, nav);
    }

    correctGroupSeperation();
    checkDropdowns();

    chart.update();
    chart2.update();
  }, false);
  
  title_label.appendChild(threeDot_Dropdown);

  //** ON CHANGE EVENT FOR REMOVE ICON */
  threeDot_Dropdown.addEventListener('click', function() {
    threeDot_Dropdown_Container.classList.toggle("show");
  }, false);

    //** TITLE REMOVE ICON */
    // var title_label_removeIcon = document.createElement("i");
    // title_label_removeIcon.classList = "fa fa-ellipsis-v";
    // title_label_removeIcon.id = "removeIcon";
    // title_label_removeIcon.title = title;
    // title_label_removeIcon.setAttribute("contentEditable", false);
    // title_label.appendChild(title_label_removeIcon);

    //** ON CHANGE EVENT FOR REMOVE ICON */
    // title_label_removeIcon.addEventListener('click', function() {
    //   document.getElementById("dropdown_" + this.title).classList.toggle("show");
    //   console.log(this.title);
    // }, false);
      
    var titleText = document.createElement("div");
    titleText.innerHTML = title_text;
    title_label.appendChild(titleText);

    //** TITLE LABEL SPAN */
    var title_label_span = document.createElement("span");
    title_label_span.innerHTML = "›";
    title_label_span.setAttribute("contentEditable", false);
    title_label.appendChild(title_label_span);

  //** GROUP LIST CONTAINER, CONTAINS ALL GROUP VALUES */
  var groupList = document.createElement("ul");
  groupList.classList = "group-list";
  li.appendChild(groupList);

  //** GLOBAL BAND CONTROLLER */

  //** GLOBAL BAND LIST CONTAINER */
  var band_global_li = document.createElement("li");
  band_global_li.id = "global_values";
  groupList.appendChild(band_global_li);

  //** GLOBAL BAND HIDDEN CHECKBOX */
  var band_checkbox = document.createElement("input");
  band_checkbox.id = "sub-group-global-values-" + title;
  band_checkbox.type = "checkbox";
  band_checkbox.hidden = true;
  band_global_li.appendChild(band_checkbox);

  //** GLOBAL BAND LABEL */
  var band_label = document.createElement("label");
  band_label.setAttribute("for", "sub-group-global-values-" + title);
  band_label.innerHTML = "Global style";
  band_label.setAttribute("contentEditable", false);
  band_label.id = "band_label_b" + (i+1) + title;
  band_global_li.appendChild(band_label);

  band_label.addEventListener("click", function()
  {
    if(tutorial && tutorialIndex == 4)
    {
      progressTutorial(true);
    }
  }, false);

    //** BAND LABEL SPAN */
    var band_label_span = document.createElement("span");
    band_label_span.innerHTML = "›";
    band_label_span.setAttribute("contentEditable", false);
    band_label.appendChild(band_label_span);

  //** GLOBAL BAND CONTENT CONTAINER */
  var band_content = document.createElement("ul");
  band_content.classList = "sub-group-list";
  band_global_li.appendChild(band_content);

    //** GLOBAL - INPUT - COLOR */
    var input_container_color = document.createElement('div');
    input_container_color.classList = "inputContainer";
    input_container_color.id = "color";
    band_content.appendChild(input_container_color);

      //** GLOBAL - INPUT - COLOR - TITLE */
      var input_container_color_title = document.createElement('div');
      input_container_color_title.innerHTML = "Global Color";
      input_container_color.appendChild(input_container_color_title);

      //** GLOBAL - INPUT - COLOR - INPUT */
      var input_container_color_input = document.createElement('input');
      input_container_color_input.id = "color_global_" + title;
      input_container_color_input.type = "color";
      input_container_color_input.value = "#ffffff";
      input_container_color.appendChild(input_container_color_input);
      
      //** ON CHANGE EVENT FOR GLOBAL COLOR PICKER */
      input_container_color_input.addEventListener('change', function() {
        
        var groupId = this.parentElement.parentElement.
          parentElement.parentElement.parentElement.children[0].id;

        //** LOOP THROUGH TO CHANGE ALL COLOR OF BANDS */
        for(var i = 0; i < groupList.children.length; i++)
        {
          //** MAKE SURE ITS NOT THE ADD BUTTON, OR GLOBAL VALUES TAB */
          if(!groupList.children[i].id.includes("add_") && !groupList.children[i].id.includes("global_values")
          && !groupList.children[i].children[2].children[0].children[1].id.includes("_Title"))
          {
            groupList.children[i].children[2].children[0].children[1].value = this.value;
            groupList.children[i].children[1].style.backgroundColor = this.value;
          }
        }

        //** LOOP THROUGH ANNOTATIONS TO CHANGE COLOR VALUES */
        for(var i = 0; i < boxAnnotations.length; i++)
        {
          if(boxAnnotations[i].title.includes(groupId) && !boxAnnotations[i].title.includes("_Title"))
          {
            if(boxAnnotations[i].title.includes("box"))
            {
              boxAnnotations[i].backgroundColor = this.value;
            }
          }
        }
        //** LOOP THROUGH ANNOTATIONS2 TO CHANGE COLOR VALUES */
        for(var i = 0; i < boxAnnotations2.length; i++)
        {
          if(boxAnnotations2[i].title.includes(groupId))
          {
            if(boxAnnotations2[i].title.includes("box"))
            {
              boxAnnotations2[i].backgroundColor = this.value;
            }
          }
        }

        chart.update();
        chart2.update();
      }, false);

    //** INPUT - boxHeight */
    var input_container_boxHeight = document.createElement('div');
    input_container_boxHeight.classList = "inputContainer";
    band_content.appendChild(input_container_boxHeight);
    input_container_boxHeight.id = title;

      //** INPUT - boxHeight - TITLE */
      var input_container_boxHeight_title = document.createElement('div');
      input_container_boxHeight_title.innerHTML = "boxHeight";
      input_container_boxHeight.appendChild(input_container_boxHeight_title);

      //** INPUT - boxHeight - INPUT */
      var input_container_boxHeight_input = document.createElement('input');
      input_container_boxHeight_input.type = "number";
      input_container_boxHeight_input.value = boxHeight;
      input_container_boxHeight_input.step = 1;
      input_container_boxHeight_input.min = 1;
      input_container_boxHeight.appendChild(input_container_boxHeight_input);

      //** ON CHANGE EVENT FOR boxHeight */
      input_container_boxHeight_input.addEventListener('change', function() {
        //** LOOP THROUGH TO TURN OFF ALL LABELS */
        
        var groupId = this.parentElement.id;
        

        for(var i = 0; i < boxAnnotations.length; i++)
        {
          if(boxAnnotations[i].title.includes(groupId))
          {
            if(boxAnnotations[i].title.includes("sublabel"))
            {
              //** TAKE THE Y VALUE OF THE BOX ITSELF */
              var yValue = parseFloat(boxAnnotations[i-2].yMin) + parseFloat(this.value) + 1;
              boxAnnotations[i].yMin = yValue;
              boxAnnotations[i].yMax = yValue;
            }
            //** IF IT IS A TITLE, BUT ALSO A BOX */
            else if(boxAnnotations[i].title.includes("box") && boxAnnotations[i].title.includes("Title"))
            {
              //** FIND THE NAME OF THE YOFFSET INPUT FOR THIS BAND */
              var yOffsetIdName = boxAnnotations[i].title.slice(0, (boxAnnotations[i].title.length - 15)) + "yOffset";
              var yOffset = document.getElementById(yOffsetIdName);
              var division = yOffset.value/(boxHeight + boxPadding);

              yOffset.value = division * (boxHeight + boxPadding);

              boxAnnotations[i].yMax = parseFloat(boxAnnotations[i].yMin) + parseFloat(this.value);
            }   
            //** FOR BOXES / LABELS */
            else if(boxAnnotations[i].title.includes("box"))
            {
              //** FIND THE NAME OF THE YOFFSET INPUT FOR THIS BAND */
              var yOffsetIdName = boxAnnotations[i].title.slice(0, (boxAnnotations[i].title.length - 3)) + "yOffset";
              var yOffset = document.getElementById(yOffsetIdName);
              var division = yOffset.value/(boxHeight + boxPadding);

              document.getElementById(yOffsetIdName).value = ((boxHeight + boxPadding) * division);

              boxAnnotations[i].yMax = parseFloat(boxAnnotations[i].yMin) + parseFloat(this.value);
            }
            else
            {
              boxAnnotations[i].yMax = parseFloat(boxAnnotations[i].yMin) + parseFloat(this.value);
            }  
          }
        }
        for(var i = 0; i < boxAnnotations2.length; i++)
        {
          if(boxAnnotations2[i].title.includes(groupId))
          {
            if(boxAnnotations2[i].title.includes("sublabel"))
            {
              var yValue = parseFloat(boxAnnotations2[i-2].yMin) + parseFloat(this.value) + 1;
              boxAnnotations2[i].yMin = yValue;
              boxAnnotations2[i].yMax = yValue;
            }
            else
            {
              boxAnnotations2[i].yMax = parseFloat(boxAnnotations2[i].yMin) + parseFloat(this.value);
            }
          }
        }

        correctGroupSeperation();
        chart.update();
        chart2.update();
      }, false);

    //** INPUT - labelVisibility */
    var input_container_labelVisibility = document.createElement('div');
    input_container_labelVisibility.classList = "inputContainer";
    input_container_labelVisibility.id = "label_visibility";
    band_content.appendChild(input_container_labelVisibility);

      //** INPUT - labelVisibility - TITLE */
      var input_container_labelVisibility_title = document.createElement('div');
      input_container_labelVisibility_title.innerHTML = "Labels";
      input_container_labelVisibility.appendChild(input_container_labelVisibility_title);

      //** INPUT - labelVisibility - INPUT */
      var input_container_labelVisibility_input = document.createElement('input');
      input_container_labelVisibility_input.type = "checkbox";
      input_container_labelVisibility_input.setAttribute("checked", true);
      input_container_labelVisibility.appendChild(input_container_labelVisibility_input);

      //** ON CHANGE EVENT FOR labelVisibility */
      input_container_labelVisibility_input.addEventListener('change', function() {
        var groupId = this.parentElement.parentElement.
          parentElement.parentElement.parentElement.children[0].id;
        
        //** LOOP THROUGH BOX ANNOTATIONS TO TURN OFF LABELS */
        for(var i = 0; i < boxAnnotations.length; i++)
        {
          if(boxAnnotations[i].title.includes(groupId) 
          && !boxAnnotations[i].title.includes("_Title")
          && !boxAnnotations[i].title.includes("_sublabel"))
          {
            if(boxAnnotations[i].type == "label")
            {
              if (this.checked)
              {
                boxAnnotations[i].display = true;
              }
              else
              {
                boxAnnotations[i].display = false;
              }
            }
          }
        }

        //** LOOP THROUGH BOX ANNOTATIONS 2 TO TURN OFF LABELS */
        for(var i = 0; i < boxAnnotations2.length; i++)
        {
          if(boxAnnotations2[i].title.includes(groupId) 
          && !boxAnnotations2[i].title.includes("_Title")
          && !boxAnnotations2[i].title.includes("_sublabel"))
          {
            if(boxAnnotations2[i].type == "label")
            {
              if (this.checked)
              {
                boxAnnotations[i].display = true;
              }
              else
              {
                boxAnnotations[i].display = false;
              }
            }
          }
        }

        console.log("LABELS: " + tutorialIndex);
        if(tutorial && tutorialIndex == 5)
        {
          progressTutorial(true);
        }
        
        chart.update();
        chart2.update();
      }, false);

    //** INPUT - LABEL SIZE */
    var input_container_labelSize = document.createElement('div');
    input_container_labelSize.classList = "inputContainer";
    input_container_labelSize.id = title;
    band_content.appendChild(input_container_labelSize);

      //** INPUT - LABEL SIZE - TITLE */
      var input_container_labelSize_title = document.createElement('div');
      input_container_labelSize_title.innerHTML = "Label size";
      input_container_labelSize.appendChild(input_container_labelSize_title);

      //** INPUT - LABEL SIZE - INPUT */
      var input_container_labelSize_input = document.createElement('input');
      input_container_labelSize_input.id = "b" + (i+1) + title + "color_input";
      input_container_labelSize_input.type = "number";
      input_container_labelSize_input.value = preset[1].labelSize;
      input_container_labelSize.appendChild(input_container_labelSize_input);

      //** ON CHANGE EVENT FOR LABEL SIZE */
      input_container_labelSize_input.addEventListener('change', function() {
        var groupId = this.parentElement.id;

        //** LOOP THROUGH ANNOTATIONS TO CHANGE COLOR VALUES */
        for(var i = 0; i < boxAnnotations.length; i++)
        {
          if(boxAnnotations[i].title.includes(groupId))
          {
            if(!boxAnnotations[i].title.includes("box") 
              && !boxAnnotations[i].title.includes("sublabel")
              && !boxAnnotations[i].title.includes("_title"))
            {
              boxAnnotations[i].font.size = this.value;
            }
          }
        }
        //** LOOP THROUGH ANNOTATIONS2 TO CHANGE COLOR VALUES */
        for(var i = 0; i < boxAnnotations2.length; i++)
        {
          if(boxAnnotations2[i].title.includes(groupId))
          {
            if(!boxAnnotations2[i].title.includes("box") 
              && !boxAnnotations2[i].title.includes("sublabel")
              && !boxAnnotations[i].title.includes("_title"))
            {
              boxAnnotations2[i].font.size = this.value;
            }
          }
        }
        chart.update();
        chart2.update();
      }, false);

    //** INPUT - sublabelVisibility */
    var input_container_sublabelVisibility = document.createElement('div');
    input_container_sublabelVisibility.classList = "inputContainer";
    input_container_sublabelVisibility.id = "sublabel_visibility";
    band_content.appendChild(input_container_sublabelVisibility);

      //** INPUT - sublabelVisibility - TITLE */
      var input_container_sublabelVisibility_title = document.createElement('div');
      input_container_sublabelVisibility_title.innerHTML = "SubLabels";
      input_container_sublabelVisibility.appendChild(input_container_sublabelVisibility_title);

      //** INPUT - sublabelVisibility - INPUT */
      var input_container_sublabelVisibility_input = document.createElement('input');
      input_container_sublabelVisibility_input.type = "checkbox";
      input_container_sublabelVisibility_input.setAttribute("checked", true);
      input_container_sublabelVisibility.appendChild(input_container_sublabelVisibility_input);

      //** ON CHANGE EVENT FOR sublabelVisibility */
      input_container_sublabelVisibility_input.addEventListener('change', function() {
        var groupId = this.parentElement.parentElement.
          parentElement.parentElement.parentElement.children[0].id;
        
        //** LOOP THROUGH TO TURN OFF ALL LABELS */
        // for(var i = 0; i < groupList.children.length; i++)
        // {
        //   //** MAKE SURE ITS NOT THE ADD BUTTON, OR GLOBAL VALUES TAB */
        //   if(!groupList.children[i].id.includes("add_") && !groupList.children[i].id.includes("global_values"))
        //   {
        //     //console.log(groupList.children[i].children[2].children[5]);
            
        //     //** CHECK IF THE LABEL IS CHECK THEN CHANGE TEXT SIZE */
        //     if (this.checked)
        //     {
        //       groupList.children[i].children[2].children[5].children[1].value = 15;
        //     }
        //     else
        //     {
        //       groupList.children[i].children[2].children[5].children[1].value = 0;
        //     }
        //   }
        // }

        //** LOOP THROUGH BOX ANNOTATIONS TO TURN OFF SUBLABELS */
        for(var i = 0; i < boxAnnotations.length; i++)
        {
          if(boxAnnotations[i].title.includes(groupId) 
          && !boxAnnotations[i].title.includes("_Title")
          && boxAnnotations[i].title.includes("_sublabel"))
          {
            if(boxAnnotations[i].type == "label")
            { 
              if (this.checked)
              {
                boxAnnotations[i].display = true;
              }
              else
              {
                boxAnnotations[i].display = false;
              }
            }
          }
        }

        //** LOOP THROUGH BOX ANNOTATIONS 2 TO TURN OFF SUBLABELS */
        for(var i = 0; i < boxAnnotations2.length; i++)
        {
          if(boxAnnotations2[i].title.includes(groupId) 
          && !boxAnnotations2[i].title.includes("_Title")
          && !boxAnnotations2[i].title.includes("_label"))
          {
            if(boxAnnotations2[i].type == "label")
            {
              if (this.checked)
              {
                boxAnnotations2[i].display = true;
              }
              else
              {
                boxAnnotations2[i].display = false;
              }
            }
          }
        }

        chart.update();
        chart2.update();
        //loopThroughLayers();
      }, false);

    //** INPUT - SUBLABEL SIZE */
    var input_container_subLabelSize = document.createElement('div');
    input_container_subLabelSize.classList = "inputContainer";
    input_container_subLabelSize.id = title;
    band_content.appendChild(input_container_subLabelSize);

      //** INPUT - SUBLABEL SIZE - TITLE */
      var input_container_subLabelSize_title = document.createElement('div');
      input_container_subLabelSize_title.innerHTML = "SubLabel Size";
      input_container_subLabelSize.appendChild(input_container_subLabelSize_title);

      //** INPUT - SUBLABEL SIZE - INPUT */
      var input_container_sublabel_input = document.createElement('input');
      input_container_sublabel_input.type = "number";
      input_container_sublabel_input.value = preset[1].sublabelSize;
      input_container_subLabelSize.appendChild(input_container_sublabel_input);

      //** ON CHANGE EVENT FOR SUBLABEL SIZE */
      input_container_sublabel_input.addEventListener('change', function() 
      {
        var groupId = this.parentElement.id;

        //** LOOP THROUGH ANNOTATIONS TO CHANGE COLOR VALUES */
        for(var i = 0; i < boxAnnotations.length; i++)
        {
          if(boxAnnotations[i].title.includes(groupId))
          {
            console.log(boxAnnotations[i]);
            if(boxAnnotations[i].title.includes("sublabel") && !boxAnnotations[i].title.includes("_Title"))
            {
              boxAnnotations[i].font.size = this.value;
            }
          }
        }
        //** LOOP THROUGH ANNOTATIONS2 TO CHANGE COLOR VALUES */
        for(var i = 0; i < boxAnnotations2.length; i++)
        {
          if(boxAnnotations2[i].title.includes(groupId))
          {
            if(boxAnnotations2[i].title.includes("sublabel") && !boxAnnotations2[i].title.includes("_Title"))
            {
              boxAnnotations2[i].font.size = this.value;
            }
          }
        }
        chart.update();
        chart2.update();
      }, false);

    //** TOGGLE OF AND ON TITLE */  
    //** INPUT - titleVisibility */
    var input_container_titleVisibility = document.createElement('div');
    input_container_titleVisibility.classList = "inputContainer";
    input_container_titleVisibility.id = title;
    band_content.appendChild(input_container_titleVisibility);

      //** INPUT - titleVisibility - TITLE */
      var input_container_titleVisibility_title = document.createElement('div');
      input_container_titleVisibility_title.innerHTML = "Title";
      input_container_titleVisibility.appendChild(input_container_titleVisibility_title);

      //** INPUT - titleVisibility - INPUT */
      var input_container_titleVisibility_input = document.createElement('input');
      input_container_titleVisibility_input.type = "checkbox";
      input_container_titleVisibility_input.setAttribute("checked", true);
      input_container_titleVisibility.appendChild(input_container_titleVisibility_input);

      //** ON CHANGE EVENT FOR titleVisibility */
      input_container_titleVisibility_input.addEventListener('change', function() {
        var groupId = this.parentElement.id;
        console.log(input_container_titleVisibility_input.checked);

        //** LOOP THROUGH ANNOTATIONS TO CHANGE COLOR VALUES */
        for(var i = 0; i < boxAnnotations.length; i++)
        {
          if(boxAnnotations[i].title.includes(groupId) 
            && boxAnnotations[i].title.includes("_Title") 
            && boxAnnotations[i].title.includes("_sublabel"))
          {
            console.log(boxAnnotations[i].title)
            if(this.checked)
            {
              boxAnnotations[i].display = true;
            }
            else
            {
              boxAnnotations[i].display = false;
            }
          }
        }
        //** LOOP THROUGH ANNOTATIONS2 TO CHANGE COLOR VALUES */
        for(var i = 0; i < boxAnnotations2.length; i++)
        {
          if(boxAnnotations2[i].title.includes(groupId) 
            && boxAnnotations2[i].title.includes("_Title")
            && boxAnnotations2[i].title.includes("_sublabel"))
          {
            if(this.checked)
            {
              boxAnnotations[i].display = false;
            }
            else
            {
              boxAnnotations[i].display = true;
            }
          }
        }
        correctGroupSeperation();

        chart.update();
        chart2.update();
      }, false);
  
  //** ADD SPECIFIC BANDS */
  for(var i = 0; i < preset.length; i++)
  {
    //** BAND LIST CONTAINER */
    var band_item_li = document.createElement("li");
    groupList.appendChild(band_item_li);

    //** BAND HIDDEN CHECKBOX */
    var band_checkbox = document.createElement("input");
    band_checkbox.id = "sub-group-b" + (i+1) + title;
    band_checkbox.type = "checkbox";
    band_checkbox.hidden = true;
    band_item_li.appendChild(band_checkbox);

    //** BAND LABEL */
    var band_label = document.createElement("label");
    band_label.setAttribute("for", "sub-group-b" + (i+1) + title);
    band_label.setAttribute("contentEditable", false);
    band_label.id = "band_label_b" + (i+1) + title;
    band_label.title = preset[i].xMin + "nm-" + preset[i].xMax + "nm";

    // //** IF THE PRESET IS A TILE THEN CHANGE IT's ID */
    if(preset[i].title)
    {
      band_label.innerHTML = preset[i].title;
      if(preset[i].title.includes("Title"))
      {
        band_label.id += "_Title";
        input_container_color_input.id += "_Title";
      }
    }
    else
    {
      band_label.innerHTML = "B" + (i+1);
    }

    band_item_li.appendChild(band_label);

      //** BAND LABEL SPAN */
      var band_label_span = document.createElement("span");
      band_label_span.innerHTML = "›";
      band_label_span.setAttribute("contentEditable", false);
      band_label.appendChild(band_label_span);

    //** BAND CONTENT CONTAINER */
    var band_content = document.createElement("ul");
    band_content.classList = "sub-group-list";
    band_item_li.appendChild(band_content);

      //** INPUT - COLOR */
      var input_container_color = document.createElement('div');
      input_container_color.classList = "inputContainer";
      input_container_color.id = "color";
      band_content.appendChild(input_container_color);

        //** INPUT - COLOR - TITLE */
        var input_container_color_title = document.createElement('div');
        input_container_color_title.innerHTML = "Color";
        input_container_color.appendChild(input_container_color_title);

        //** INPUT - COLOR - INPUT */
        var input_container_color_input = document.createElement('input');
        input_container_color_input.id = "b" + (i+1) + title;
        
        //** IF THE PRESET IS A TILE THEN CHANGE IT's ID */
        if(preset[i].title)
        {
          if(preset[i].title.includes("Title"))
          {
            input_container_color_input.id += "_Title";
          }
          else
          {
            input_container_color_input.id = "b" + (i+1) + title;
          }
        }

        input_container_color_input.type = "color";
        input_container_color_input.value = preset[i].color;
        band_label.style.backgroundColor = preset[i].color;
        input_container_color.appendChild(input_container_color_input);
        
        //** ON CHANGE EVENT FOR COLOR PICKER */
        input_container_color_input.addEventListener('change', function() {
          //var bandLabel = document.getElementById("band_label_b" + input_container_color_input.id);
          var id = "band_label_" + this.id;
          document.getElementById(id).style.backgroundColor = this.value;
          var groupId = this.id;

          //** LOOP THROUGH ANNOTATIONS TO CHANGE COLOR VALUES */
          for(var i = 0; i < boxAnnotations.length; i++)
          {
            if(boxAnnotations[i].title.includes(groupId))
            {
              if(boxAnnotations[i].title.includes("box"))
              {
                //boxAnnotations[i].backgroundColor = addAlpha(this.value, 0.5);
                boxAnnotations[i].backgroundColor = this.value;
              }
            }
          }
          //** LOOP THROUGH ANNOTATIONS2 TO CHANGE COLOR VALUES */
          for(var i = 0; i < boxAnnotations2.length; i++)
          {
            if(boxAnnotations2[i].title.includes(groupId))
            {
              if(boxAnnotations2[i].title.includes("box"))
              {
                //boxAnnotations2[i].backgroundColor = addAlpha(this.value, 0.5);
                boxAnnotations2[i].backgroundColor = this.value;
              }
            }
          }
          
          chart.update();
          chart2.update();
        }, false);

      //** IF IT IS A CUSTOM BAND, DON'T INCLUDE xMAX and xMIN */
      if(isCustomBand)
      {
        //** INPUT - xMin */
        var input_container_xMin = document.createElement('div');
        input_container_xMin.classList = "inputContainer";
        input_container_xMin.id = "xMin";
        band_content.appendChild(input_container_xMin);
  
          //** INPUT - xMin - TITLE */
          var input_container_xMin_title = document.createElement('div');
          input_container_xMin_title.innerHTML = "xMin";
          input_container_xMin.appendChild(input_container_xMin_title);
  
          //** INPUT - xMin - INPUT */
          var input_container_xMin_input = document.createElement('input');
          input_container_xMin_input.type = "number";
          input_container_xMin_input.value = preset[i].xMin;
          input_container_xMin_input.id = "b" + (i+1) + title;
          input_container_xMin.appendChild(input_container_xMin_input);
  
          //** ON CHANGE EVENT FOR XMIN */
          input_container_xMin_input.addEventListener('change', function() {
            var groupId = this.id;

            for(var i = 0; i < boxAnnotations.length; i++)
            {
              if(boxAnnotations[i].title.includes(groupId))
              {
                boxAnnotations[i].xMin = parseFloat(this.value);
              }
            }
            for(var x = 0; x < boxAnnotations2.length; x++)
            {
              if(boxAnnotations2[x].title.includes(groupId))
              {
                boxAnnotations2[x].xMin = this.value;
              }
            }

            updateGraphMinMax();

            chart.update();
            chart2.update();
          }, false);
  
        //** INPUT - xMax */
        var input_container_xMax = document.createElement('div');
        input_container_xMax.classList = "inputContainer";
        input_container_xMax.id = "xMax";
        band_content.appendChild(input_container_xMax);
  
          //** INPUT - xMax - TITLE */
          var input_container_xMax_title = document.createElement('div');
          input_container_xMax_title.innerHTML = "xMax";
          input_container_xMax.appendChild(input_container_xMax_title);
  
          //** INPUT - xMax - INPUT */
          var input_container_xMax_input = document.createElement('input');
          input_container_xMax_input.type = "number";
          input_container_xMax_input.value = preset[i].xMax;
          input_container_xMax_input.id = "b" + (i+1) + title;
          input_container_xMax.appendChild(input_container_xMax_input);
  
          //** ON CHANGE EVENT FOR xMax */
          input_container_xMax_input.addEventListener('change', function() {
            var groupId = this.id;

            for(var i = 0; i < boxAnnotations.length; i++)
            {
              if(boxAnnotations[i].title.includes(groupId))
              {
                boxAnnotations[i].xMax = parseFloat(this.value);
              }
            }
            for(var x = 0; x < boxAnnotations2.length; x++)
            {
              if(boxAnnotations2[x].title.includes(groupId))
              {
                boxAnnotations2[x].xMax = this.value;
              }
            }

            updateGraphMinMax();

            chart.update();
            chart2.update();
          }, false);
            
        //** INPUT - LABEL CONTENT */
        var input_container_labelContent = document.createElement('div');
        input_container_labelContent.classList = "inputContainer";
        input_container_labelContent.id = "label_content";
        band_content.appendChild(input_container_labelContent);
  
          //** INPUT - LABEL CONTENT - TITLE */
          var input_container_labelContent_title = document.createElement('div');
          input_container_labelContent_title.innerHTML = "Label Text";
          input_container_labelContent.appendChild(input_container_labelContent_title);
  
          //** INPUT - LABEL CONTENT - INPUT */
          var input_container_labelContent_input = document.createElement('input');
          input_container_labelContent_input.type = "text";
          input_container_labelContent_input.value = preset[i].labelText;
          input_container_labelContent_input.id = "b" + (i+1) + title;
          input_container_labelContent.appendChild(input_container_labelContent_input);
  
          //** ON CHANGE EVENT FOR LABEL CONTENT */
          input_container_labelContent_input.addEventListener('change', function() {
            var groupId = this.id;

            for(var i = 0; i < boxAnnotations.length; i++)
            {
              if(boxAnnotations[i].title.includes(groupId))
              {
                if(!boxAnnotations[i].title.includes("sublabel") && boxAnnotations[i].title.includes("label"))
                {
                  boxAnnotations[i].content[0] = this.value;
                }
              }
            }
            for(var x = 0; x < boxAnnotations2.length; x++)
            {
              if(boxAnnotations2[x].title.includes(groupId))
              {
                if(!boxAnnotations2[x].title.includes("sublabel") && boxAnnotations2[x].title.includes("label"))
                {
                  boxAnnotations2[x].content[0] = this.value;
                }
              }
            }

            chart.update()
            chart2.update();
          }, false);
          
        // //** INPUT - SUBLABEL OFFSET */
        // var input_container_subLabelOffset = document.createElement('div');
        // input_container_subLabelOffset.classList = "inputContainer";
        // input_container_subLabelOffset.id = "sublabel_offset";
        // band_content.appendChild(input_container_subLabelOffset);
  
        //   //** INPUT - SUBLABEL OFFSET - TITLE */
        //   var input_container_subLabelOffset_title = document.createElement('div');
        //   input_container_subLabelOffset_title.innerHTML = "SubLabel Offset";
        //   input_container_subLabelOffset.appendChild(input_container_subLabelOffset_title);
  
        //   //** INPUT - SUBLABEL OFFSET - INPUT */
        //   var input_container_sublabelOffset_input = document.createElement('input');
        //   input_container_sublabelOffset_input.type = "number";
        //   input_container_sublabelOffset_input.value = 0.1;
        //   input_container_subLabelOffset.appendChild(input_container_sublabelOffset_input);
  
        //   //** ON CHANGE EVENT FOR SUBLABEL OFFSET */
        //   input_container_sublabelOffset_input.addEventListener('change', function() {
        //     loopThroughLayers();
        //   }, false);
  
        //** INPUT - SUBLABEL CONTENT */
        var input_container_subLabelContent = document.createElement('div');
        input_container_subLabelContent.classList = "inputContainer";
        input_container_subLabelContent.id = "sublabel_content";
        band_content.appendChild(input_container_subLabelContent);
  
          //** INPUT - SUBLABEL Content - TITLE */
          var input_container_subLabelContent_title = document.createElement('div');
          input_container_subLabelContent_title.innerHTML = "SubLabel Text";
          input_container_subLabelContent.appendChild(input_container_subLabelContent_title);
  
          //** INPUT - SUBLABEL Content - INPUT */
          var input_container_sublabelContent_input = document.createElement('input');
          input_container_sublabelContent_input.type = "text";
          input_container_sublabelContent_input.value = preset[i].subLabelText;
          input_container_sublabelContent_input.id = "b" + (i+1) + title;
          input_container_subLabelContent.appendChild(input_container_sublabelContent_input);
  
          //** ON CHANGE EVENT FOR SUBLABEL CONTENT */
          input_container_sublabelContent_input.addEventListener('change', function() {
            console.log("CHANGE CUSTOM TEXT");
            var groupId = this.id;

            for(var i = 0; i < boxAnnotations.length; i++)
            {
              if(boxAnnotations[i].title.includes(groupId))
              {
                if(boxAnnotations[i].title.includes("sublabel"))
                {
                  boxAnnotations[i].content[0] = this.value;
                }
              }
            }
            for(var x = 0; x < boxAnnotations2.length; x++)
            {
              if(boxAnnotations2[x].title.includes(groupId))
              {
                if(boxAnnotations2[x].title.includes("sublabel"))
                {
                  boxAnnotations2[x].content[0] = this.value;
                }
              }
            }

            chart.update();
            chart2.update();
          }, false);
      }

      //** INPUT - GRAPH NUMB */
      var input_container_graphNumb = document.createElement('div');
      input_container_graphNumb.classList = "inputContainer";
      input_container_graphNumb.id = "graph_number";
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
        input_container_graphNumb_input.id = "b" + (i+1) + title;

        //** ON CHANGE EVENT FOR SUBLABEL CONTENT */
        input_container_graphNumb_input.addEventListener('change', function() {
          var groupId = this.id;
          var groupId_counter = 0;

          var box_1, label_1, sublabel_1;
          var box_2, label_2, sublabel_2;

          //** GO THROUGH BOX ANNOTATIONS BACKWARDS, SO THAT WHEN YOU SPLICE IT DOESNT SKIP OVER VALUES */
          for(var i = boxAnnotations.length-1; i >=0; i--)
          {
            
            if(boxAnnotations[i].title.includes(groupId) && groupId_counter < 3)
            {
              if(boxAnnotations[i].title.includes("box"))
              {
                box_1 = boxAnnotations[i];
              }
              else if(!boxAnnotations[i].title.includes("sublabel") && boxAnnotations[i].title.includes("label"))
              {
                label_1 = boxAnnotations[i];
              }
              else if(boxAnnotations[i].title.includes("sublabel"))
              {
                sublabel_1 = boxAnnotations[i];
              }

              boxAnnotations.splice(i, 1);
              groupId_counter++;
              //chart2.options.scales.x.min = 0;
            }
          }

          if(typeof box_1 !== "undefined" && typeof label_1 !== "undefined" && typeof sublabel_1 !== "undefined")
          {
            boxAnnotations2.push(box_1, label_1, sublabel_1);
          }

          for(var d = boxAnnotations2.length-1; d >=0; d--)
          {
            if(boxAnnotations2[d].title.includes(groupId) && groupId_counter < 3)
            {
              if(boxAnnotations2[d].title.includes("box"))
              {
                box_2 = boxAnnotations2[d];
              }
              else if(!boxAnnotations2[d].title.includes("sublabel") && boxAnnotations2[d].title.includes("label"))
              {
                label_2 = boxAnnotations2[d];
              }
              else if(boxAnnotations2[d].title.includes("sublabel"))
              {
                sublabel_2 = boxAnnotations2[d];
              }
              
              boxAnnotations2.splice(d, 1);
              groupId_counter++;
              chart2.options.scales.x.min = 0;
            }
            
            // if(boxAnnotations2[d].title.includes(groupId) && groupId_counter < 3)
            // {
            //   //** CORRECT FOR PUSHING ELEMENTS BACKWARDS */
            //   if(boxAnnotations2[d].title.includes("box"))
            //   {
            //     boxAnnotations.splice(boxAnnotations.length-2, 0, boxAnnotations2[d]);
            //   }
            //   else
            //   {
            //     boxAnnotations.push(boxAnnotations2[d]);
            //   }
              
            //   boxAnnotations2.splice(d, 1);
            //   groupId_counter++;

            //   chart2.options.scales.x.min = 0;
            // }
          }

          if(typeof box_2 !== "undefined" && typeof label_2 !== "undefined" && typeof sublabel_2 !== "undefined")
          {
            boxAnnotations.push(box_2, label_2, sublabel_2);
            console.log(boxAnnotations2);
          }
          
          setTimeout(() => {
            updateGraphMinMax();
          }, 250);
          chart.update();
          chart2.update();
        }, false);

      //** INPUT - yOffset */
      var input_container_yOffset = document.createElement('div');
      input_container_yOffset.classList = "inputContainer";
      input_container_yOffset.id = "yOffset";
      band_content.appendChild(input_container_yOffset);

        //** INPUT - yOffset - TITLE */
        var input_container_yOffset_title = document.createElement('div');
        input_container_yOffset_title.innerHTML = "yOffset";
        input_container_yOffset.appendChild(input_container_yOffset_title);

        //** INPUT - yOffset - INPUT */
        var input_container_yOffset_input = document.createElement('input');
        input_container_yOffset_input.type = "number";
        input_container_yOffset_input.value = preset[i].yOffset;
        input_container_yOffset_input.oldValue = preset[i].yOffset;
        input_container_yOffset_input.step = 1;
        input_container_yOffset_input.id = "b" + (i+1) + title + "_yOffset";
        input_container_yOffset_input.title = "b" + (i+1) + title;
        input_container_yOffset.appendChild(input_container_yOffset_input);

        //** ON CHANGE EVENT FOR yOffset */
        input_container_yOffset_input.addEventListener('change', function() {
          var groupId = this.title;

          for(var i=0; i < boxAnnotations.length; i++)
          {
            if(boxAnnotations[i].title.includes(groupId))
            {
              var xBaselineMin = parseFloat(boxAnnotations[i].yMin) - this.oldValue;
              var xBaselineMax = parseFloat(boxAnnotations[i].yMax) - this.oldValue;
              
              boxAnnotations[i].yMin = parseFloat(this.value) + xBaselineMin;
              boxAnnotations[i].yMax = parseFloat(this.value) + xBaselineMax;
            }
          }

          for(var x=0; x < boxAnnotations2.length; x++)
          {
            if(boxAnnotations2[x].title.includes(groupId))
            {
              var xBaselineMin = parseFloat(boxAnnotations2[x].yMin) - this.oldValue;
              var xBaselineMax = parseFloat(boxAnnotations2[x].yMax) - this.oldValue;
              
              boxAnnotations2[x].yMin = parseFloat(this.value) + xBaselineMin;
              boxAnnotations2[x].yMax = parseFloat(this.value) + xBaselineMax;
            }
          }

          correctGroupSeperation();
          chart.update();
          chart2.update();
          this.oldValue = this.value;
        }, false);
      
      if(preset[i].title == "Title")
      {
        //** INPUT - xMin */
        var input_container_xMin = document.createElement('div');
        input_container_xMin.classList = "inputContainer";
        input_container_xMin.id = "xMin";
        band_content.appendChild(input_container_xMin);
  
          //** INPUT - xMin - TITLE */
          var input_container_xMin_title = document.createElement('div');
          input_container_xMin_title.innerHTML = "xMin";
          input_container_xMin.appendChild(input_container_xMin_title);
  
          //** INPUT - xMin - INPUT */
          var input_container_xMin_input = document.createElement('input');
          input_container_xMin_input.type = "number";
          input_container_xMin_input.value = preset[i].xMin;
          input_container_xMin_input.step = 1;
          input_container_xMin_input.id = "b" + (i+1) + title + "_xMin";
          input_container_xMin_input.title = "b" + (i+1) + title;
          input_container_xMin.appendChild(input_container_xMin_input);
  
          //** ON CHANGE EVENT FOR xMin */
          input_container_xMin_input.addEventListener('change', function() {
            var groupId = this.title;
  
            for(var i=0; i < boxAnnotations.length; i++)
            {
              if(boxAnnotations[i].title.includes(groupId))
              {
                console.log(boxAnnotations[i]);
                boxAnnotations[i].xMin = parseFloat(this.value);
              }
            }
  
            for(var x=0; x < boxAnnotations2.length; x++)
            {
              if(boxAnnotations2[x].title.includes(groupId))
              {
                boxAnnotations2[i].xMin = parseFloat(this.value);
              }
            }
  
            correctGroupSeperation();
            chart.update();
            chart2.update();
            this.oldValue = this.value;
          }, false);
      }
  }

  //** FOR ADDING ADDITIONAL BANDS */

  if(isCustomBand)
  {
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

      console.log(groupList.childNodes[label_index-2].childNodes[2].childNodes[1].childNodes[1].value);
  
      var previousColor = groupList.childNodes[label_index-2].childNodes[2].childNodes[0].childNodes[1].value;
      var previousMin = groupList.childNodes[label_index-2].childNodes[2].childNodes[1].childNodes[1].value;
      var previousMax = groupList.childNodes[label_index-2].childNodes[2].childNodes[2].childNodes[1].value;
      var previous_labelSize = groupList.childNodes[0].childNodes[2].childNodes[3].childNodes[1].value;
      var previous_sublabelSize = groupList.childNodes[0].childNodes[2].childNodes[5].childNodes[1].value;
      var previous_graphNumb = groupList.childNodes[label_index-2].childNodes[2].childNodes[5].childNodes[1].value;
      var previous_Label_Text = groupList.childNodes[label_index-2].childNodes[2].childNodes[4].childNodes[1].value;
      var previous_subLabel_Text = groupList.childNodes[label_index-2].childNodes[2].childNodes[4].childNodes[1].value;
  
      //** BAND HIDDEN CHECKBOX */
      var band_checkbox = document.createElement("input");
      band_checkbox.id = "sub-group-b" + (label_index-1) + title;
      band_checkbox.type = "checkbox";
      band_checkbox.hidden = true;
      band_li.appendChild(band_checkbox);
  
      //** BAND LABEL */
      var band_label = document.createElement("label");
      band_label.setAttribute("for", "sub-group-b" + (label_index-1) + title);
      band_label.innerHTML = "B" + (label_index-1);
      band_label.id = "band_label_b" + (label_index-1) + title;
      band_label.setAttribute("contentEditable", false);
      band_li.appendChild(band_label);
      //band_label.title = preset[i].
      console.log(preset[i]);

      //** BAND LABEL SPAN */
      var band_label_span = document.createElement("span");
      band_label_span.innerHTML = "›";
      band_label.appendChild(band_label_span);
      
      //** TITLE REMOVE ICON */
      var additional_band_removeIcon = document.createElement("i");
      additional_band_removeIcon.classList = "fa fa-trash";
      additional_band_removeIcon.id = "removeIcon";
      additional_band_removeIcon.setAttribute("contentEditable", false);
      band_label.appendChild(additional_band_removeIcon);

      //** ON CHANGE EVENT FOR REMOVE ICON */
      additional_band_removeIcon.addEventListener('click', function() {
        var groupId = this.parentElement.id;

        //** REMOVE BAND FROM BOX ANNOTATIONS, LOOP THROUGH IN REVERSE*/
        for(var i = boxAnnotations.length-1; i >=0; i--)
        {
          if(boxAnnotations[i].title.includes(groupId))
          {
            console.log(boxAnnotations[i]);
            boxAnnotations.splice(i, 1);
          }
        }
        //** REMOVE BAND FROM BOX ANNOTATIONS 2, LOOP THROUGH IN REVERSE */
        for(var i = boxAnnotations2.length-1; i >=0; i--)
        {
          if(boxAnnotations2[i].title.includes(groupId))
          {
            boxAnnotations2.splice(i, 1);
          }
        }

        this.parentElement.parentElement.remove();
        this.parentElement.parentElement.innerHTML = "";

        chart.update();
        chart2.update();
        
      }, false);
  
      //** BAND CONTENT CONTAINER */
      var band_content = document.createElement("ul");
      band_content.classList = "sub-group-list";
      band_li.appendChild(band_content);
  
        //** INPUT - COLOR */
        var input_container_color = document.createElement('div');
        input_container_color.classList = "inputContainer";
        input_container_color.id = "color";
        band_content.appendChild(input_container_color);
  
          //** INPUT - COLOR - TITLE */
          var input_container_color_title = document.createElement('div');
          input_container_color_title.innerHTML = "Color";
          input_container_color.appendChild(input_container_color_title);
  
          //** INPUT - COLOR - INPUT */
          var input_container_color_input = document.createElement('input');
          input_container_color_input.id = "b" + (label_index-1) + title;
          input_container_color_input.type = "color";
          input_container_color_input.value = previousColor;
          band_label.style.backgroundColor = previousColor;
          input_container_color.appendChild(input_container_color_input);
          
          //** ON CHANGE EVENT FOR COLOR PICKER */
          input_container_color_input.addEventListener('change', function() {
            var id = "band_label_" + this.id;
            document.getElementById(id).style.backgroundColor = this.value;
            var groupId = this.id;
  
            //** LOOP THROUGH ANNOTATIONS TO CHANGE COLOR VALUES */
            for(var i = 0; i < boxAnnotations.length; i++)
            {
              if(boxAnnotations[i].title.includes(groupId) && !boxAnnotations[i].title.includes("_Title"))
              {
                if(boxAnnotations[i].title.includes("box"))
                {
                  boxAnnotations[i].backgroundColor = this.value;
                }
              }
            }
            //** LOOP THROUGH ANNOTATIONS2 TO CHANGE COLOR VALUES */
            for(var i = 0; i < boxAnnotations2.length; i++)
            {
              if(boxAnnotations2[i].title.includes(groupId) && !boxAnnotations[i].title.includes("_Title"))
              {
                if(boxAnnotations2[i].title.includes("box"))
                {
                  boxAnnotations2[i].backgroundColor = this.value;
                  console.log(boxAnnotations2[i]);
                  console.log(groupId);
                }
              }
            }
  
            chart.update();
            chart2.update();
          }, false);
  
        //** INPUT - xMin */
        var input_container_xMin = document.createElement('div');
        input_container_xMin.classList = "inputContainer";
        input_container_xMin.id = "xMin";
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
            //loopThroughLayers();
          }, false);
  
        //** INPUT - xMax */
        var input_container_xMax = document.createElement('div');
        input_container_xMax.classList = "inputContainer";
        input_container_xMax.id = "xMax";
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
            //loopThroughLayers();
          }, false);
  
        //** INPUT - LABEL SIZE */
        var input_container_labelSize = document.createElement('div');
        input_container_labelSize.classList = "inputContainer";
        input_container_labelSize.id = "label_Size";
        band_content.appendChild(input_container_labelSize);
  
          //** INPUT - LABEL SIZE - TITLE */
          var input_container_labelSize_title = document.createElement('div');
          input_container_labelSize_title.innerHTML = "Label size";
          input_container_labelSize.appendChild(input_container_labelSize_title);
  
          //** INPUT - LABEL SIZE - INPUT */
          var input_container_labelSize_input = document.createElement('input');
          input_container_labelSize_input.id = "b" + (label_index-1) + title + "color_input";
          input_container_labelSize_input.type = "number";
          input_container_labelSize_input.value = previous_labelSize;
          input_container_labelSize.appendChild(input_container_labelSize_input);
  
          //** ON CHANGE EVENT FOR LABEL SIZE */
          input_container_labelSize_input.addEventListener('change', function() {
            //loopThroughLayers();
            console.log("CHANGE LABEL SIZE");
          }, false);
  
        //** INPUT - LABEL CONTENT */
        var input_container_labelContent = document.createElement('div');
        input_container_labelContent.classList = "inputContainer";
        input_container_labelContent.id = "label_content";
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
            //loopThroughLayers();
          }, false);
  
        //** INPUT - SUBLABEL SIZE */
        var input_container_subLabelSize = document.createElement('div');
        input_container_subLabelSize.classList = "inputContainer";
        input_container_subLabelSize.id = "sublabel_size";
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
            //loopThroughLayers();
          }, false);
  
        //** INPUT - SUBLABEL OFFSET */
        var input_container_subLabelOffset = document.createElement('div');
        input_container_subLabelOffset.classList = "inputContainer";
        input_container_subLabelOffset.id = "sublabel_offset";
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
            //loopThroughLayers();
          }, false);
  
        //** INPUT - SUBLABEL CONTENT */
        var input_container_subLabelContent = document.createElement('div');
        input_container_subLabelContent.classList = "inputContainer";
        input_container_subLabelContent.id = "sublabel_content";
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
            //loopThroughLayers();
          }, false);
  
        //** INPUT - GRAPH NUMB */
        var input_container_graphNumb = document.createElement('div');
        input_container_graphNumb.classList = "inputContainer";
        input_container_graphNumb.id = "graph_number";
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
            //loopThroughLayers();
          }, false);
  
        //** INPUT - yOffset */
        var input_container_yOffset = document.createElement('div');
        input_container_yOffset.classList = "inputContainer";
        input_container_yOffset.id = "yOffset";
        band_content.appendChild(input_container_yOffset);
  
          //** INPUT - yOffset - TITLE */
          var input_container_yOffset_title = document.createElement('div');
          input_container_yOffset_title.innerHTML = "yOffset";
          input_container_yOffset.appendChild(input_container_yOffset_title);
  
          //** INPUT - yOffset - INPUT */
          var input_container_yOffset_input = document.createElement('input');
          input_container_yOffset_input.type = "number";
          input_container_yOffset_input.value = 0;
          input_container_yOffset_input.step = 10;
          input_container_yOffset.appendChild(input_container_yOffset_input);
  
          //** ON CHANGE EVENT FOR xMax */
          input_container_yOffset_input.addEventListener('change', function() {
            //loopThroughLayers();
          }, false);

          
          if(previous_graphNumb == 1)
          {
            for(var i = 0; i < boxAnnotations.length; i++)
            {
              if(boxAnnotations[i].title.includes(title))
              {
                if(boxAnnotations[i].title.includes("box"))
                {
                  addBox(previousMax, 
                    parseFloat(previousMax) + 100, 
                    boxAnnotations[i].yMin, 
                    boxAnnotations[i].yMax, 
                    boxAnnotations[i].backgroundColor, 
                    (label_index-1), 
                    previous_labelSize, 
                    "", 
                    previous_sublabelSize, 
                    previous_graphNumb, 
                    "");

                  console.log("ADD BOX");
                }
              }
            }
          }
          else if(previous_graphNumb == 2)
          {
            console.log("box2");
          }

          updateGraphMinMax();

          chart.update();
          chart2.update();
    })
  }

  setTimeout(() => {
    checkDropdowns();
    correctGroupSeperation();
  }, 10);
  updateGraphMinMax();
  layers.insertBefore(nav, layers.firstChild);
}

function addAlpha(color, opacity) {
  // coerce values so ti is between 0 and 1.
  var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase();
}

function reorderArray(array, from, to)
{
  // remove `from` item and store it
  var f = array.splice(from, 1)[0];
  // insert stored item into position `to`
  array.splice(to, 0, f);
}

function checkDropdowns()
{
  //** DROPDOWNS **//
  var dropdowns = layers.getElementsByClassName("dropdown-content");
  
  //** ENABLE ALL TOO START */
  for (var y = 0; y < dropdowns.length; y++) 
  {
    if(dropdowns[y].children[1].classList.contains("disabled"))
    {
      dropdowns[y].children[1].classList.toggle("disabled");
    }
    if(dropdowns[y].children[2].classList.contains("disabled"))
    {
      dropdowns[y].children[2].classList.toggle("disabled");
    }
  }
  //** DISABLED CORRECT DROPDOWN OPTIONS */
  for (var x = 0; x < dropdowns.length; x++) 
  {
    //** FOR THE TOP MOST LAYER's THREE DOT DROPDOWN */
    if(x == 0)
    {
      //** IF THERES ONLY ONE ELEMENT */
      if(dropdowns.length == 1)
      {
        dropdowns[x].children[1].classList.toggle("disabled");
        dropdowns[x].children[2].classList.toggle("disabled");
      }
      //** IF THERES MORE THAN ONE ELEMENT */
      else if(dropdowns.length > 1)
      {
        dropdowns[x].children[1].classList.toggle("disabled");
      }
    }
    else if(x == dropdowns.length-1)
    {
      dropdowns[x].children[2].classList.toggle("disabled");
    }
  }
}

//** READS BOX ANNOTATIONS AND CALCULATES THE LOWEST AND HIGHEST VALUES TO TRIM THE GRAPH TOO */
function updateGraphMinMax()
{
  var min1 = [], max1 = [], min2 = [], max2 = [];
  
  //** CYCLE THROUGH FIRST BOXANNOTATIONS AND PUSH VALUES TO MIN AND MAX ARRAYS */
  for(var i=0; i < boxAnnotations.length; i++)
  {
    if(!boxAnnotations[i].title.includes("box") || boxAnnotations[i].title.includes("label") || boxAnnotations[i].title.includes("sublabel"))
    {
      if(!boxAnnotations[i].title.includes("Title"))
      { 
        min1.push(boxAnnotations[i].xMin);
        max1.push(boxAnnotations[i].xMax);
      }
    }
  }

  //** CYCLE THROUGH SECOND BOXANNOTATIONS AND PUSH VALUES TO MIN AND MAX ARRAYS */
  for(var x=0; x < boxAnnotations2.length; x++)
  {
    if(!boxAnnotations2[x].title.includes("box") || boxAnnotations2[x].title.includes("label") || boxAnnotations2[x].title.includes("sublabel"))
    {
      if(!boxAnnotations2[x].title.includes("Title"))
      {
        min2.push(boxAnnotations2[x].xMin);
        max2.push(boxAnnotations2[x].xMax);
      }
    }
  }

  //** FIGURE OUT MIN & MAX */
  if(min1.length > 0 && min2.length > 0)
  {
      //** Update min and max values of charts manually *//
      updateMinAndMax(
      Math.min.apply(Math, min1), 
      Math.min.apply(Math, min2),
      Math.max.apply(Math, max1),
      Math.max.apply(Math, max2));
  }
  else if(min1.length > 0)
  {
    updateMinAndMax(
    Math.min.apply(Math, min1), 
    7050,
    Math.max.apply(Math, max1),
    13950);
  }
  else if(min2.length > 0)
  {
    updateMinAndMax(
    450, 
    Math.min.apply(Math, min2),
    2450,
    Math.max.apply(Math, max2));
  }
  else
  {
    updateMinAndMax(
    450, 
    7050,
    2450,
    13950);
  }
}

var sidebar_open = true;

function progressTutorial(forward) {
  //** FORWARD NAVIGATION */
  if (forward) {
    tutorialIndex++;
    tut_text.innerHTML = tutorialTextList[tutorialIndex];
  }
  //** BACKWARD NAVIGATION */
  else {
    tutorialIndex--;
    tut_text.innerHTML = tutorialTextList[tutorialIndex];
  }


  //** POSITIONING OF TUT_WRAP */
  if (tutorialIndex == 0) {
    //** Welcome to the <b>Spectral Band Comparison Tool!</b> This app helps you compare different Earth-observing satellites and the spectral bands they can detect. */
    tut_wrap.style.top = "35%";
    tut_wrap.style.left = "25%";
  } 
  else if (tutorialIndex == 1) 
  {
    //** To get started, select the <b>+</b> button to add an instrument. */
    var distance = document.getElementById("dropDownBtn_layers").offsetTop;
    tut_wrap.style.top = distance + "px";
    tut_wrap.style.left = "0.5%";
  } 
  else if (tutorialIndex == 2) 
  {
    setTimeout(() => {
      //** To get started, select the <b>+</b> button to add an instrument. */

      var distanceY = document.getElementById("myDropdown").offsetTop;
      var distanceX = document.getElementById("myDropdown").offsetWidth;
  
      console.log("Distance Y: " + distanceY);
      console.log("Distance X: " + distanceX);
  
      tut_wrap.style.top = distanceY + "px";
      tut_wrap.style.left = (distanceX) + "px";
    }, 100);
  } 
  else if (tutorialIndex == 3) 
  {
    //** All the instruments you have selected will appear here under the “Layers” tab. Select the dropdown icon “>” to expand your selection. */
    var distance = layers.children[0].offsetTop;
    tut_wrap.style.top = distance + "px";
    tut_wrap.style.left = "0.5%";
  } 
  else if (tutorialIndex == 4) 
  {
    //** Each instrument’s values are customizable, select the dropdown icon “>” next to <b>Global Style</b> to affect all bands within an instrument. */
    console.log(layers.children[0].children[0].children[0].children[2].children[0]);
    //layers.children[0].children[0].children[0].children[0].value = "off";
    
    var distance = layers.children[0].children[0].children[0].children[2].children[0].offsetTop;
    tut_wrap.style.top = distance + "px";
    tut_wrap.style.left = "0.5%";
  } 
  else if (tutorialIndex == 5)
  {
    //** These values will affect all bands within an instrument. Try toggling the “labels” checkmark to see how it affects the graph. */
    console.log(layers.children[0].children[0].children[0].children[2].children[0].children[2].children[2]);
    
    var distance = layers.children[0].children[0].children[0].children[2].children[0].children[2].children[2].offsetTop;
    
    if(tut_btn_skip.classList.contains("disabled"))
    {
      tut_btn_skip.classList.toggle("disabled");
    }

    tut_wrap.style.top = distance + "px";
    tut_wrap.style.left = "0.5%";
  }
  else if (tutorialIndex == 6)
  {
    //** These values will affect all bands within an instrument. Try toggling the “labels” checkmark to see how it affects the graph. */
    tut_btn_skip.classList.toggle("disabled");
    tut_wrap.style.top = "77.5%";
    tut_wrap.style.left = "50%";
  }

  //** FOR ENABELING AND DISABELING PREV BUTTON */
  if (tutorialIndex == 0) {
    if (!tut_btn_prev.classList.contains("disabled")) {
      tut_btn_prev.classList.toggle("disabled");
    }
  } else {
    if (tut_btn_prev.classList.contains("disabled")) {
      tut_btn_prev.classList.toggle("disabled");
    }
  }
  //** FOR ENABELING AND DISABELING NEXT BUTTON */
  if (tutorialIndex == tutorialTextList.length - 1) {
    tut_btn_next.innerHTML = "<b>DONE</b>";
  } else {
    tut_btn_next.innerHTML = "<b>&gt;</b>";
  }
  console.log("tutorial index: " + tutorialIndex);
}

//....** HTML OBJECTS ACTIONS ....*/

//** SIDEBAR FUNCTIONALITY */
sidebarButton.addEventListener("click", function () 
{
  //** TOGGLE Threedot */
  var dropdownButtons = document.getElementsByClassName("dropbtn");

  if(sidebar.classList.contains("active"))
  {
    sidebarButton.innerHTML = "›";
    sidebar_open = false;

    setTimeout(() => {
      //** HIDE ALL THREEDOTS */
      for (var i = 0; i < dropdownButtons.length; i++) 
      {
        var Threedot = dropdownButtons[i];
        console.log(Threedot.id);
        if (!Threedot.classList.contains('hide') && Threedot.id != "dropDownBtn_layers") 
        {
          Threedot.classList.toggle('hide');
        }
      }
    }, 100);
    
  }
  else
  {
    sidebarButton.innerHTML = "‹";
    sidebar_open = true;

    //** HIDE ALL THREEDOTS */
    for (var i = 0; i < dropdownButtons.length; i++) {
      var Threedot = dropdownButtons[i];
      if (Threedot.classList.contains('hide') && Threedot.id != "dropDownBtn_layers") 
      {
        Threedot.classList.remove('hide');
      }
    }
  }

  setTimeout(() => {
    chart2.update();
    chart.update();
  }, 5000);

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
  addPreset("Landsat 1-5 (MSS)", Landsat1_3_values);
  if(tutorial && tutorialIndex == 2)
  {
    progressTutorial(true);
  }
});
L4_5_Dropdown.addEventListener("click", function () {
  addPreset("Landsat 4-5 (TM)", Landsat4_5_values);
  
  if(tutorial && tutorialIndex == 2)
  {
    progressTutorial(true);
  }
});
L7_Dropdown.addEventListener("click", function () {
  addPreset("Landsat 7 (ETM+)", Landsat7_values);
  
  if(tutorial && tutorialIndex == 2)
  {
    progressTutorial(true);
  }
});
L8_9_Dropdown.addEventListener("click", function () {
  addPreset("Landsat 8-9 (OLI & TIRS)", Landsat8_9_values);
  
  if(tutorial && tutorialIndex == 2)
  {
    progressTutorial(true);
  }
});
LNext_Dropdown.addEventListener("click", function () {
  addPreset("Landsat Next", LandsatNext_values);
  
  if(tutorial && tutorialIndex == 2)
  {
    progressTutorial(true);
  }
});
Sentinel2_Dropdown.addEventListener("click", function () {
  addPreset("Sentinel-2 (MSI)", Sentinel2_values);
  
  if(tutorial && tutorialIndex == 2)
  {
    progressTutorial(true);
  }
});
Sentinel3_Dropdown.addEventListener("click", function () {
  addPreset("Sentinel-3 (OLCI)", Sentinel3_values);
  
  if(tutorial && tutorialIndex == 2)
  {
    progressTutorial(true);
  }
});
EO1_Dropdown.addEventListener("click", function () {
  addPreset("EO1 (ALI)", EO1_values);
  
  if(tutorial && tutorialIndex == 2)
  {
    progressTutorial(true);
  }
});
DESIS_Dropdown.addEventListener("click", function () {
  addPreset("DESIS", DESIS_values);
  
  if(tutorial && tutorialIndex == 2)
  {
    progressTutorial(true);
  }
});
ECOSTRESS_Dropdown.addEventListener("click", function () {
  addPreset("ECOSTRESS", ECOSTRESS_values);
  
  if(tutorial && tutorialIndex == 2)
  {
    progressTutorial(true);
  }
});
EMIT_Dropdown.addEventListener("click", function () {
  addPreset("EMIT", EMIT_values);
  
  if(tutorial && tutorialIndex == 2)
  {
    progressTutorial(true);
  }
});
MODIS_Dropdown.addEventListener("click", function () {
  addPreset("Terra/Aqua (MODIS)", MODIS_values);
  
  if(tutorial && tutorialIndex == 2)
  {
    progressTutorial(true);
  }
});
PACE_Dropdown.addEventListener("click", function () {
  addPreset("PACE (OCI)", PACE_values);
  
  if(tutorial && tutorialIndex == 2)
  {
    progressTutorial(true);
  }
});
WorldView_1_Dropdown.addEventListener("click", function () {
  addPreset("Worldview-1", WorldView_1_values);
  
  if(tutorial && tutorialIndex == 2)
  {
    progressTutorial(true);
  }
});
WorldView_2_Dropdown.addEventListener("click", function () {
  addPreset("Worldview-2", WorldView_2_values);
  
  if(tutorial && tutorialIndex == 2)
  {
    progressTutorial(true);
  }
});
WorldView_3_Dropdown.addEventListener("click", function () {
  addPreset("Worldview-3", WorldView_3_values);
  
  if(tutorial && tutorialIndex == 2)
  {
    progressTutorial(true);
  }
});
WorldView_4_Dropdown.addEventListener("click", function () {
  addPreset("Worldview-4", WorldView_4_values);
  
  if(tutorial && tutorialIndex == 2)
  {
    progressTutorial(true);
  }
});
// STELLA_Dropdown.addEventListener("click", function () {
//   addPreset("STELLA", STELLA_values);
//   //loopThroughLayers();
// });
// CUSTOM_Dropdown.addEventListener("click", function () {
//   addPreset("Custom", CUSTOM_values);
//   //loopThroughLayers();
// });

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
  correctGroupSeperation();
});

yStart_Global.addEventListener("change", function () {
  console.log(yStart_Global.value);

  yStartValue = yStart_Global.value;
  correctGroupSeperation();
});

function correctGroupSeperation()
{
  groupSeperation = parseFloat(groupSeperation_Global.value);
  var navs = layers.getElementsByClassName("nav");
  var lastYEnd = 0;
  var currentLastYend = 0;

  //** GO THROUGH EACH LAYER IN THE LAYERS TAB */
  Array.from(navs).slice().reverse().forEach(function (element, i) {
    
    var groupId = element.getAttribute("name");
    var currentBoxHeight = 0;

    for(var x=0; x < boxAnnotations.length; x++)
    {
      if(boxAnnotations[x].title.includes(groupId))
      {
        var yStart = 0; //+ offset
        var yEnd = 0;

        var inputName;

        if(!isNaN(boxAnnotations[x].title.slice(2, 3)))
        {
          inputName = boxAnnotations[x].title.slice(0, 3);
        }
        else
        {
          inputName = boxAnnotations[x].title.slice(0, 2);
        }

        var yOffset = document.getElementById(inputName + groupId + "_yOffset").value;

        //** SET THE HEIGHT IF ITS A BOX */
        if(boxAnnotations[x].title.includes("box"))
        {
          currentBoxHeight = parseFloat(boxAnnotations[x].yMax) - parseFloat(boxAnnotations[x].yMin);
        }

        //** IF ITS THE FIRST  */
        if(i == 0)
        {
          yStart = (groupSeperation_Global.value * i) + parseFloat(yStartValue) + parseFloat(yOffset); //+ offset
          yEnd = yStart + currentBoxHeight;

          // yStart = (groupSeperation_Global.value * i) + parseFloat(yStartValue) + parseFloat(yOffset); //+ offset
          // yEnd = yStart + currentBoxHeight;
        }
        else
        {
          //console.log(currentLastYend);
          yStart = parseFloat(currentLastYend) + parseFloat(yOffset) + parseFloat(groupSeperation_Global.value);
          yStart += 4;
          yEnd = yStart + currentBoxHeight;
        }
        
        //If its a sublabel, add extra padding
        if(boxAnnotations[x].title.includes("sublabel"))
        {
          boxAnnotations[x].yMin = yEnd + 1;
          boxAnnotations[x].yMax = yEnd + 1;
        }
        else
        {
          boxAnnotations[x].yMin = yStart;
          boxAnnotations[x].yMax = yEnd;
        }

        //** Checks to see what the greatest last value is */
        if(boxAnnotations[x].yMax > lastYEnd)
        {
          if(boxAnnotations[x].display)
          {
            lastYEnd = boxAnnotations[x].yMax;
          }
        }
      }
    }
    for(var y=0; y < boxAnnotations2.length; y++)
    {
      if(boxAnnotations2[y].title.includes(groupId))
      {
        var yStart = 0; //+ offset
        var yEnd = 0;

        var inputName;

        //** IF THE 3RD INDEX IS A NUMBER (EX: B11 as appose to B1) */
        if(!isNaN(boxAnnotations2[y].title.slice(2, 3)))
        {
          inputName = boxAnnotations2[y].title.slice(0, 3);
        }
        else
        {
          inputName = boxAnnotations2[y].title.slice(0, 2);
        }

        //var inputName = boxAnnotations2[y].title.slice(0, 2);
        var yOffset = document.getElementById(inputName + groupId + "_yOffset").value;

        //** SET THE HEIGHT IF ITS A BOX */
        if(boxAnnotations2[y].title.includes("box"))
        {
          currentBoxHeight = parseFloat(boxAnnotations2[y].yMax) - parseFloat(boxAnnotations2[y].yMin);
        }

        if(i == 0)
        {
          yStart = (groupSeperation_Global.value * i) + parseFloat(yStartValue) + parseFloat(yOffset);
          yEnd = yStart + currentBoxHeight;
        }
        else
        {
          //console.log(currentLastYend);
          yStart = parseFloat(currentLastYend) + parseFloat(yOffset) + parseFloat(groupSeperation_Global.value);
          yStart += 4;
          yEnd = yStart + currentBoxHeight;
        }

        if(boxAnnotations2[y].title.includes("sublabel"))
        {
          boxAnnotations2[y].yMin = yEnd + 1;
          boxAnnotations2[y].yMax = yEnd + 1;
        }
        else
        {
          boxAnnotations2[y].yMin = yStart;
          boxAnnotations2[y].yMax = yEnd;
        }

        //** Checks to see what the greatest last value is */
        if(boxAnnotations2[y].yMax > lastYEnd)
        {
          lastYEnd = boxAnnotations2[y].yMax;
          // if(boxAnnotations2[y].display == true)
          // {
          // }
        }
      }
    }

    currentLastYend = lastYEnd;
  });

  chart2.options.scales.y.min = 0;

  chart.update();
  chart2.update();
}

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
  graphConnector.classList.toggle("disabled");
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
  chart.options.scales.x.min = parseInt(Chart1_min.value);
  chart.update();
});
Chart1_max.addEventListener("change", function () {
  chart.options.scales.x.max = parseInt(Chart1_max.value);
  chart.update();
});
Chart2_min.addEventListener("change", function () {
  chart2.options.scales.x.min = parseInt(Chart2_min.value);
  chart2.update();
});
Chart2_max.addEventListener("change", function () {
  chart2.options.scales.x.max = parseInt(Chart2_max.value);
  chart2.update();
});

presetDropDown.addEventListener("click", function (event) 
{
  if(tutorial && tutorialIndex == 1)
  {
    progressTutorial(true);
  }
  
  document.getElementById("myDropdown").classList.toggle("show");
  document.getElementById("myDropdown").style.top = event.clientY + "px";
  document.getElementById("myDropdown").style.left = event.clientX + "px";
});

//** TUTORIAL BUTTONS */
tut_btn_prev.addEventListener("click", function () {
  console.log("PREVIOUS");
  progressTutorial(false);
});
tut_btn_next.addEventListener("click", function () {
  console.log("NEXT");

  if (tutorialIndex == tutorialTextList.length - 1) {
    if (tut_wrap.classList.contains("active")) {
      tut_wrap.classList.toggle("active");
    }
    tutorial = false;
  } else {
    progressTutorial(true);
  }
});
tut_btn_skip.addEventListener("click", function () {
  if (tut_wrap.classList.contains("active")) {
    tut_wrap.classList.toggle("active");
  }
  tutorial = false;
});

//** Info Icon  */
infoIcon.addEventListener("click", function () {
  window.open('https://landsat.gsfc.nasa.gov/spectral-band-comparison-tool','mywindow');
});

var lastClickedButton;
// Close the dropdown if the user clicks outside of it
window.onclick = function(event) 
{ 
  if (!event.target.matches('.dropbtn')) 
  {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) 
    {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) 
      {
        openDropdown.classList.remove('show');
      }
    }
    //** TOGGLE Threedot */
    var dropdownButtons = document.getElementsByClassName("dropbtn");
    
    if(sidebar_open)
    {
      for (var i = 0; i < dropdownButtons.length; i++) {
        var Threedot = dropdownButtons[i];
        if (Threedot.classList.contains('hide') && Threedot.id != "dropDownBtn_layers") 
        {
          Threedot.classList.remove('hide');
        }
      }
    }
    
  }
  else
  {
    lastClickedButton = event.target;

    //** TOGGLE Threedot */
    if (event.target.id != "dropDownBtn_layers")
    {
      var dropdownButtons = document.getElementsByClassName("dropbtn");
      for (var i = 0; i < dropdownButtons.length; i++) {
        var Threedot = dropdownButtons[i];
        if (Threedot.classList.contains('hide')) 
        {
          if(Threedot.id != "dropDownBtn_layers")
          {
            Threedot.classList.remove('hide');
          }
        }
        else
        {
          if(Threedot.id != "dropDownBtn_layers")
          {
            Threedot.classList.toggle('hide');
          }
        }
      }
    }
  }
}



//console.log(boxAnnotations);
//console.log(boxAnnotations2);

//** REMOVE BOX ANNOTATION */
// setTimeout(() => {
//   boxAnnotations.splice(0, 3);
//   console.log(boxAnnotations);
//   chart.update();
// }, 2000);
