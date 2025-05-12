import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../AuthContext'
import { useAlert } from '../../components/PromptAlert/AlertContext'
import { formatDisplayDateTime } from '../../controller/Variables.js'
import TimelineController from '../../controller/TimelineController.js'


import { GrSchedules } from "react-icons/gr";
import { IoArrowBack } from '../../../public/Icons.js'
import './TimelinesPage.css'
import '../../../public/styles/common.css'

const { getAllTasksInATimeline } = TimelineController

const AllTasksInTimeline = () => {
    const { user } = useAuth();
    const { showAlert } = useAlert();
    const navigate = useNavigate()
    const location = useLocation();
    const { state } = location;
    // console.log(state)
    const [ allTasks, setAllTasks ] = useState<any>([])

    // If no timeline
    if(!state?.timeline) return (<div>No Timeline Data Provided</div>)

    const fetchTasksInTimeline = async () => {
        try {
            let tasks = await getAllTasksInATimeline(user?.UID, state?.timeline.timeLineID);
            if(tasks.message === 'Tasks retrieved successfully.') {
                tasks = tasks.timelineTasks || []
                // console.log(tasks)
                setAllTasks(tasks)
            }
        } catch (error) {
            showAlert(
                "fetchTasksInTimeline",
                "Fetch data error",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    };
    useEffect(() => { fetchTasksInTimeline() }, [state?.timeline])

    return(
        <div className="App-content">
            <div className="content">
            {allTasks.length > 0 ? (
                <>
                <div className='App-header timeline-header'>
                    <IoArrowBack 
                        onClick={() => navigate(-1)}
                        className="icons"
                    />
                    <h1>Timeline: {state.timeline.timelineTitle}</h1>
                </div>
                <div className="App-timeline">
                    {/* Timeline Line (Vertical) */}
                    <div className="App-timeline-line"></div>

                    {/* Timeline Items */}
                    {allTasks.length > 0 && allTasks.map((task: any) => (
                        <div key={task.taskID} className="App-timeline-item">
                            {/* Timeline Point (Icon) */}
                            <div className="App-timeline-point">
                                <GrSchedules className="App-timeline-icon" />
                            </div>

                            {/* Timeline Content */}
                            <div className="App-timeline-content">
                                <p className="App-timeline-time">
                                    {formatDisplayDateTime(task.startDate)}
                                </p>
                                <h3 className="App-timeline-task-title">{task.title}</h3>
                                <p className="App-timeline-task-description">{task.taskDescription}</p>
                            </div>
                        </div>
                    ))}
                </div>
                </>  
            ):(
                <p>No Tasks Created for {state.timeline.timelineTitle}</p>
            )}
            </div>
        </div>
    )
}

export default AllTasksInTimeline;