// Get the Samples 
const samples = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//populate the dropdown menu and display data
function init(){
  // Fetch the JSON data and console log it
  d3.json(samples).then(function(data) {
    let sampleNames = data.names;
    //Thank you stackoverflow for showing how to do this without using getElementById
    let selector = d3.select("#selDataset");
    sampleNames.forEach((sample) => {
      selector
      .append("option")
      .text(sample)
      .property("value", sample);});
        
    //initialze charts with the first samples data
    let firstId = sampleNames[0];

    barChart(firstId);
    bubbleChart(firstId);
    demographicInfo(firstId);
    gaugeChart(firstId);
  })
}
//call function to populate the list
init();


function optionChanged(newSample) {
  barChart(newSample);
  bubbleChart(newSample);
  demographicInfo(newSample);
  gaugeChart(newSample);
}


function barChart(sampleId){
  d3.json(samples).then(function(data) {
    let sampleResults = data.samples;
    let results = []
  
    //get the selected sample results
    for(let i = 0; i < sampleResults.length; i++) {        
      if(sampleResults[i].id === sampleId){
        results = sampleResults[i];
      }
    }

    //fill arrays with sample_values, otu_ids, otu_labels for bar chart
    let sampValues = results.sample_values.slice(0,10).reverse();
    let sampIds = results.otu_ids.slice(0,10).reverse();
    let sampLabels = results.otu_labels.slice(0,10).reverse();

    //change out_ids to desired format
    for(let i = 0; i < sampIds.length; i++) {
      sampIds[i] = `OTU ${sampIds[i]}`;
    }
    //chnge the otu labels to strings for hover template
    sampLabels = sampLabels.toString();

    //set the data values for the bar chart
    let barData = [{
      x: sampValues,
      y: sampIds,
      type: "bar",
      orientation: 'h',
      hovertemplate: sampLabels
    }];

    let layout = {
      showlegend: false,
      width: 1000,
      height: 400
    };

    //plot the new chart
    Plotly.newPlot("bar", barData, layout);
  })
}

function bubbleChart(sampleId){
  d3.json(samples).then(function(data) {
    let sampleResults = data.samples;
    let results = []
  
    //get the selected sample results
    for(let i = 0; i < sampleResults.length; i++) {        
      if(sampleResults[i].id === sampleId){
        results = sampleResults[i];
      }
    }

    //fill arrays with sample_values, otu_ids, otu_labels for bubble chart
    let sampIds = results.otu_ids;
    let sampValues = results.sample_values;
    let sampLabels = results.otu_labels;

    //set the data values for the bubble chart
    let bubbleData = [{
      x: sampIds,
      y: sampValues,
      text: sampLabels,
      mode: 'markers',
      marker: {
        color: sampIds,
        size: sampValues,
        colorscale: 'Earth'

      }
    }];

    let layout = {
      showlegend: false
    };

    let config = {responsive: true}

    //plot the new chart
    Plotly.newPlot("bubble", bubbleData, layout, config);
  })
}
function demographicInfo(sampleId){
  d3.json(samples).then(function(data) {
    let sampleDemographicInfo = data.metadata;
    let demoInfoKeys = [];
    let demoInfoValues = [];
    let panelInfo = d3.select("#sample-metadata");
    //clear previous selections
    panelInfo.html("");



  
    //get the selected sample results
    for(let i = 0; i < sampleDemographicInfo.length; i++) {  
      
      if(sampleDemographicInfo[i].id == sampleId){

        demoInfoKeys = Object.keys(sampleDemographicInfo[i]);
        demoInfoValues = Object.values(sampleDemographicInfo[i]);

        for(let j = 0; j < demoInfoKeys.length; j++){
          panelInfo
          .append("p")
          .style("font-weight", 600)
          .text(`${demoInfoKeys[j]}:  ${demoInfoValues[j]}`)
          .insert("br");

        }

      }
    }
  
  })
}


function gaugeChart(sampleId){
  d3.json(samples).then(function(data) {
    let sampleWashFreqInfo = data.metadata;
    let washFreq = 0;

    for(let i = 0; i < sampleWashFreqInfo.length; i++) {  
      
      if(sampleWashFreqInfo[i].id == sampleId){
        washFreq = sampleWashFreqInfo[i].wfreq
      }
    }


    var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washFreq,
        title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs Per Week" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 9]},
          steps: [
            { range: [0,1], color: '#Effbf1'},
            { range: [1,2], color: '#Dbfde1'},
            { range: [2,3], color: '#Cdfdd6'},
            { range: [3,4], color: '#Bbfbc7'},
            { range: [4,5], color: '#Acf1b9'},
            { range: [5,6], color: '#A0e4ad'},
            { range: [6,7], color: '#93d49f'},
            { range: [7,8], color: '#7fbb8a'},
            { range: [8,9], color: '#69a073'}
          ],

          
        }
      }
    ];
    
    var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
    Plotly.newPlot("gauge", data, layout);
  })
}





