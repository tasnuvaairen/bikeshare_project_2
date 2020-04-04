

var queryUrl_base = "http://127.0.0.1:5000/get_ny_list_db";
var max_results = 25;

var max_results_input  = d3.select("#max-results");
var filter_select  = d3.select("#filter-select");

populate_dates("February", 28);

function populate_dates(month, days) { 
  for (var i = 2; i <= days; i++) {
    date = "0";
    if (i < 10) {
      date += i.toString();    
    }    
    else {
      date = i.toString()   
    }
    filter_select.append("option").attr("value", date).text(date);
  }  

 

  draw_plot(false);  
}

function filter_select_onchange(select) {
  //alert(select.value);
  var filter_option = filter_select.property("value");
  //alert(filter_option);

  draw_plot(true);  
}

max_results_input.on("keypress", function() {
  //update(+this.value);
  if(d3.event.keyCode === 32 || d3.event.keyCode === 13) {

    if (max_results_input.property("value") != "") {
      
      
      if (isNaN(max_results_input.property("value"))) {
        alert("Max Results Input is Invalid!");  
        return;
      }         

      tmp_max_results = parseInt(max_results_input.property("value"));

      if (tmp_max_results > 0) {
        max_results = tmp_max_results;
      }

    } else {
      alert("Max Results Input is Invalid!");  
      return;
    }  
      //alert(max_results);
      draw_plot(true);
  }  

});


function get_gender_string(gender) {
  if (gender === 1) {
    return "M";
  } else if (gender === 2) {
    return "F";
  } else {
    return "U";
  }
}

function get_usertype_string(usertype) {
  if (usertype === 1) {
    return "Subscriber";
  } else if (usertype === 2) {
    return "Customer";
  } else {
    return "U";
  }
}

var svgWidth = parseInt(d3.select("#scatter").style("width")); //960;
var svgHeight = 500; //parseInt(d3.select("#scatter").style("height")); //500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "gender";
var chosenYAxis = "tripduration"; 

// function used for updating x-scale var upon click on axis label
function xScale(bikeData, chosenXAxis, width) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(bikeData, d => d[chosenXAxis]),// * 0.8,
      d3.max(bikeData, d => d[chosenXAxis]),// * 1.2
    ])
    .range([0, width]);
  return xLinearScale;
}

