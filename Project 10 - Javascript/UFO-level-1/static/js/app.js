// from data.js
var tableData = data;

var button = d3.select('#filter-btn')

button.on('click', function(){

    // Select the input date
    var inputDate = d3.select('#datetime').property("value");
    console.log(inputDate)

    // filter the date
    var filteredDate = tableData.filter( record => record.datetime === inputDate);
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
