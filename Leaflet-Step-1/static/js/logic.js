var Maps = L.map("map", {
    center: [17, -4 ],
    zoom: 2
  }); 
  
  // How to add a tile layer:

  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 15,
    id: "mapbox.streets",
    accessToken: "pk.eyJ1IjoiYXJpdmFyZ2FzYiIsImEiOiJjazByYm16ajIwNG1kM25zN2M4dDRmNGQyIn0.Ya-5ppfCOpgBtfNonUAhCQ"    
  }).addTo(Maps);
  

// All earthquakes in the past 7 Days:
  var json = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  function getColor(richterscale) {
    return      richterscale >= 6.5  ? '#e23b1b':
    richterscale >= 6  ? '#d94c21' :    
    richterscale >= 5.5  ? '#f7a307' :
    richterscale >=5  ? '#f2c774':
     '#fcf8a4';   
} 

//   var array = [];

  d3.json(json, function(data) {
  var earth=data.features;
  for (var i = 0; i < earth.length; i++) {
    var Place = [earth[i].geometry.coordinates[1],earth[i].geometry.coordinates[0]]

    var geojson;
    geojson = L.circle(Place, {
            fillOpacity: 0.80,
            mag: earth[i].properties.mag,
            color: getColor(earth[i].properties.mag),
            fillColor: getColor(earth[i].properties.mag),
            // Adjust radius
            radius: Math.round(earth[i].properties.mag*100000)
          }).bindPopup("<h2>Place: " + earth[i].properties.place + "</h2> <hr> <h3>Magnitude: " +earth[i].properties.mag  +  "</h3>").addTo(Maps);
        };

});

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend'),
    richterscale = [0, 5, 5.5, 6, 6.5],
		labels = [];

	// Code loops through scale intervals and generates label with a colored popup for each interval
	for (var i = 0; i < richterscale.length; i++) {
    div.innerHTML +=
			'<i style="background-color:' + getColor(richterscale[i]) + ';">&nbsp&nbsp;</i> ' +
			richterscale[i] + (richterscale[i + 1] ? '-' + (richterscale[i + 1]-.1) + '<br>' : '+');
	}

	return div;
};

legend.addTo(Maps);