function createMap(bikeNetworks) {
    
    // Create the tile layer that will be the background of our map
    var streetsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
  
    
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Streets Map": streetsmap,
      };
  
    // Create an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
      "Bike Networks": bikeNetworks
    };
  
    // Create the map object with options
    var map = L.map("map-id", {
      center:[40.758896,  -73.985130],
      zoom: 13,
      layers: [streetsmap, bikeNetworks]
    });

   // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
    
}
  
function createMarkers(response) {
    console.log(response);
    stations=response.companies;
    
    // Initialize an array to hold bike markers
    var citibikeMarkers = [];
    
  
    // Loop through the stations array
    for (var i = 0; i < stations.length; i++) {
       
        if (stations[i].name==='Citi Bike'){
            
            var citibike=stations[i]

            for(var j=0;j<citibike.stations.length; j++){
                var station=citibike.stations[j];
                citibikeMarker=L.marker([station.latitude, station.longitude]).bindPopup("<h5>"+station.name+"<hr><br> Available bikes: "+station.free_bikes+"</h5>");
                citibikeMarkers.push(citibikeMarker);
                }

        
            }
      
    }
   
    // Create a layer group made from the bike markers array, pass it into the createMap function
    createMap(L.layerGroup(citibikeMarkers));
    
  }
  
  d3.json("/stationlocations",createMarkers); 