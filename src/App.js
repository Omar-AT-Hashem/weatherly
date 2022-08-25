import { useEffect, useState } from 'react';
import { WEATHER_API_KEY }  from './api.js';
import Header from './components/Header/Header';
import SearchBar from './components/SearchBar/SearchBar';
import DisplayCard from './components/DisplayCard/DisplayCard.js';
import './App.css';

function App() {

  let [selectedCity, setSelectedCity] = useState({})
  let [fiveDaysForecast, setFiveDaysForecast] = useState([])
  let [apiLoad, setApiLoad] = useState(false)
  let [apiLoadDone, setApiLoadDone] = useState(false)
  
  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  let handleCitySelect = (city, countryCode) =>{
  setSelectedCity({
                    city: city,
                    countryCode: countryCode
                    })
  setApiLoad(true)
  setApiLoadDone(false)
  } 


  let weatherApiCall = (city, countryCode) => {
    try{
      fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city},${countryCode}&units=metric&appid=${WEATHER_API_KEY}`)
      .then((response) => response.json())
      .then((data) => {
         setSelectedCity((prevSelectedCity) =>{ 
          return {...prevSelectedCity, weatherApiData: data}
        })
         console.log(data)
         setApiLoad(false)
         setApiLoadDone(true)
      })
   
  } catch(err){
    console.log(err)
  }
}


let  fiveDaysForecastAssembler = (arrayLenght) => {
  let arrayOfDays = []
  let today = ''

  for (let i = 0; i < arrayLenght; i++){
    let info = selectedCity.weatherApiData.list[i]
    let date = new Date(info.dt_txt.split(" ")[0])
    let day = date.getDay()
    let hour = info.dt_txt.split(" ")[1]
    let isFound = false;

    let {main, weather} = info
      if(i === 0){
        arrayOfDays.push({
          day: "today",
          time: hour,
          temp: main.temp,
          feelsLike: main.feels_like,
          humidity: main.humidity,
          weather: weather[0].description,
          icon: weather[0].icon 
        })
        today = days[day]
      }
      for (let j = 0; j < arrayOfDays.length; j++){
         if (days[day] === arrayOfDays[j].day || days[day] === today){
           isFound = true
        }
      }
      if(!isFound && (hour === "12:00:00")){
        arrayOfDays.push({
          day: days[day],
          time: hour,
          temp: main.temp,
          feelsLike: main.feels_like,
          humidity: main.humidity,
          weather: weather[0].description,
          icon: weather[0].icon 
        })
        
      }
  }
  setFiveDaysForecast(arrayOfDays)

  let displayCardsGenerator = () => {
    
  }
 
}
console.log(fiveDaysForecast);
  
  

  useEffect(() => {
    if(apiLoad){
      weatherApiCall(selectedCity.city, selectedCity.countryCode)
    }
    if(apiLoadDone){
      fiveDaysForecastAssembler(selectedCity.weatherApiData.list.length)
    }
  }
  ,[apiLoad, apiLoadDone])

  
  return (
    <>
      <Header />
      <SearchBar onCitySelect={handleCitySelect} />
      <div className='display-cards-container'>
        <DisplayCard />
        <DisplayCard />
        <DisplayCard />
        <DisplayCard />
      </div>
    </>
  );
}

export default App;
