function initialise() {
  var x = document.getElementById("location");
  // alert(
  //   "This application is accessing your location. If you do not want the application to do this, please update your browser settings."
  // );
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

      const LAT = position.coords.latitude;
      const LNG = position.coords.longitude;
      let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${LAT},${LNG}
                                                                          &key=AIzaSyAwvO4w6URyS1Rs15buwNKrF8xCPB9vJRA`;
      let town;
      let country;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          let parts = data.results[0].address_components;
          parts.forEach((part) => {
            if (part.types.includes("postal_town")) {
              town = `${part.long_name}`;
            }
            if (part.types.includes("country")) {
              country = `${part.long_name}`;
            }
            x.innerHTML = `Looks like you're in ${town},&nbsp;${country}.&nbsp;Want to see what's available near you?`;
          });
        })
        .catch((err) => console.warn(err.message));
    },
    function (positionError) {
      myMap.setCenter(new google.maps.LatLng(51.507, 0.1232));
      myMap.setZoom(10);
    }
  );
}
