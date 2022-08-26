import "./DisplayCard.css";

const DisplayCard = (props) => {
  let { day, date, temp, feelsLike, humidity, weather, icon } = props;
  temp = Math.floor(temp);
  feelsLike = Math.ceil(feelsLike);
  return (
    <div className="display-card">
      <div className="icon-day-date-container">
        <div className="day-and-date">
          {day}, {date}
        </div>
        <img className="weather-icon" src={`/images/${icon}.png`} alt="" />
      </div>
      <div className="info-container">
        <ul className="info">
          <li className="info-item">Weather: {weather}</li>
          <li className="info-item">Humidity: {humidity}%</li>
        </ul>
      </div>
      <div className="temp-container">
        <div className="temp">
          {temp}
          {"\u00B0"}C
        </div>
        <div className="feels-like">
          Feels Like: {feelsLike}
          {"\u00B0"}C
        </div>
      </div>
    </div>
  );
};

export default DisplayCard;
