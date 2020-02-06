var earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(earthquake_url, function(data){

    
    console.log(data.features);

    function createFeatures(earthquakeData) {

        function onEachFeature(feature, layer) {
          layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        }
      
        function radiusSize(magnitude) {
          return magnitude * 20000;
        }
      
      
        function circleColor(magnitude) {
          if (magnitude < 1) {
            return "#ccff33"
          }
          else if (magnitude < 2) {
            return "#ffff33"
          }
          else if (magnitude < 3) {
            return "#ffcc33"
          }
          else if (magnitude < 4) {
            return "#ff9933"
          }
          else if (magnitude < 5) {
            return "#ff6633"
          }
          else {
            return "#ff3333"
          }
        }
      
      
        var earthquakes = L.geoJSON(earthquakeData, {
          pointToLayer: function(earthquakeData, latlng) {
            return L.circle(latlng, {
              radius: radiusSize(earthquakeData.properties.mag),
              color: circleColor(earthquakeData.properties.mag),
              fillOpacity: 1
            });
          },
          onEachFeature: onEachFeature
        });
      
        createMap(earthquakes);
      }
      
      function createMap(earthquakes) {
      
      
        var outdoorsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
          attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
          maxZoom: 18,
          id: "mapbox.outdoors",
          accessToken: API_KEY
        });
      
        var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
          attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
          maxZoom: 18,
          id: "mapbox.satellite",
          accessToken: API_KEY
        });
      
        var grayscalemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
          attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
          maxZoom: 18,
          id: "mapbox.light",
          accessToken: API_KEY
        });
      
        // Create the faultline layer
        var faultLine = new L.LayerGroup();
        
        // Define a baseMaps object to hold our base layers
        var baseMaps = {
          "Outdoor Map": outdoorsmap,
          "Greyscale Map": grayscalemap,
          "Satellite Map": satellitemap
        };
      
        // Create overlay object to hold our overlay layer
        var overlayMaps = {
          Earthquakes: earthquakes,
          FaultLines: faultLine
        };
      
        // Create our map, giving it the streetmap and earthquakes layers to display on load
        var myMap = L.map("map", {
          center: [
            37.09, -95.71
          ],
          zoom: 4,
          layers: [outdoorsmap, earthquakes, faultLine]
        });
      
        // Create a layer control
        // Pass in our baseMaps and overlayMaps
        // Add the layer control to the map
        L.control.layers(baseMaps, overlayMaps, {
          collapsed: false
        }).addTo(myMap);
      
        // Query to retrieve the faultline data
        var faultlinequery = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";
        
        // Create the faultlines and add them to the faultline layer
        d3.json(faultlinequery, function(data) {
          L.geoJSON(data, {
            style: function() {
              return {color: "orange", fillOpacity: 0}
            }
          }).addTo(faultLine)
        })
      
        function fillScale(mag) {
          switch(true) {
              case mag < 1:
                  return '#CCFF33';
                  break;
              case mag < 2:
                  return '#FFFF33';
                  break;
              case mag < 3:
                  return '#FFCC33';
                  break;
              case mag < 4:
                  return '#FF9933';
                  break;
              case mag < 5:
                  return '#FF6633';
                  break;
              default:
                  return '#FF3333';
          }
      }
  
      data.features.forEach(d => {
          L.circleMarker([d.geometry.coordinates[1], d.geometry.coordinates[0]], {
              fillOpacity: 0.9,
              color: 'black',
              weight: 1,
              fillColor: fillScale(d.properties.mag),
              radius: d.properties.mag * 7
          }).bindPopup("Magnitude: " + d.properties.mag
                          + "<br>Location: " + d.properties.place).addTo(map);
      });
  
      var legend = L.control({ position: 'bottomright'});
      legend.onAdd = function() {
          var div = L.DomUtil.create('div', 'info legend');
          var limits = [0, 1, 2, 3, 4, 5];
          
          limits.forEach((l, i) => {
              div.innerHTML +=  '<i style="background-color:' + fillScale(l) + '"></i> '
              + l + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');
          });
          return div;
      };
      
      legend.addTo(map);
      
      }


        createFeatures(data.features);
})