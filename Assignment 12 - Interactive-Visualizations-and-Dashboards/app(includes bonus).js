function newPlot(id){
    // fetch data from local Json, using fetch here instead of d3.json()
    fetch('samples.json').then(response => {
        console.log(response);
        return response.json();
    }).then(data =>{
        console.log(data);

    // Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual
    // filter samples according to the Id

    var samples = data.samples.filter(element => element.id.toString() === id)[0];
    console.log(samples);
    
    // get the top 10 sample values
    var sample_values = samples.sample_values.slice(0,10).reverse()
    console.log(sample_values)
    
    // get the top 10 OTU ids
    var top_otu = samples.otu_ids.slice(0,10).reverse()
    console.log(top_otu)

    // create the bar chart
    var trace = {
        x: sample_values,
        y: top_otu.map(d => "OTU " + d),
        type: 'bar',
        orientation: "h",
        marker: {
            color: 'yellowblue'
          },
        text: samples.otu_labels.slice(0, 10),
    };

    var data_bar = [trace];

    var layout = {
        title: 'Top 10 OTUs',
        font:{
                family: 'Raleway, sans-serif'
            },
        barmode: 'stack',
        bargap: 0.3,
        width: 600,
        height: 500,
    };
    // plot the bar chart
    Plotly.newPlot("bar", data_bar, layout);

    // create the bubble chart
    var trace1 = {
        x: samples.otu_ids,
        y: samples.sample_values,
        mode: "markers",
        marker: {
            size: samples.sample_values,
            color: samples.otu_ids
        },
        text: samples.otu_labels,

    };
    
    var layout_bubble = {
        xaxis:{title: "OTU ID"},
        height: 600,
        width: 1200
    };

    var data_bubble = [trace1];

    // plot the bubble chart
    Plotly.newPlot("bubble", data_bubble, layout_bubble); 

    // create the guage chart
    var wfreq = data.metadata.map(d => d.wfreq);

    var trace2 = {
        domain: { x: [0, 1], y: [0, 1] },
        value: parseFloat(wfreq),
        title: {text: `Belly Button Washing Frequency`},
        type: "indicator",
        mode: "gauge+number",
        text: ["0-1","1-2","2-3","3-4","4-5","5-6","6-7","7-8","8-9"],
        gauge: { axis: { 
                    range: [null, 9],
                    },
                 steps: [
                  { range: [0, 1], color: "rgb(247,242,235)" },
                  { range: [1, 2], color: "rgb(243,240,228)" },
                  { range: [2, 3], color: "rgb(232,230,200)" },
                  { range: [3, 4], color: "rgb(228,232,175)" },
                  { range: [4, 5], color: "rgb(212,228,148)" },
                  { range: [5, 6], color: "rgb(182,204,138)" },
                  { range: [6, 7], color: "rgb(134,191,127)" },
                  { range: [7, 8], color: "rgb(132,187,138)" },
                  { range: [8, 9], color: "rgb(127,180,133)" },
                ]}
    };

    var data_guage = [trace2];

    var layout_guage = { 
        width: 600, 
        height: 600, 
        margin: { t: 20, b: 40, l:100, r:100 } 
      };

    // plot the guage chart
    Plotly.newPlot("gauge", data_guage, layout_guage); 


    })
};

// create the function to display the requested Info
function displayInfo(id) {
    // read the json file to get data
    d3.json("samples.json").then((data)=> {
        
        // access the metadata array to render the Demographic Info
        var metadata = data.metadata;

        // filter metadata according to the id
        var filter = metadata.filter(element => element.id.toString() === id)[0];
        console.log(filter)

        // output the data to demographic panel
        var panel = d3.select("#sample-metadata");
        
        // clear the panel first
        panel.html("");

        // render the info
        Object.entries(filter).forEach(element => {   
            panel.append('p').text(element[0] + ": " + element[1]);
        });
        
    });
}

// create the init function to render the requested data
function init() {
    // select the dropdown menu 
    var dropdown = d3.select("#selDataset");

    // fetch the json and render the Id names 
    d3.json("samples.json").then((data)=> {
        console.log(data)

        // render the ID
        data.names.forEach(function(element) {
            dropdown.append("option").text(element).property("value");
        });

        // call the functions set 940 as default value
        newPlot('940');
        displayInfo('940');
    });
}

// create the optionchanged ID
function optionChanged(id) {
    newPlot(id);
    displayInfo(id);
}

// run the init function
init();
