// ----------------------------------------------------

async function placeResults() {
  navigator.geolocation.getCurrentPosition(async function (position) {
    const searchItem = document.getElementById("userInput").value;
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${position.coords.latitude},${position.coords.longitude}&radius=4800&type=${searchItem}&key=AIzaSyAwvO4w6URyS1Rs15buwNKrF8xCPB9vJRA`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        let places = data.results.map(extractPOIInfo);
        var y = document.getElementById("results");
        y.innerHTML = places;
      })
      .catch((err) =>
        alert(
          "Oops, looks like there's an error getting your results",
          err.message
        )
      );
  });
}

// ----------------------------------------------------

function extractPOIInfo(place) {
  const name = place.name;

  const formattedAddress = place.formattedAddress;

  const type = place.types[0];

  const geometry = place.geometry;

  const latitude = geometry.location.lat();

  const longitude = geometry.location.lng();

  return {
    name,
    formattedAddress,
    type,
    latitude,
    longitude,
  };
}

// ----------------------------------------------------

// function placeResults1() {
//   var config = {
//     method: "get",
//     url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522%2C151.1957362&radius=4800&type=restaurant&keyword=cruise&key=YOUR_API_KEY",
//     headers: {},
//   };

//   axios(config)
//     .then(function (response) {
//       console.log(JSON.stringify(response.data));
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// }
