(function ($, L) {

  /* ------ Nav bar events Setup ------ */
  var mag = 'all';
  var timespan = 'week';

  $('.time-span-dd').next().find('a').on('click', function () {
    timespan = $(this).attr('data-target');
    addLayer();
  });

  $('.mag-dd').next().find('a').on('click', function () {
    mag = $(this).attr('data-target');
    addLayer();
  });

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
   addLayer(); //initial load

   function addLayer() {
     if (earthquake) atlas.removeLayer(earthquake);

     var feed = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/' + mag + '_' + timespan + '.geojson';
     $.getJSON(feed, function (jsondata) {
       $('.current-feed').text(jsondata.metadata.title);
       earthquake = L.geoJson(jsondata, {
         pointToLayer: function (feature, latlng) {
           return L.circleMarker(latlng, geojsonMarkerOptions);
         }
       }).addTo(atlas);
     });
   }
})(jQuery, L);
