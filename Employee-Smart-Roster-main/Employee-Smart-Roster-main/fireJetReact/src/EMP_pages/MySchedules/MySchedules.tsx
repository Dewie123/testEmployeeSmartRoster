import { useState, useEffect } from 'react'
import { useAuth } from '../../AuthContext'
import { useAlert } from '../../components/PromptAlert/AlertContext'
import { formatDisplayDateTime } from '../../controller/Variables.js'
import { GrSchedules } from "react-icons/gr";
import TimelineController from '../../controller/TimelineController'

const { empGetAllTask } = TimelineController

const EmpViewSchedule = () => {
    const { showAlert } = useAlert()
    const { user } = useAuth()
    const [ allTasks, setAllTasks ] = useState([])
    

    const fetchAllTasks = async () => {
        try {
            let response = await empGetAllTask (user?.UID)
            console.log(response)
            if(response.message === 'Task  successfully retrieved') {
                response = response.EmployeeTasks || []
                console.log(response)
                setAllTasks(response)
            }
        } catch (error) {
            showAlert(
                'fetchAllReportedIsses',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }
    useEffect(() => {
        fetchAllTasks()
    }, [user])

    return(
        <div className="App-content">
            <div className="content">
                <h1>My Schedules</h1>
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
            </div>
        </div>
    )
}

export default EmpViewSchedule