
var mainMap = null;

function createMap(bikeNetworks) {

  // Create the tile layer that will be the background of our map
  var streetsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});
  

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Streets Map": streetsmap,
    "Light Map" : lightmap
  };

  // Create an overlayMaps object to hold the bikeStations layer
  var overlayMaps = {
    "Bike Networks": bikeNetworks
  };

  // Create the map object with options
  var map = L.map("map-id", {
    center:[20.50, 10.68],
    zoom: 3,
    layers: [streetsmap, bikeNetworks]
  });
  mainMap = map;
  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
  
  
}

function createMarkers(response) {
  //console.log(response);
  stations=response.companies;
  
  // Initialize an array to hold bike markers
  var bikeNetworkMarkers = [];
  

  // Loop through the stations array
  for (var i = 0; i < stations.length; i++) {
    
     var bikeNetworkMarker = L.marker([stations[i].lat, stations[i].lng])//,{riseOnHover:true,icon: myIcon})
      .bindPopup('<h5><button id="'+stations[i].id+'" class=button_sm onclick="test()">'+stations[i].name+"</button><hr>"+stations[i].city +", "+ stations[i].country+"</h5>")
      .openPopup();
    // Add the marker to the bikeMarkers array
     bikeNetworkMarkers.push(bikeNetworkMarker);
    
  }
 
  // Create a layer group made from the bike markers array, pass it into the createMap function
  createMap(L.layerGroup(bikeNetworkMarkers));
  
}

d3.json("/stationlocations",createMarkers);

function test (){
  var companyName = document.getElementsByClassName("button_sm").item(0).id;
  //console.log(companyName);

  d3.json("/stationlocations", function(data){
    console.log(data)
 
    var stationMarkers=[];
    var stationMarker;
    var currentCompany;
    for(var i=0;i<data.companies.length;i++){
    
      if(data.companies[i].id===companyName){
        currentCompany=data.companies[i];

        mapLat=data.companies[i].lat;
        mapLng=data.companies[i].lng;
        stationsLength=data.companies[i].stations.length;
        if(stationsLength==0){
          stationMarker=L.marker([data.companies[i].lat, data.companies[i].lng]).bindPopup("<h5>"+data.companies[i].name+"</h5>");
          stationMarkers.push(stationMarker);
        }
        else{
          for(var j=0;j<data.companies[i].stations.length; j++){
          var station=data.companies[i].stations[j];
          stationMarker=L.marker([station.latitude, station.longitude]).bindPopup("<h5>"+station.name+"</h5>");
          stationMarkers.push(stationMarker);
          }
        }
        break;
      }
    }
    
    //console.log("Before:"+document.getElementById('map-id').innerHTML);
    document.getElementById('map-id').innerHTML = "<div id='map-id'></div>";
    //console.log("After:"+document.getElementById('map-id').innerHTML);

    mainMap.remove();

    stationMarkersLayer=L.layerGroup(stationMarkers);
    //console.log("stationMarkersLayer:" +stationMarkersLayer);
    
    var streetsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
    var map1 = L.map("map-id", {
        center:[mapLat, mapLng],
        zoom: 10,
        layers: [streetsmap, stationMarkersLayer]
    });  
    mainMap=map1;
    var group = L.featureGroup(stationMarkers);
    mainMap.fitBounds(group.getBounds());
    console.log(stationMarkersLayer);
    stationMarkersLayer.addTo(mainMap);

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      
  
      div.innerHTML='<div style="background-color:white; border: 1px; border-style: solid; border-color: black;"><p>'+
      '<div class="legend_c"><font size="+2"><b>'+currentCompany.name+"</b></font></div>"+
      '</p><p class="legend_t"><font size="+1"><b>'+currentCompany.city+', '+currentCompany.country+'</b></font></p></div>';
     
     
      return div;
  };
  legend.addTo(mainMap);

    

  }); 
  
    
    
    
  };


