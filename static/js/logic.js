// Set url to read into geoJson (picked all earthquakes from past 7 days)
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// d3.json the url
d3.json(url).then(function(data){
    // console.log the data to verify the data output
    console.log(data)
    // after doing console.log(data.features) we see that it contains the desired coordinates
    console.log(data.features)
    earthquakesFunction(data.features);
});

// create tileLayer to show map
let streetTile =  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create earthquakesFunction() function. This function needs to create a popup for the earthquakes and add to map
function earthquakesFunction(newData){

    // Create earthquake info to store the earthquake info from geoJSON
    let earthquakeInfo = L.geoJSON(newData,{
        onEachFeature: onEachFeature
    });
    // Call newMap function
    newMap(earthquakeInfo);

    // Use onEachFeature function to bind the popup to every earthquake we have info for
    function onEachFeature(feature,layer){
        // Note that "Earthquake Depth" is the 3rd coordinate in coordinates array
        layer.bindPopup(`<h2>Location: ${feature.properties.place}</h2><hr><h4>
        Magnitude: ${feature.properties.mag}, Depth: ${feature.geometry.coordinates[2]}</h4>`);
    }

}

// Create function to create new map to hold everything, which takes earthquakeInfo input
function newMap(earthquakeInfo){

    // Create baseMaps and overlayMaps to hold the base map and the earthquake layer
    let baseMaps = {
        "Map": streetTile
    };

    let overlayMaps = {
        Earthquakes: earthquakeInfo
    };

    // Create myMap object to store the center of the map/zoom
    let myMap = L.map("map",{
        // Centered the map at the center of the USA
        center: [37.0902, -95.7129],
        zoom: 4,
        layers: [streetTile,earthquakeInfo]
    });

    // Create layer control to store all map info
    L.control.layers(baseMaps,overlayMaps,{
        collapsed: false
    }).addTo(myMap);

}