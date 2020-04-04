

//var queryUrl_1 = "http://127.0.0.1:5000/get_global_list_db";
//var queryUrl_1 = "http://127.0.0.1:5000/global_list";

var datetime_input  = d3.select("#datetime");
var filter_btn  = d3.select("#filter-btn");
var ufo_table  = d3.select("#ufo-table");

var viewall_btn  = d3.select("#viewall-btn");

var filter_select  = d3.select("#filter-select");

var myMap = createMap();
var markers = L.markerClusterGroup();
var markerList = [];

populate_ufo_table();

filter_btn.on("click", function() {
	//alert("filter_btn");

	var filter_option = filter_select.property("value");	
	filter_option = filter_option.replace('-option','');
	//alert(filter_option);
	//return;

	var filter_option_t = "city"; //"datetime";
	var keyword = datetime_input.property("value"); //"1/9/2011"
	//alert(keyword);
	populate_ufo_table_filter(filter_option, keyword)	
});

viewall_btn.on("click", function() {
	//alert("viewall_btn");
	populate_ufo_table()
});	

function populate_ufo_table_filter(filter_option, keyword) {
	clear_table(ufo_table);
	markers.clearLayers();
	markerList = []
    
	var item_found = false;	

	if (keyword == "") {
		alert("Input Required!")
		return;
	}

	
    d3.json('/stationlocations', function(data) {  
      data["companies"].forEach((comp) => {
		found=false;
		if ("city"==filter_option.toLowerCase()) {
			if(comp.city.toLowerCase().includes(keyword.toLowerCase())) {
				found=true;
			}
		} else if("country"==filter_option.toLowerCase()) {
			if(comp.country.toLowerCase().includes(keyword.toLowerCase())) {
				found=true;
			}
		} else if("company"==filter_option.toLowerCase()) {
			if(comp.name.toLowerCase().includes(keyword.toLowerCase())) {
				found=true;
			}
		}
		if(found==true) {
			var row = ufo_table.append("tr").attr("id", "ufo-table-tr");
			var cell = row.append("td");
			cell.text(comp.city);
		   
			var cell = row.append("td");
			cell.text(comp.country);
  
			var cell = row.append("td");
			cell.text(comp.name);		

			marker = L.marker([comp.lat, comp.lng]);
			marker.bindPopup(comp.name + ", " + comp.city);
			markers.addLayer(marker);
			markerList.push(marker);

			item_found = true;	
		}

		
	  });

	  //console.log(markerList.length);

	  if(!item_found) {
		alert("Nothing Found!");
	  } else { // update map

			myMap.addLayer(markers);
			var m = markerList[Math.floor(Math.random() * markerList.length)];
				markers.zoomToShowLayer(m, function () {
					m.openPopup();
				});

		   	} 			
      
    });	

	
	
}

function populate_ufo_table() {
	
	clear_table(ufo_table);
	markers.clearLayers();

	//var queryUrl_1 = "http://api.citybik.es/v2/networks";	
    d3.json('/stationlocations', function(data) {
	  
		data["companies"].forEach((comp) => {
		var row = ufo_table.append("tr").attr("id", "ufo-table-tr");
		  
		var cell = row.append("td");
		  cell.text(comp.city);
		 
		  var cell = row.append("td");
		  cell.text(comp.country);

		  var cell = row.append("td");
		  cell.text(comp.name);

		
	  });      

    });	

	

	var marker = L.marker([43.653226, -79.3831843]);//.addTo(myMap);
	marker.bindPopup("Bike Share Toronto, Toronto");
	markers.addLayer(marker);
	
	myMap.addLayer(markers);

	myMap.setView(new L.LatLng(43.653226, -79.3831843), 3);
}

function clear_table(table) {
  
  d3.selectAll("#ufo-table-tr").remove();
}
	
function filter_select_onchange(select) {
	
	datetime_input.attr("placeholder", "");
}


///////////////////////////////////////////////////////////////////////////////

function createMap() {
	// Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    
  };

  

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      43.653226, -79.3831843
    ],
    zoom: 3,
    layers: [streetmap]
  });

  return myMap;

}