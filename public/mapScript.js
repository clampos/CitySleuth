function initMap() {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      var latLng = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );
      var mapOptions = {
        zoom: 10,
        center: latLng,
      };

      myMap = new google.maps.Map(document.getElementById("map"), mapOptions);

      var marker = new google.maps.Marker({
        position: latLng,
      });

      marker.setMap(myMap);
    },
    function (positionError) {
      myMap.setCenter(new google.maps.LatLng(51.507, 0.1232));
      myMap.setZoom(10);
    }
  );
}
