import './index.css'
import '../../../public/styles/common.css'

const EventDetail = ({task = [], onClose}: EventDetailProps) => {

    return(
        <div className='App-popup-content' onClick={onClose}>
            <h1>{task.title}</h1>
            
        </div>
    )
}

interface EventDetailProps {
    task?: any;
    onClose?: () => void;
}

export default EventDetail