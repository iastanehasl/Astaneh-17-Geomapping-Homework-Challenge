// Define Earthquake Data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    // var earthquakeData = data.features;
    createFeatures(data.features);
});

// Define markers layer for map

function createFeatures(earthquakeData){
    
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + 
        "</p><hr><p>" + "Magnitude: " + feature.properties.mag + "</p>");
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {

            var color = "";
            if (Math.floor(feature.properties.mag) < 1) {
                color = "#90ee90"; //light green
            }
            else if (Math.floor(feature.properties.mag) < 2) {
                color = "green";
            }
            else if (Math.floor(feature.properties.mag) < 3) {
                color = "yellow";
            }
            else if (Math.floor(feature.properties.mag) < 4) {
                color = "orange";
            }
            else if (Math.floor(feature.properties.mag) < 5) {
                color = "red";
            }
            else if (Math.floor(feature.properties.mag) < 6) {
                color = "#5c0003"; //dark red
            }
            var geojsonMarkerOptions = {
                radius: feature.properties.mag * 7,
                fillColor: color,
                color: "black",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            return L.circleMarker(latlng, geojsonMarkerOptions); 
        }    
    });
    
    createMap(earthquakes); 
}

// Define Map
function createMap(earthquakes) {

    // Define streetmap layer
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: "pk.eyJ1IjoiY2VjaW5kMTIzIiwiYSI6ImNrNGFocWl4bzA0NmMza3BlcXM3NDRqeWcifQ.WfOdm4B4MuJlQpoNKvLiXA"
    });


    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Define baseMaps object
    var baseMaps = {
        "Street Map": streetmap
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

}