function yScale(bikeData, chosenYAxis, height) {
  var yLinearScale = d3.scaleLinear()
    /*.domain([d3.min(bikeData, d => d[chosenYAxis]) * 0.8,
      d3.max(bikeData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);*/
    .domain([0, d3.max(bikeData, d => d[chosenYAxis])])
    .range([height, 0]);
  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  if (chosenXAxis === "gender") {
      bottomAxis = d3.axisBottom(newXScale).ticks(2);          
  } else if (chosenXAxis === "subscribertype") {
      bottomAxis = d3.axisBottom(newXScale).ticks(1);          
  }

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function renderYAxes(newYScale, yAxis) {
  var axisLeft = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(axisLeft);

  return yAxis;
}


// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

function renderCirclesXY(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis, circlesGroupLabel) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

   circlesGroupLabel.transition()
    .duration(1000)
    .attr("x", (d) => newXScale(d[chosenXAxis]) - 5)
    .attr("y", (d) => newYScale(d[chosenYAxis]) + 5);

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  var label;
  var labelY;

  if (chosenXAxis === "gender") {
    label = "gender";
  } else if (chosenXAxis === "birthyear") {
    label = "birthyear";    
  } else if (chosenXAxis === "subscribertype") {
    label = "subscribertype";    
  }

  if (chosenYAxis === "tripduration") {
    labelY = "tripduration";
  } else if (chosenYAxis === "bikeid") {
    labelY = "bikeid";    
  }


  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      //return (`${d.birthyear}<br>${label} ${d[chosenXAxis]}<br>${labelY} ${d[chosenYAxis]}`);
      //return (`${label} ${d[chosenXAxis]}<br>${labelY} ${d[chosenYAxis]}`);

      if (chosenXAxis === "gender") {
        return (`${label}: ${get_gender_string(d[chosenXAxis])}<br>${labelY}: ${d[chosenYAxis]}`);  
      } else if (chosenXAxis === "subscribertype") {
        return (`usertype: ${get_usertype_string(d[chosenXAxis])}<br>${labelY}: ${d[chosenYAxis]}`);
      } else if (chosenXAxis === "birthyear") {
        return (`age: ${d[chosenXAxis]}<br>${labelY}: ${d[chosenYAxis]}`);
      }

    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
    
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

function draw_plot(do_resize) {

  
  //var do_resize = true;

  if (do_resize) {
    svgWidth = parseInt(d3.select("#scatter").style("width"));
    svgHeight = svgWidth - svgWidth / 3.9; 
    
    width = svgWidth - margin.left - margin.right;
    //height = width - width / 3.9;      
    height = svgHeight - margin.top - margin.bottom;

    d3.select("svg").remove();

    svg = d3
      .select(".chart")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    //svg.attr("width", width);

    chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  }

  var circle_radius = 15;

  if (width < 500) {
    circle_radius = 7.5;
  }  

  var filter_option = filter_select.property("value");

  var queryUrl_2 = queryUrl_base + "/" + filter_option + "/" + max_results.toString(); //"http://127.0.0.1:5000/get_ny_list_db/28/100" 

  // Retrieve data from the CSV file and execute everything below
  //d3.csv("assets/data/201902-citibike.csv").then(function(bikeData, err) {
  //d3.csv("static/data/get_ny_list_db.csv").then(function(bikeData, err) {    
  d3.csv(queryUrl_2, function(bikeData) {  
    //console.log(bikeData);

    //alert(bikeData);
    //if (err) throw err;

    // parse data
    bikeData.forEach(function(data) {
      // x-axis
      data.gender = +data.gender;
      data.birthyear = +data.birthyear;
      data.subscribertype = +data.subscribertype;
      //data.usertype = +data.usertype;

      // y-axis
      data.tripduration = +data.tripduration;
      data.bikeid = +data.bikeid;

      //console.log(+data.subscribertype);
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(bikeData, chosenXAxis, width);
    var yLinearScale = yScale(bikeData, chosenYAxis, height);

    // Create y scale function
    /*var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(bikeData, d => d.tripduration)])
      .range([height, 0]);*/

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);

    if (chosenXAxis === "gender") {
      bottomAxis = d3.axisBottom(xLinearScale).ticks(2);          
    } else if (chosenXAxis === "subscribertype") {
      bottomAxis = d3.axisBottom(xLinearScale).ticks(1);          
    }

    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    // append y axis
    //chartGroup.append("g")
    //  .call(leftAxis);

    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .attr("transform", `translate(0, 0)`)
      .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(bikeData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xLinearScale(d[chosenXAxis]))
      //.attr("cy", d => yLinearScale(d.tripduration))
      .attr("cy", (d) => yLinearScale(d[chosenYAxis]))
      .attr("r", circle_radius)
      .attr("fill", "green")
      .attr("opacity", "0.3");

    var circlesGroupLabel = chartGroup.append("g").selectAll("text") // TODO: remove
      .data(bikeData)
      .enter()  
      .append("text")
      .attr("x", (d) => xLinearScale(d[chosenXAxis]) - 5)
      .attr("y", (d) => yLinearScale(d[chosenYAxis]) + 5)
      .attr("font-size", "9px")
      //.text("US");
      .text((d) => get_gender_string(d["gender"])); //d["abbr"]);    
    

    // Create group for 3 x- axis labels
    var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var genderLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 15)
      .attr("value", "gender") // value to grab for event listener
      .classed("active", true)
      .text("Gender");

    var birthyearLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 35)
      .attr("value", "birthyear") // value to grab for event listener
      .classed("inactive", true)
      //.text("birthyear");
      .text("Age");

    var subscribertypeLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 55)
      .attr("value", "subscribertype") // value to grab for event listener
      .classed("inactive", true)
      //.text("Subscriber Type");
      .text("User Type");

    // Create group for 3 y- axis labels
    var tripdurationLabel = labelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - width/2 - 80)
      .attr("x", height/2)
      .attr("valueY", "tripduration")
      .classed("active", true)
      .text("Trip Duration (seconds)");

    var bikeidLabel = labelsGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - width/2 - 60)
      .attr("x", height/2)
      .attr("valueY", "bikeid")
      .classed("inactive", true)
      .text("Bike ID");
  
    // changes classes to change bold text 

    // X-axis
    if (chosenXAxis === "gender") {
      genderLabel
        .classed("active", true)
        .classed("inactive", false);
      birthyearLabel 
        .classed("active", false)
        .classed("inactive", true);
      subscribertypeLabel 
        .classed("active", false)
        .classed("inactive", true);  
    } else if (chosenXAxis === "birthyear") {
      birthyearLabel
        .classed("active", true)
        .classed("inactive", false);
      genderLabel 
        .classed("active", false)
        .classed("inactive", true);
      subscribertypeLabel 
        .classed("active", false)
        .classed("inactive", true);
    } else if (chosenXAxis === "subscribertype") {
      subscribertypeLabel
        .classed("active", true)
        .classed("inactive", false);
      genderLabel 
        .classed("active", false)
        .classed("inactive", true);
      birthyearLabel 
        .classed("active", false)
        .classed("inactive", true);
    }

    // Y-axis
    if (chosenYAxis === "tripduration") {
      tripdurationLabel
        .classed("active", true)
        .classed("inactive", false);
      bikeidLabel 
        .classed("active", false)
        .classed("inactive", true); 
    } else if (chosenYAxis === "bikeid") {
      bikeidLabel
        .classed("active", true)
        .classed("inactive", false);
		  tripdurationLabel 
        .classed("active", false)
        .classed("inactive", true);
    }
    
    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // x axis labels event listener
    labelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        //alert(value);
        //alert(chosenXAxis);

        var valueY = d3.select(this).attr("valueY");
        //alert(valueY);
        //alert(chosenYAxis);

        if ((value !== chosenXAxis) || (valueY !== chosenYAxis)) { // check change event

          // replaces chosenXAxis with value

          if (value !== null) {
            chosenXAxis = value;
          }

          if (valueY !== null) {
            chosenYAxis = valueY;    
          }

          // console.log(chosenXAxis)

          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(bikeData, chosenXAxis, width);

          yLinearScale = yScale(bikeData, chosenYAxis, height);
         

          // updates x axis with transition
          xAxis = renderXAxes(xLinearScale, xAxis);

          yAxis = renderYAxes(yLinearScale, yAxis);          

          // updates circles with new x values
          //circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

          circlesGroup = renderCirclesXY(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis, circlesGroupLabel);

          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
         

          // changes classes to change bold text 

          // X-axis
          if (chosenXAxis === "gender") {
            genderLabel
              .classed("active", true)
              .classed("inactive", false);
            birthyearLabel 
              .classed("active", false)
              .classed("inactive", true);
            subscribertypeLabel
              .classed("active", false)
              .classed("inactive", true);  
          } else if (chosenXAxis === "birthyear") {
            birthyearLabel
              .classed("active", true)
              .classed("inactive", false);
            genderLabel 
              .classed("active", false)
              .classed("inactive", true);
            subscribertypeLabel
              .classed("active", false)
              .classed("inactive", true);
          } else if (chosenXAxis === "subscribertype") {
            subscribertypeLabel
              .classed("active", true)
              .classed("inactive", false);
            genderLabel 
              .classed("active", false)
              .classed("inactive", true);
            birthyearLabel 
              .classed("active", false)
              .classed("inactive", true);
          }

          // Y-axis
          if (chosenYAxis === "tripduration") {
            tripdurationLabel
              .classed("active", true)
              .classed("inactive", false);
          bikeidLabel
              .classed("active", false)
              .classed("inactive", true); 
          } else if (chosenYAxis === "bikeid") {
            bikeidLabel
              .classed("active", true)
              .classed("inactive", false);
            tripdurationLabel 
              .classed("active", false)
              .classed("inactive", true);
        
          }

        }
      });
       
  });//.catch(function(error) {
  //  console.log(error);
  //});

} // draw_plot

//draw_plot(false);

d3.select(window).on("resize", function() {
  //alert("Resize.");
  draw_plot(true);
});