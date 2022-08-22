import './SearchBar.css'
import searchIcon from '../../images/searchIcon.png'

const SearchBar = ()=> {
    return (
        <div className='search-container'>  
            <input 
                type="text" 
                className='search-bar' 
                placeholder='Find your city...'
            />
            <img 
                src={searchIcon}
                alt='zxzxz'
                className='search-icon'
             />
        </div>
     )
}

export default SearchBar