// from data.js
var tableData = data;


var button = d3.select('#filter-btn')

button.on('click', function(){

    // Select the input date
    var inputDate = d3.select('#datetime').property("value");

    var inputCity = d3.select('#city').property("value");

    var inputState = d3.select('#state').property("value");

    var inputCountry = d3.select('#country').property("value");

    var inputShape = d3.select('#shape').property("value");

    // loop through the input data to check if there is empty string, if not, put all the conditions into one array
    var input = [inputDate, inputCity, inputState, inputCountry, inputShape];
    var condition = [];
    for (var i=0; i<input.length; i++) {
        if (input[i] !== "") {
            condition.push(input[i])
        }
    }
    // check the condition
    console.log(condition)
    
    
    // filter date with the condition above

    var filteredDate = [];

    for (var i=0; i < tableData.length; i++) {
        var allvalue = Object.values(tableData[i]);
        if (condition.every(element => allvalue.indexOf(element) > -1)) {
            filteredDate.push(tableData[i])
        }
        
    }
    // check the filteredDate
    console.log(filteredDate)

    // output the result to the table
    var tbody1 = d3.select('#ufo-table>tbody')

    filteredDate.forEach(record => {
        var row = tbody1.append("tr");
        row.append("td").text(record.datetime);
        row.append("td").text(record.city);
        row.append("td").text(record.state);
        row.append("td").text(record.country);
        row.append("td").text(record.shape);
        row.append("td").text(record.durationMinutes);
        row.append("td").text(record.comments);
    });
});


