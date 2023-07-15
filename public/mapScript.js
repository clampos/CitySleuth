function initMap() {
  myMap = new google.maps.Map(document.getElementById("map"));

  navigator.geolocation.getCurrentPosition(
    function (position) {
      // Center on user's current location if geolocation prompt allowed
      var initialLocation = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );
      myMap.setCenter(initialLocation);
      myMap.setZoom(12);
    },
    function (positionError) {
      // User denied geolocation prompt - default to Charing Cross
      myMap.setCenter(new google.maps.LatLng(51.507, 0.1232));
      myMap.setZoom(12);
    }
  );
}
