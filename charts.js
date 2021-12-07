function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
})}

init();

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata= data.metadata;
    var resultsarray= metadata.filter(sampleobject => 
      sampleobject.id == sample);
    var result= resultsarray[0]
    var panel = d3.select("#sample-metadata");
    panel.html("");
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
        // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    var individualMetadata = data.metadata.filter(sampleobject => sampleobject.id == sample)[0];
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var results = samples.filter(sampleobject => sampleobject.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = results[0] 
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = result.otu_ids;
    var labels = result.otu_labels;
    var values = result.sample_values;
    var freq = individualMetadata.wfreq;
      

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        x:values.slice(0,10).reverse(),
        text:labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h"
  
      }
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
  

// Bar and Bubble charts
// Create the buildCharts function.

    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
      x:ids,
      y:values,
      text: labels,
      mode: "markers",
      marker: {
        color: ids,
        size: values,
      }
    }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
    xaxis: { title: "OTU ID" },
    yaxis: {title: "Sample Value"},
    width: window.width,
    hovermode: "closest",
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

 // 4. Create the trace for the gauge chart.
 var traceGauge = {
  type: 'indicator',
  mode: 'gauge+number',
  title: {text: `<b>Belly Button Washing Frequency<b><br>Number of Scrubs</span>`},
  value: freq,
  gauge: {
      axis: {
          range: [0, 10]
      },
      steps: [
          {range: [0,2], color: '#e81123'},
          {range: [2,4], color: '#ff8c00'},
          {range: [4,6], color: '#fff100'},
          {range: [6,8], color: '#00b294'},
          {range: [8,10], color: '#009e49'}   
      ],
  }
};
 
 var gaugeData = [traceGauge]
   
 var gaugeLayout = { 
    
      width: 400,
      height: 350,
      margin: {t: 25, r:10, l:25, b:25}
  };
  
   Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  
     

  });
}
