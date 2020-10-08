// ----global variables----

// ----build URLs----
// build url to call that enters user's city name and returns response with lat and lon coordinates
// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
function buildGetCoord() {
  let getCoord = "https://api.openweathermap.org/data/2.5/weather?";
  let coordParams = {
    "q": $("#cityName").val(),
    "appid": "d3c8c525fef446aa8fb30692c753cdf6"
  }
  console.log(getCoord + $.param(coordParams));
  return getCoord + $.param(coordParams);
}

// build url to one call for data to be used for display
//https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
function buildOneCall(latvar, lonvar) {
  let oneCall = "https://api.openweathermap.org/data/2.5/onecall?";
  let oneCallParams = {
    "lat": latvar,
    "lon": lonvar,
    "appid": "d3c8c525fef446aa8fb30692c753cdf6"
  }
  console.log(oneCall + $.param(oneCallParams));
  return oneCall + $.param(oneCallParams);
}

// ----click function----
$("#searchBtn").click(function (event) {
  // prevent browser defaults on click
  event.preventDefault();

  // ------add city name to city list using local storage, make link clickable------

  let getCoord = buildGetCoord();
  // current weather api call to get lat and lon coordinates for user entered city
  $.ajax({
    url: getCoord,
    method: "GET"
    //when current weather api call is done, log response and pull lat and lon to be used as parameters in next call
  }).done(function (response) {
    console.log(response);
    let lat = response.coord.lat;
    let lon = response.coord.lon;
    console.log(lat);
    console.log(lon);
    // insert lat and lon into parameters
    let oneCall = buildOneCall(lat, lon);
    // api call to one call api to get data to be displayed
    $.ajax({
      url: oneCall,
      method: "GET"
    }).then(function (response) {
      console.log(response);
    })

  });
})

//localstorage set function for  city list, when clicked display current weather & forecast, move function above click function
//localstorage get function to display city list, move function above click function
//localstorage last search display on refresh, move function above click function

// ----extras if finished early----
//css styling
//make input box clear when submitting
//make it so submit can work on return button as well