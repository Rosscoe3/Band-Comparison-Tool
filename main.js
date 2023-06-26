import './style.css'

//** CHART JS SETUP */
const ctx = document.getElementById('myChart');
let myData = "/myData.csv";

let transmissionData = [];
var boxAnnotations = [];
var labels = [];

var arrayStartCut = 200;
var arrayEndCut = 1150;
var transmissionDataResolution = 1;

//** IMPORT TRANSMISSION DATA AS A CSV */
d3.csv(myData).then(function(datapoints){
  transmissionData = datapoints;
  plotCSV();
  resize();
});

var data = {
  datasets: [
    //** VISIBLE dataset 13*/
    {
      data: [
      ],
      showLine: true,
      label: "Transmission",
      fill: true,
      borderColor: "rgb(255, 255, 255)",
      pointBackgroundColor: "rgb(189, 195, 199)",
      pointRadius: 0,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      enabled: false,
    },
    annotation: {
      annotations: boxAnnotations
    },
  }
};

const config = {
  type: "scatter",
  data: data,
  options: {
    radius: 3,
    hitRadius: 10,
    hoverRadius: 8,
    spanGaps: true,
    responsive: true,
    maintainAspectRatio: false,
    tension: 0,
    plugins: {
      customCanvasBackgroundColor: {
        color: "white",
      },
      title: {
        display: true,
        text: "  UID: 8888",
        align: "start",
        font: {
          weight: "bold",
          family: "'Inter', sans-serif",
          size: 14,
        },
      },
      background: {
        color: "white",
      },
      legend: {
        display: true,
        labels: {
          filter: function (item, chart) {
            //** Function for filtering out legends. Chooses which Labels to exclude depending on the dataMode*/
            if (excludeLabelList.includes(item.text)) {
              return false;
            } else {
              return item;
            }
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
    },
    //** ADDS NM to the Y axis lables */
    animation: {
      onComplete: () => {
        delayed = true;
      },
      delay: (context) => {
        let delay = 0;
        if (context.type === "data" && context.mode === "default" && !delayed) {
          delay = context.dataIndex * 75 + context.datasetIndex * 25;
        }
        return delay;
      },
    },
    scales: {
      y: {
        // ticks: {
        //   callback: function (value){
        //     return value + "μW/cm²";
        //   }
        // },
        title: {
          display: true,
          text: "μW/cm²",
          font: {
            size: 15,
          },
        },
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
      },
    },
  },
  plugins: ['chartjs-plugin-annotation'],
  options,
};

const chart = new Chart(ctx, config);

init();
function init() {
  //transmissionData = readTextFile("/myData.csv", true);
  console.log(chart.options.plugins.annotation.annotations[0]);
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
  })
  console.log(compressedArray); 
  
  for(var i = 0; i < compressedArray.length - arrayEndCut; i++)
  {
    chart.data.datasets[0].data[i] = ({
      x: compressedArray[i].Wave * 1000,
      y: compressedArray[i].TotTrans,
    });
  }
  chart.update();
}

//** WINDOW RESIZE EVENT */
window.onresize = function () {
  resize();
};

var resizeTimeout;
function resize()
{
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function () 
  {
    //chart.options.plugins.annotation.annotations.label1.font.size = '10%';
    chart.update();
    chart.resize();
  }, 500);
}

var textFont = '25%';

addBox(430, 450, 0.2, 0.25, 'rgb(103,156,191)', '1', textFont);
addBox(450, 510, 0.1, 0.15, 'rgb(0,101,141)', '2', textFont);
addBox(530, 590, 0.1, 0.15, 'rgb(76,157,95)', '3', textFont);
addBox(640, 670, 0.1, 0.15, 'rgb(194,32,54)', '4', textFont);
addBox(850, 880, 0.1, 0.15, 'rgb(197,162,189)', '5', textFont);
addBox(1570, 1650, 0.1, 0.15, 'rgb(211,153,121)', '6', textFont);
addBox(2110, 2290, 0.1, 0.15, 'rgb(153,156,150)', '7', textFont);
addBox(500, 680, 0.0, 0.05, 'rgb(0,143,162)', '8', textFont);
addBox(1360, 1380, 0.2, 0.25, 'rgb(116,128,161)', '9', textFont);
// addBox(10600, 11190, 0.1, 0.15, 'rgb(188,122,130)', '10', '35%');
// addBox(11500, 12510, 0.1, 0.15, 'rgb(188,122,130)', '11', '35%');

//** ADD LINE FOR ANNOTATION */
function addBox(xMin, xMax, yMin, yHeight, color, labelText, textSize) {
  var box = {
    type: 'box',
    xMin: xMin,
    xMax: xMax,
    yMin: yMin,
    yMax: yHeight,
    borderWidth: 0,
    backgroundColor: color,
  };
  var label = {
    type: 'label',
    xMin: xMin,
    xMax: xMax,
    yMin: yMin,
    yMax: yHeight,
    content: [labelText],
    font: {
    size: textSize,
    borderColor: 'rgb(245,245,245)',
    color: 'rgb(245,245,245)',
    },
    color: 'rgb(245,245,245)',
  };

  boxAnnotations.push(box);
  boxAnnotations.push(label);
}

console.log(boxAnnotations);

//** REMOVE BOX ANNOTATION */
// setTimeout(() => {
//   boxAnnotations.splice(0, 2);
//   console.log(boxAnnotations);
//   chart.update();
// }, 2000);
