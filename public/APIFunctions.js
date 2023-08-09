document.addEventListener("DOMContentLoaded", async function () {
  const searchButton = document.getElementById("searchButton");
  const searchKeyword = document.getElementById("searchKeyword");
  const resultsDiv = document.getElementById("results");
  const mapContainer = document.getElementById("mapContainer");

  // ----------------------------------------------------

  let map;
  let markers = [];
  var LAT;
  var LNG;
  function initMap() {
    navigator.geolocation.getCurrentPosition(function (position) {
      LAT = position.coords.latitude;
      LNG = position.coords.longitude;
      map = new google.maps.Map(mapContainer, {
        center: { lat: LAT, lng: LNG },
        zoom: 15,
      });
    });
  }

  // ----------------------------------------------------

  searchButton.addEventListener("click", function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const keyword = searchKeyword.value;

        // ----------------------------------------------------

        fetch("/searchPlaces", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ latitude, longitude, keyword }),
        })
          .then((response) => response.json())
          .then((data) => {
            resultsDiv.innerHTML = "";
            markers.forEach((marker) => marker.setMap(null));
            markers = [];

            data.results.forEach((result) => {
              const placeName = result.name;
              const placeAddress = result.formatted_address;
              const placeRating = result.rating || "N/A";
              const placeLatLng = result.geometry.location;

              const placeDiv = document.createElement("div");
              placeDiv.innerHTML = `<strong>${placeName}</strong><br>Address: ${placeAddress}<br>Rating: ${placeRating}
          <button class="visitor" data-place-id="${result.place_id}" placeName="${result.name}" placeAddress="${result.formatted_address}">Mark as Visited</button><br><br>`;

              resultsDiv.appendChild(placeDiv);

              const markVisitedButtons = document.querySelectorAll(".visitor");
              markVisitedButtons.forEach((button) => {
                button.addEventListener("click", function () {
                  console.log("eventlister");
                  const placeId = this.getAttribute("data-place-id");
                  const placeName = this.getAttribute("placeName");
                  const placeAddress = this.getAttribute("placeAddress");
                  markVisited(placeName);
                });
              });

              function markVisited(placeName) {
                console.log("fetch function");
                fetch(`/markVisited`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ placeName }),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    console.log(data);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }

              const marker = new google.maps.Marker({
                position: placeLatLng,
                map: map,
                title: placeName,
              });

              markers.push(marker);
            });

            const bounds = new google.maps.LatLngBounds();
            markers.forEach((marker) => bounds.extend(marker.getPosition()));
            map.fitBounds(bounds);
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }
  });

  // ----------------------------------------------------

  // ----------------------------------------------------

  // ----------------------------------------------------

  initMap();

  // ----------------------------------------------------
});
