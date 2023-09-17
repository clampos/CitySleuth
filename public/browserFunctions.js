function initialise() {
  var x = document.getElementById("location");

  // ----------------------------------------------------
  // Initial setting of map centred on user's location
  // A fetch() call to the Google Geocoding API is made to translate the user's lat and lng into the corresponding postal town and country
  // ----------------------------------------------------

  navigator.geolocation.watchPosition(function (position) {
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
  });
}
