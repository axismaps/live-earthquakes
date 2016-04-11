(function ($, L) {

  /* ------ Nav bar events Setup ------ */
  var mag = 'all';
  var timespan = 'week';

  $('.time-span-dd').next().find('a').on('click', function () {
    $('.time-span-dd').next().find('a.bg-info').removeClass('bg-info');
    $(this).addClass('bg-info');
    timespan = $(this).attr('data-target');
    addLayer();
  });

  $('.mag-dd').next().find('a').on('click', function () {
    $('.mag-dd').next().find('a.bg-info').removeClass('bg-info');
    $(this).addClass('bg-info');
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
     fillColor: "#de2d26",
     color: "#000",
     weight: 1,
     opacity: 0.8,
     fillOpacity: 0.6
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
           var magnitude = feature.properties.mag;
           geojsonMarkerOptions.radius = Math.round(magnitude);
           return L.circleMarker(latlng, geojsonMarkerOptions);
         },
         onEachFeature: function (feature, layer) {
           layer
            .on('mouseover', function (e) { showProbe(e); })
            .on('mouseout', hideProbe);
         }
       }).addTo(atlas);
     });
   }

   /* ------ Probe ------ */

   var probeTimeout;

   $('.probe')
     .on('mouseover', function () {
       clearTimeout(probeTimeout);
     })
     .on('mouseout', function () {
       probeTimeout = setTimeout(function () {
         $('.probe').hide();
       }, 100);
     });

   function showProbe(e) {
     clearTimeout(probeTimeout);

     var props = e.target.feature.properties;
     $('.probe--mag').text(props.mag);
     $('.probe--place').text(props.place);
     $('.probe--url').html('<a href="' + props.url + '">' + props.url + '</a>');

     $('.probe')
      .css({
        left: e.layerPoint.x - $('.probe').width() / 2,
        top: e.layerPoint.y - $('.probe').height(),
      })
      .show();
   }

   function hideProbe() {
     probeTimeout = setTimeout(function () {
       $('.probe').hide();
     }, 200);
   }
})(jQuery, L);
