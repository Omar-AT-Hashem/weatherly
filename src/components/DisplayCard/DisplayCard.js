
import './DisplayCard.css'


const DisplayCard = (props) => {
    return (
        <div className="display-card">
            <div className='segmentOne'>
                <div className='day-and-date'>{props.day}, {props.date}</div>
                <img className='weather-icon' src={`/images/${props.icon}.png`} alt=""/>
            </div>
        </div>
    )
}

export default DisplayCard
