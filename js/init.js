(function ($, L) {

  /* ------ Leaflet Setup ------ */
  var atlas = L.map('atlas').setView([20, 0], 3);

  L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
	   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
     subdomains: 'abcd',
     maxZoom: 19,
   }).addTo(atlas);

})(jQuery, L);
