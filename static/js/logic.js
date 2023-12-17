// Set url to read into geoJson (picked all earthquakes from past 7 days)
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// d3.json the url
d3.json(url).then(function(data){
    // console.log the data to verify the data output
    console.log(data)
    // after doing console.log(data.features) we see that it contains the desired coordinates
    console.log(data.features)
    earthquakesFunction(data.features);

    // Create earthquakesFunction() function. This function needs to create a popup for the earthquakes and add to map
    function earthquakesFunction(newData){

        // Create earthquake info to store the earthquake info from geoJSON
        let earthquakeInfo = L.geoJSON(newData,{
            // each earthquake has multiple components
            // popup binding
            onEachFeature: onEachFeature,
            // marker change to circle
            pointToLayer: pointToLayer,
            // color styling
            style: style
        });
        // Call newMap function
        newMap(earthquakeInfo);

        // Use onEachFeature function to bind the popup to every earthquake we have info for
        function onEachFeature(feature,layer){
            // Note that "Earthquake Depth" is the 3rd coordinate in coordinates array
            layer.bindPopup(`<h2>Location: ${feature.properties.place}</h2><hr><h4>
            Magnitude: ${feature.properties.mag}, Depth: ${feature.geometry.coordinates[2]}</h4>`);
        };

        // Use pointToLayer to change the markers to circles
        function pointToLayer(feature, latlng) {
            return L.circleMarker(latlng);
        };

        // Need this function to style the points on the map
        function style(feature) {
            return {
              opacity: 1,
              fillOpacity: 1,
              fillColor: getColor(feature.geometry.coordinates[2]),
              color: "#000000",
              radius: getRadius(feature.properties.mag),
              stroke: true,
              weight: 0.5
            };
          };
        
        // gets color of points
        function getColor(data){
            // return specific colors for specific ranges
            if (data>90)
            return 'red'
            else if (data>70)
            return 'orange'
            else if (data>50)
            return 'gold'
            else if (data>30)
            return 'yellow'
            else if (data>10)
            return 'lime'
            else
            return 'green'
        };

        function getRadius(data){
            // make value really small if magnitude was non-existent
            if (data == 0)
            return 0.001
            else
            // multiply by 2 to make markers larger/easier to see
            return data * 2
        };

        // Create function to create new map to hold everything, which takes earthquakeInfo input
        function newMap(earthquakeInfo){
            // create tileLayer to show map
            let streetTile =  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            });
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

            // Used leaflet provided code to help creating the legend
            var legend = L.control({position: 'bottomright'});

            legend.onAdd = function () {
                // Create ranges where data changes colors
                var div = L.DomUtil.create('div', 'info legend'),
                    colorRanges = [-10, 10, 30, 50, 70, 90],
                    colors = ['green','lime','yellow','gold','orange','red']
                
                // for loop to style legend in bottom right corner
                for (var i = 0; i < colorRanges.length; i++) {
                    div.innerHTML += '<i style="background:' + colors[i] + '"></i> ' +
                        colorRanges[i] + (colorRanges[i + 1] ? '&ndash;' + colorRanges[i + 1] + '<br>' : '+');
                }

                return div;
            };
            // add legend to the map
            legend.addTo(myMap);
        }

    }
});