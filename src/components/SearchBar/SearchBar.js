import { useState, useEffect } from "react";

import { GEO_DB_API_URL, GEO_DB_API_OPTIONS } from "../../api.js";
import "./SearchBar.css";

const SearchBar = ({ onCitySelect }) => {
  let [currentSearch, setCurrentSearch] = useState("");
  let [currentSearchResults, setCurrentSearchResult] = useState([]);
  let [apiLoad, setApiLoad] = useState(false);
  let [apiLoadDone, setApiLoadDone] = useState(false);

  //search results markup + sends the city and country code of
  // the celected city to app.js
  let displayCurrentSearchResults = () => {
    return currentSearchResults.map((element) => {
      return (
        <div
          key={element.city}
          className="result"
          data-city={element.city}
          data-country-code={element.countryCode}
          data-lat={element.latitude}
          data-lon={element.longitude}
          onClick={(e) => {
            onCitySelect(
              e.target.dataset.city,
              e.target.dataset.countryCode,
              e.target.dataset.lat,
              e.target.dataset.lon
            );
            setCurrentSearch("");
          }}
        >
          {element.city}, {element.countryCode}
        </div>
      );
    });
  };

  //Calls the GeoDB api when the user starts typing the search
  //query and sets a 600ms delay to the call
  useEffect(() => {
    if (currentSearch) {
      let callGeoApi = () => {
        fetch(
          `${GEO_DB_API_URL}/cities?namePrefix=${currentSearch}&minPopulation=100000`,
          GEO_DB_API_OPTIONS
        )
          .then((response) => response.json())
          .then((data) => {
            setCurrentSearchResult(
              data.data?.filter((element) =>
                element.city.toLowerCase().includes(currentSearch.toLowerCase())
              )
            );
            setApiLoadDone(true);
            setApiLoad(false);
          })
          .catch((err) => console.error(err));
      };
      const geoApiDelay = setTimeout(() => {
        callGeoApi();
        console.log("call");
      }, 600);
      setCurrentSearchResult([]);

      return () => clearTimeout(geoApiDelay);
    }
  }, [currentSearch]);

  // component markup
  return (
    <div className="search-container">
      <input
        type="text"
        className="search-bar"
        placeholder="Find your City..."
        value={currentSearch}
        onChange={(e) => {
          setCurrentSearch(e.target.value);
          setApiLoad(true);
          setApiLoadDone(false);
        }}
      />
      {currentSearchResults && currentSearch && apiLoadDone ? (
        <div className="search-results">{displayCurrentSearchResults()}</div>
      ) : (
        <div className="waiting">What might the weather be?</div>
      )}
    </div>
  );
};

export default SearchBar;
