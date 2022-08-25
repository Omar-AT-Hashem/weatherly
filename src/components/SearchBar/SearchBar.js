import { useState, useEffect } from 'react'
import searchIcon from '../../images/searchIcon.png'
import { GEO_DB_API_URL ,GEO_DB_API_OPTIONS }  from '../../api.js';
import './SearchBar.css'



const SearchBar = ({onCitySelect}) => {
    let [currentSearch, setCurrentSearch] = useState('')
    let [currentSearchResults, setCurrentSearchResult] = useState([])

   //search results markup + sends the city and country code of
   // the celected city to app.js
   let displayCurrentSearchResults = () => {
        return (currentSearchResults.map(element => {
            return (<div 
                    key={element.city}
                    className='result'
                    data-city={element.city}
                    data-country-code={element.countryCode}
                    onClick={(e) => onCitySelect(e.target.dataset.city, e.target.dataset.countryCode )}
                    >
                        {element.city}, {element.countryCode}
                    </div>
                )
        }))
   }

   
    //Calls the GeoDB api when the user starts typing the search
    //query and sets a 600ms delay to the call
    useEffect(() => {
        if(currentSearch){
            let callGeoApi = () => {
                fetch(`${GEO_DB_API_URL}/cities?namePrefix=${currentSearch}&minPopulation=200000`, GEO_DB_API_OPTIONS)
                .then(response => response.json())
                .then(data => setCurrentSearchResult(data.data?.filter(
                    element => element.city.toLowerCase().includes(currentSearch.toLowerCase())
                )))   
                .catch(err => console.error(err));
           } 
            const geoApiDelay = setTimeout(() => {
                callGeoApi()
                console.log("call")
            }, 600)
            setCurrentSearchResult([])
            
        return () => clearTimeout(geoApiDelay)
        }
      }, [currentSearch])
    
    
      // component markup
    return (
        <div className='search-container'>  
            <input 
                type="text" 
                className='search-bar' 
                placeholder='Find your City...'
                value={currentSearch}
                onChange={(e) => setCurrentSearch(e.target.value)}
            />
             {((currentSearchResults) && (currentSearch)) &&
                <div className='search-results'>
                    {displayCurrentSearchResults()}
                </div>
            }
        </div>
     )
}

export default SearchBar