// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// apiKey = "d3c8c525fef446aa8fb30692c753cdf6";
// global variables

// build URL
function buildGetCoord() {
  let getCoord = "https://api.openweathermap.org/data/2.5/weather?";
  let coordParams = {
    "q": $("#cityName").val(),
    "appid": "d3c8c525fef446aa8fb30692c753cdf6"
  }
  console.log(getCoord + $.param(coordParams));
  return getCoord + $.param(coordParams);
  //parse to get coords
}

function buildOneCall() {


}

//click functions
// first call, city name gets coords
$("#searchBtn").click(function (event) {
  event.preventDefault();
  let getCoord = buildGetCoord();
  console.log(getCoord);
  $.ajax({
    url: getCoord,
    method: "GET"
  }).then(function (response) {
    console.log(response);
  })

  // $(".form-control").val("");

});
//use response to get lat and lon

//run api call with lat and lon to get current weather and display

//run api call with lat and lon to get five day forecast and display

//localstorage city list, when clicked display current weather & forecast
//localstorage last search display on refresh