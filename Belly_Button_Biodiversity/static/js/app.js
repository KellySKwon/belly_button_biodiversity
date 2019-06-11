function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(response){
    console.log("guage no");
    console.log(response);
  
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    Object.entries(response).forEach(([key,value])=>{
      panel.append('p').text(`${key} : ${value}`);
    })
    
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

    response.map(d => { 
      const level = d.wfreq;
      console.log(level);
    })

  })
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(response){
    console.log("sample data log - check pie6");
    console.log(response);

    // @TODO: Build a Bubble Chart using the sample data
    var bubble = d3.select("bubble");

    var trace1 = {
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_labels,
      mode: 'markers',
      marker: {
        color: response.otu_ids,
        size: response.sample_values
      },
      colorscale: 'Jet'
    }

    var data = [trace1];

    var layout = {
      title: 'Samples (OTU)',
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Sample Values'},
      showlegend: false,
    };

    Plotly.newPlot('bubble',data,layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    var pie = d3.select("pie");

    var trace2 = [{
      values: response.sample_values.slice(0,10),
      labels: response.otu_ids.slice(0,10),
      hovertext: response.otu_labels.slice(0,10),
      type: 'pie'
    }];

    var layout2 = {
      title: 'Belly Button Sample Diversity'
    };

    Plotly.newPlot('pie',trace2,layout2);

//     //Guage Chart
//     var panel = d3.select("#guage");

//     // Trig to calc meter point
//   var degrees = 180 - level,
//   radius = .5;
// var radians = degrees * Math.PI / 180;
// var x = radius * Math.cos(radians);
// var y = radius * Math.sin(radians);

// // Path: may have to change to create a better triangle
// var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
//   pathX = String(x),
//   space = ' ',
//   pathY = String(y),
//   pathEnd = ' Z';
// var path = mainPath.concat(pathX,space,pathY,pathEnd);

// var gdata = [{ type: 'scatter',
// x: [0], y:[0],
//   marker: {size: 28, color:'850000'},
//   showlegend: false,
//   name: 'Washing Frequency',
//   text: level,
//   hoverinfo: 'text+name'},
// { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
// rotation: 90,
// text: ['0-1', '1-2', '2-3', '3-4','4-5', '5-6', '6-7','7-8','8-9'],
// textinfo: 'text',
// textposition:'inside',
// labels: ['0-1', '1-2', '2-3', '3-4','4-5', '5-6', '6-7','7-8','8-9'],
// hoverinfo: 'label',
// hole: .5,
// type: 'pie',
// showlegend: false
// }];

// var glayout = {
// shapes:[{
//     type: 'path',
//     path: path,
//     fillcolor: '850000',
//     line: {
//       color: '850000'
//     }
//   }],
// title: '<b>Gauge</b> <br> Speed 0-100',
// height: 1000,
// width: 1000,
// xaxis: {zeroline:false, showticklabels:false,
//           showgrid: false, range: [-1, 1]},
// yaxis: {zeroline:false, showticklabels:false,
//           showgrid: false, range: [-1, 1]}
// };

// Plotly.newPlot('guage', gdata, glayout);

  })
  
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
