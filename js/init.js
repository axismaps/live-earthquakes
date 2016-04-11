(function ($, L) {

  /* ------ Leaflet Setup ------ */
  var atlas = L.map('atlas').setView([20, 0], 3);
  var earthquake;

  L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
	   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
     subdomains: 'abcd',
     maxZoom: 19,
   }).addTo(atlas);

   /* ------ Default values ------ */
   var geojsonMarkerOptions = {
     radius: 8,
     fillColor: "#ff7800",
     color: "#000",
     weight: 1,
     opacity: 1,
     fillOpacity: 0.8
   };

   /* ------ USGS feeds ------ */
   addLayer('http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'); //initial load

   function addLayer(jsonLocation) {
     if (earthquake) atlas.removeLayer(earthquake);
     $.getJSON(jsonLocation, function (jsondata) {
       earthquake = L.geoJson(jsondata, {
         pointToLayer: function (feature, latlng) {
           return L.circleMarker(latlng, geojsonMarkerOptions);
         }
       }).addTo(atlas);
     });
   }
})(jQuery, L);
