
// 1. Create the map object: 
let map = L.map("map-id", {
  center: [0,0],
  zoom: 2.5
});

// 2. Add streets map tile: 
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(map);

// 3. Insert legend to show earthquake magnitude & associated color:
let legend = L.control({position: "bottomright"});
legend.onAdd = function(map) {
    let div = L.DomUtil.create("div", "info legend");
    div.innerHTML += "<h4>Earthquake Classification</h4>";
    div.innerHTML += '<i style="background: #107C10"></i><span>Light: <=4.9</span><br>';
    div.innerHTML += '<i style="background: #E6FF00"></i><span>Moderate: <=5.9</span><br>';
    div.innerHTML += '<i style="background: #FAA005"></i><span>Strong: <=6.9</span><br>';
    div.innerHTML += '<i style="background: #E10F00"></i><span>Major: <7.9</span><br>';
    return div;
};
legend.addTo(map);

// 4. Create markers and tooltips:  
function createMarkers(features, latlng) {
    let mag = features.properties.mag;
    let place = features.properties.place;
      if (mag <= 4.9){
          var color = "green"
      } else if (mag <= 5.9){
          var color = "yellow"
      } else if (mag <= 6.9){
          var color = "orange"
      } else {
          var color = "red"
      }
    let mark = {
      radius: mag * 3,
      color: color,
      weight: 1,
      fillOpacity: 0.5,
    }
    return L.circleMarker(latlng, mark).bindPopup(`<h4> Earthquake Location: ${place} </h4> <hr> <h5>Magnitude: ${mag}</h5>`);
  };
  
// 5. Link to the earthquakes and tectonic plates geoJsons: 
  let earthquakeInfo = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
  let platesInfo = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";
  
  // 6. Connect to the geoJson API using D3: 
  d3.json(earthquakeInfo, function(earthquakes){
    d3.json(platesInfo, function(plates){
      let plateStyle = {
        "color": "lightblue",
        "weight": 5,
        "opacity": 1
      };
      // Add plate tectonics layer to map: 
      let plateLayer = L.geoJson(plates, {
        style: plateStyle
      });
      plateLayer.addTo(map)
      // Add earthquakes and markers layer to map:
      let earthquakesLayer = L.geoJson(earthquakes, {
        pointToLayer: createMarkers
      });
      earthquakesLayer.addTo(map);
    });
  });
  





