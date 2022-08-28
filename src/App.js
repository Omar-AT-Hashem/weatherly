import { useEffect, useState, useMemo, useCallback } from "react";
import { WEATHER_API_KEY } from "./api.js";
import Header from "./components/Header/Header";
import SearchBar from "./components/SearchBar/SearchBar";
import DisplayCard from "./components/DisplayCard/DisplayCard.js";
import "./App.css";

function App() {
  let [selectedCity, setSelectedCity] = useState({});
  let [fiveDaysForecast, setFiveDaysForecast] = useState([]);
  let [apiLoad, setApiLoad] = useState(false);
  let [apiLoadDone, setApiLoadDone] = useState(false);
  let [waiting, setWaiting] = useState(true);

  let days = useMemo( () => {
    return (
    [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ])}
  ,[])

  let handleCitySelect = useCallback((city, countryCode, lat, lon) => {
    setSelectedCity({
      city: city,
      countryCode: countryCode,
      lat: lat,
      lon: lon,
    });
    setApiLoad(true);
    setApiLoadDone(false);
  }
  ,[])

  let weatherApiCall = useCallback(() => {
    try {
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${selectedCity.lat}&lon=${selectedCity.lon}&units=metric&appid=${WEATHER_API_KEY}`
      )
        .then((response) => response.json())
        .then((data) => {
          setSelectedCity((prevSelectedCity) => {
            return { ...prevSelectedCity, weatherApiData: data };
          });
          setApiLoad(false);
          setApiLoadDone(true);
          setWaiting(false);
        });
    } catch (err) {
      console.log(err);
    }
  }, [selectedCity.lat, selectedCity.lon])

  let fiveDaysForecastAssembler = useCallback((selectedCity) => {
    let arrayOfDays = [];
    let today = "";
    let arrayLength = selectedCity.weatherApiData.list.length

    for (let i = 0; i < arrayLength; i++) {
      let info = selectedCity.weatherApiData.list[i];
      let date = new Date(info.dt_txt.split(" ")[0]);
      let day = date.getDay();
      let hour = info.dt_txt.split(" ")[1];
      let isFound = false;

      let { main, weather } = info;
      if (i === 0) {
        arrayOfDays.push({
          day: "Today",
          date: `${date.getDate()}/${date.getMonth()}`,
          time: hour,
          temp: main.temp,
          feelsLike: main.feels_like,
          humidity: main.humidity,
          weather: weather[0].description,
          icon: weather[0].icon,
        });
        today = days[day];
      }
      for (let j = 0; j < arrayOfDays.length; j++) {
        if (days[day] === arrayOfDays[j].day || days[day] === today) {
          isFound = true;
        }
      }
      if (!isFound && hour === "12:00:00") {
        arrayOfDays.push({
          day: days[day],
          date: `${date.getDate()}/${date.getMonth()}`,
          time: hour,
          temp: main.temp,
          feelsLike: main.feels_like,
          humidity: main.humidity,
          weather: weather[0].description,
          icon: weather[0].icon,
        });
      }
    }
    setFiveDaysForecast(arrayOfDays);
  },[days])

  let displayCardsGenerator = () => {
    let displayCardKey = 10000;
    let cards = fiveDaysForecast.map((element) => {
      displayCardKey++;
      return (
        <DisplayCard
          key={displayCardKey}
          day={element.day}
          time={element.time}
          date={element.date}
          temp={element.temp}
          feelsLike={element.feelsLike}
          humidity={element.humidity}
          weather={element.weather}
          icon={element.icon}
        />
      );
    });
    return cards;
  };

  useEffect(() => {
    
    if (apiLoad) {
      weatherApiCall();
    }
    if (apiLoadDone) {
      fiveDaysForecastAssembler(selectedCity);
    }
    
  }, [ apiLoad,apiLoadDone, fiveDaysForecastAssembler, 
    weatherApiCall, selectedCity]);

  return (
    <div className="container">
      <Header />
      <div className="container">
        <SearchBar onCitySelect={handleCitySelect} />
        {waiting ? (
          <div className="waiting">What might the weather be?</div>
        ) : (
          <div className="display-cards-container">
            {displayCardsGenerator()}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
