// ----global variables----
let searchedCity = "";
// ----build URLs----

// build url to call that enters user's city name and returns response with lat and lon coordinates
// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
function buildGetCoord() {
  let getCoord = "https://api.openweathermap.org/data/2.5/weather?";
  let coordParams = {
    q: searchedCity,
    appid: "d3c8c525fef446aa8fb30692c753cdf6",
  };
  console.log(getCoord + $.param(coordParams));
  return getCoord + $.param(coordParams);
}

// build url to one call for data to be used for display
//https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
function buildOneCall(latvar, lonvar) {
  let oneCall = "https://api.openweathermap.org/data/2.5/onecall?";
  let oneCallParams = {
    lat: latvar,
    lon: lonvar,
    appid: "d3c8c525fef446aa8fb30692c753cdf6",
  };
  console.log(oneCall + $.param(oneCallParams));
  return oneCall + $.param(oneCallParams);
}

//-----functions-----

// change user input to title case
function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

//localstorage set function for city list, when clicked display current weather & forecast
// working DONT MESS WITH IT
// make this a set so no dupes
function storeCity() {
  let storageVal = toTitleCase($("#cityName").val());
  console.log(storageVal + " <-this is the storage info");
  let getCityArr = !!localStorage.getItem("city-entered") ?
    JSON.parse(localStorage.getItem("city-entered")) : [];
  //includes method, if statement or ^^this thing
  let n = getCityArr.includes(storageVal);
  console.log(n + "THIS IS THE BOOLEAN");
  if (n == false){
  getCityArr.push(storageVal);
  localStorage.setItem("city-entered", JSON.stringify(getCityArr));
  getCity();
  }
}
//localstorage get function to display city list
//working DONT MESS WITH IT
function getCity() {
  let $cityHistory = $("ul#city-history");
  $cityHistory.empty();
  let getCityArr = !!localStorage.getItem("city-entered") ?
    JSON.parse(localStorage.getItem("city-entered")) : [];
  console.log(getCityArr);
  for (i = 0; i < getCityArr.length; i++) {
    let cityLi = $("<li>");
    cityLi.text(getCityArr[i]);
    cityLi.attr("");  
    $cityHistory.prepend(cityLi);
  }
  //make li clickable
  $("li").on("click", function(){
    console.log($(this).text());
    searchedCity = ($(this).text());
    
    searchEvent();
    });
}

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
function showCurrent(
  searchedCity,
  currentDate,
  currentIcon,
  currentTemp,
  currentHumid,
  currentWind,
  currentUV
) {
  $("#searchedName").text(searchedCity);
  $("#currentDate").text(currentDate);
  $("#currentIcon").attr(
    "src",
    "http://openweathermap.org/img/wn/" + currentIcon + "@2x.png"
  );
  $("#currentTemp").text(currentTemp + "\xB0F");
  $("#currentHumid").text(currentHumid + "%");
  $("#currentWind").text(currentWind + " MPH");
  $("#currentUV").text(currentUV);
}

// build forecast weather
function showForecast(response) {
  let $fiveForecast = $("#fiveForecast");
  for (i = 1; i < 6; i++) {
    let card = $("<div>");
    card.attr("class", "card");
    $fiveForecast.append(card);
    let cardBody = $("<div>");
    cardBody.attr("class", "card-body forecastBody",);
    card.append(cardBody);

    console.log(response.daily[i].temp.day);
    let forecastDate = convertEpoch(response.daily[i].dt);
    let h5 = $("<h5>");
    h5.text(forecastDate);
    cardBody.append(h5);

    console.log(response.daily[i].weather[0].icon);
    let forecastIcon = response.daily[i].weather[0].icon;
    let imgIcon = $("<img>");
    imgIcon.attr(
      "src",
      "http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png"
    );
    cardBody.append(imgIcon);

    let forecastTemp = convertKtoF(response.daily[i].temp.day);
    let tempDiv = $("<div>");
    tempDiv.text(forecastTemp + "\xB0F");
    cardBody.append(tempDiv);

    let forecastHumid = response.daily[i].humidity;
    let humidDiv = $("<div>");
    humidDiv.text("Humidity: " + forecastHumid + "%");
    cardBody.append(humidDiv);
  }
}

// search with enter button
$(document).ready(function() {
  $("#cityName").keyup(function(event) {
    if (event.which === 13) {
      $("#searchBtn").click();
    }
  })
});

// ----worker search function----
function searchEvent (){
  
  //clears old forecast
  $("#fiveForecast").empty(), 
  //runs local storage function
  storeCity();

  let getCoord = buildGetCoord();
  // current weather api call to get lat and lon coordinates for user entered city
  $.ajax({
    url: getCoord,
    method: "GET",
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
      method: "GET",
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
      let currentUV = Math.round(response.current.uvi);
      
      showCurrent(
        toTitleCase(searchedCity),
        currentDate,
        currentIcon,
        currentTemp,
        currentHumid,
        currentWind,
        currentUV
      
      );
         //clear input text
      $("#cityName").val("");

      showForecast(response);

      // set UV color, should be in a function but wasnt able to make work?
      $("#currentUV").removeClass();
      if (currentUV <= 2) {
        $("#currentUV").addClass('low');
        console.log("it is low" + currentUV);
      } else if (currentUV < 5) {
        $("#currentUV").addClass('med');
        console.log("it is med" + currentUV);
      } else if (currentUV < 7) {
        $("#currentUV").addClass('hi');
        console.log("it is hi" + currentUV);
      } else if (currentUV < 10) {
        $("#currentUV").addClass('veryhi');
        console.log("it is veryhi" + currentUV);
      } else {
        $("#currentUV").addClass('exhi');
        console.log("it is exhi" + currentUV);
      }
    });
  });
}

// ---- CALL FUNCTIONS ----
$( window ).ready(function() {
 searchedCity = JSON.parse(localStorage.getItem("city-entered"))[0];
 
searchEvent();
});

getCity();
$("#searchBtn").click(function (event) {
  // prevent browser defaults on click
  event.preventDefault();
  searchedCity= $("#cityName").val();
  searchEvent();})


// ~~To Do~~
// localstorage last search display on refresh, move function above click function
// ----extras if finished early----
//fix potential bug of misspelled cities not being searched but being added to list
