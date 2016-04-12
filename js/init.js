(function ($, L) {

  /* ------ Nav bar events Setup ------ */
  var mag = '1.0';
  var timespan = 'week';

  $('.time-span-dd').next().find('a').on('click', function () {
    $('.time-span-dd .dd-text').text($(this).text());
    timespan = $(this).attr('data-value');
    addLayer();
  });

  $('.mag-dd').next().find('a').on('click', function () {
    $('.mag-dd .dd-text').text($(this).text());
    mag = $(this).attr('data-value');
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
     fillColor: '#de2d26',
     color: '#000',
     weight: 1,
     opacity: 0.8,
     fillOpacity: 0.6,
   };

  /* ------ USGS feeds ------ */
  addLayer(); //initial load

  function addLayer() {
     if (earthquake) atlas.removeLayer(earthquake);

     var feed = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/' + mag + '_' + timespan + '.geojson';
     $( '.timestamp--loading' ).show();
     $.getJSON(feed, function (jsondata) {

       //update timestamp on nav bar
       var time = Math.round(($.now() - jsondata.metadata.generated) / 1000 / 60);
       var textTime = time == 1 ? '1 minute' : time + ' minutes';
       $('.timestamp').text(textTime);

       earthquake = L.geoJson(jsondata, {
         pointToLayer: function (feature, latlng) {
           var magnitude = feature.properties.mag;
           geojsonMarkerOptions.radius = Math.round(magnitude + 3);
           return L.circleMarker(latlng, geojsonMarkerOptions);
         },

         onEachFeature: function (feature, layer) {
           layer
            .on('mouseover', function (e) { showProbe(e); })
            .on('click', function (e) { gotoLink(e); })
            .on('mouseout', hideProbe );
         },
       }).addTo(atlas);
       $( '.timestamp--loading' ).hide();
     });
   }

  /* ------ Probe ------ */

  var probeTimeout;
  var highlighted;

  $('.probe')
     .on('mouseover', function () {
       clearTimeout(probeTimeout);
     })
     .on('mouseout', function () {
       probeTimeout = setTimeout(function () {
         $('.probe').hide();
       }, 100);
     });

  //atlas.on('click dragstart', hideProbe);
  
  function gotoLink(e) {
    window.open(e.target.feature.properties.url,'_blank');
  }
  
  function showProbe(e) {
     clearTimeout(probeTimeout);

     var props = e.target.feature.properties;
     $('.probe--mag').text(props.mag);
     $('.probe--place').text(props.place);

     var pointLocation = atlas.latLngToContainerPoint(e.target.getLatLng());

     $('.probe')
      .css({
        left: pointLocation.x - ($('.probe').width() / 2) - 11,
        top: pointLocation.y - ($('.probe').height()) + 2,
      })
      .show();
      
      highlighted = e.target;
      highlighted
        .bringToFront()
        .setStyle( { weight: 2 } );
   }

  function hideProbe(e) {
     $('.probe').hide();
     if( highlighted ){
       highlighted.setStyle( { weight: 1 } );
       highlighted = undefined;
    }
   }
})(jQuery, L);
