document.addEventListener("DOMContentLoaded", async function () {
  const searchButton = document.getElementById("searchButton");
  const searchKeyword = document.getElementById("searchKeyword");
  const resultsDiv = document.getElementById("results");
  const mapContainer = document.getElementById("mapContainer");

  // ----------------------------------------------------
  // Initial configuration of map following place search request (note duplication of function in browserFunctions.js)
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
  // place-search functionality, consisting of eventListener for search bar and fetch() request to send lat, lng and search keyword to browser
  // Once the server returns the response, the browser updates to display the search results
  // ----------------------------------------------------

  searchButton.addEventListener("click", function (event) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const keyword = searchKeyword.value;

        // ----------------------------------------------------

        await fetch("/place-search", {
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
              placeDiv.innerHTML = `<strong>${placeName}</strong><br>Address:&nbsp;${placeAddress}<br>Google Reviews Rating:&nbsp;${placeRating}
          <button class="mark-visited" placeId="${result.place_id}" placeName="${result.name}" placeAddress="${result.formatted_address}">Mark as visited</button><br><br>`;

              resultsDiv.appendChild(placeDiv);

              // ----------------------------------------------------
              // Update of map to display search result markers
              // ----------------------------------------------------

              const marker = new google.maps.Marker({
                position: placeLatLng,
                map: map,
                title: placeName,
              });

              markers.push(marker);
            });

            // ----------------------------------------------------
            // Resetting the map bounds to accommodate all markers
            // ----------------------------------------------------

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

  initMap();

  // ----------------------------------------------------
  // mark-visited function, consisting of eventListener for parent element of search result divs
  // Upon clicking a mark-visited button, a fetch() call sends the place information to the server to be handled
  // ----------------------------------------------------
});

const markVisitedButtonsContainer = document.querySelector("#results");
markVisitedButtonsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("mark-visited")) {
    console.log("eventlistener");
    const placeId = event.target.getAttribute("placeId");
    const placeName = event.target.getAttribute("placeName");
    const placeAddress = event.target.getAttribute("placeAddress");
    event.target.innerHTML = "Visited!";
    console.log(placeId, placeName, placeAddress);
    markVisited(placeId, placeName, placeAddress);
  }
});

// ----------------------------------------------------

function markVisited(placeId, placeName, placeAddress) {
  console.log("fetch function");
  fetch(`/marked-visited`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ placeId, placeName, placeAddress }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
}
