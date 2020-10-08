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

//-----functions-----

//localstorage set function for city list, when clicked display current weather & forecast
// working DONT MESS WITH IT
// make this a set so no dupes
function storeCity() {
  let storageVal = $("#cityName").val();
  console.log(storageVal + " <-this is the storage info");
  let getCityArr = !!localStorage.getItem('city-entered') ? JSON.parse(localStorage.getItem('city-entered')) : [];
  getCityArr.push(storageVal);
  localStorage.setItem("city-entered", JSON.stringify(getCityArr));
  getCity();
}
//localstorage get function to display city list
//working DONT MESS WITH IT
function getCity() {
  let $cityHistory = $("ul#city-history");
  $cityHistory.empty();
  let getCityArr = !!localStorage.getItem('city-entered') ? JSON.parse(localStorage.getItem('city-entered')) : [];
  console.log(getCityArr);
  for (i = 0; i < getCityArr.length; i++) {
    let cityLi = $("<li>");
    cityLi.text(getCityArr[i]);
    $cityHistory.prepend(cityLi);
  }
}
getCity();

// convert dt in response to date
function convertEpoch(dt) {
  var d = new Date(dt * 1000);
  return d.toLocaleDateString();
}

//convert K to F
function convertKtoF(tempInKelvin) {
  // (360K − 273.15) × 9/5 + 32 = 188.33°F
  return Math.round(((tempInKelvin - 273.15) * 9) / 5 + 32);
}

// build current weather
function showCurrent(cityName, currentDate, currentIcon, currentTemp, currentHumid, currentWind, currentUV) {
  $("#searchedName").text(cityName);
  $("#currentDate").text(currentDate);
  $("#currentIcon").attr("src", "http://openweathermap.org/img/wn/" + currentIcon + "@2x.png")
  $("#currentTemp").text(currentTemp + "\xB0F");
  $("#currentHumid").text(currentHumid + "%");
  $("#currentWind").text(currentWind + " MPH");
  $("#currentUV").text(currentUV);
}

// build forecast weather
function showForecast(response) {
  let $fiveForecast = $("#fiveForecast")
  for (i = 0; i < 5; i++) {
    let card = $("<div>");
    card.attr("class", "card");
    $fiveForecast.append(card);
    let cardBody = $("<div>");
    cardBody.attr("class", "card-body")
    card.append(cardBody);

    console.log(response.daily[i].temp.day);
    let forecastDate = convertEpoch(response.daily[i].dt);
    let h5 = $("<h5>");
    h5.text(forecastDate);
    cardBody.append(h5);

    console.log(response.daily[i].weather[0].icon);
    let forecastIcon = response.daily[i].weather[0].icon;
    let imgIcon = $("<img>");
    imgIcon.attr("src", "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png");
    cardBody.append(imgIcon);

    let forecastTemp = convertKtoF(response.daily[i].temp.day);
    let tempDiv = $("<div>");
    tempDiv.text(forecastTemp + "\xB0F");
    cardBody.append(tempDiv);

    let forecastHumid = response.daily[i].humidity;
    let humidDiv = $("<div>");
    humidDiv.text(forecastHumid + "%");
    cardBody.append(humidDiv);
  }
}

// ----click function----
$("#searchBtn").click(function (event) {
  // prevent browser defaults on click
  event.preventDefault();

  storeCity();

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
      let dt = response.current.dt;
      let currentDate = convertEpoch(dt);
      let currentIcon = response.current.weather[0].icon;
      console.log(currentIcon);
      let tempInKelvin = response.current.temp;
      console.log(tempInKelvin);
      let currentTemp = convertKtoF(tempInKelvin.toString());
      let currentHumid = response.current.humidity;
      let currentWind = Math.round(response.current.wind_speed);
      let currentUV = response.current.uvi;
      showCurrent($("#cityName").val(), currentDate, currentIcon, currentTemp, currentHumid, currentWind, currentUV);
      showForecast(response);
    })

  });
})


//localstorage last search display on refresh, move function above click function
//bootstrap finishing
//css styling
//make city array a set so no dupes
// ----extras if finished early----
//make input box clear when submitting
//make it so submit can work on return button as well