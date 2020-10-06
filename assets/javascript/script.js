// global variables
let apiKey = "&appid=d3c8c525fef446aa8fb30692c753cdf6";
let qCity = "";
let getCoord = "api.openweathermap.org/data/2.5/weather?q=" + qCity + apiKey;
let lat = "";
let lon = "";
let currentWeather = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + apiKey;
let fiveDay = currentWeather + "exclude=current,minutely,hourly,alerts";

//click function enters user city name into api link
//use response to get lat and lon

//run api call with lat and lon to get current weather and display

//run api call with lat and lon to get five day forecast and display

//localstorage city list, when clicked display current weather & forecast
//localstorage last search display on refresh