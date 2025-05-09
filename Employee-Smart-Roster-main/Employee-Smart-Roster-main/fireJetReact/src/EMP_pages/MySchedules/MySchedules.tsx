import { useState, useEffect } from 'react'
import { useAuth } from '../../AuthContext'
import { useAlert } from '../../components/PromptAlert/AlertContext'
import { formatDisplayDateTime, formatTextForDisplay,
         TASK_STATUS } from '../../controller/Variables.js'
import { GrSchedules } from "react-icons/gr";
import TaskDetail from './components/TaskDetail';
import TimelineController from '../../controller/TimelineController';

import { FaCircle } from '../../../public/Icons.js'
import './MySchedules.css'
import '../../../public/styles/common.css'

const { empGetAllTask } = TimelineController

const EmpViewSchedule = () => {
    const { showAlert } = useAlert()
    const { user } = useAuth()
    const [ allTasks, setAllTasks ] = useState<any>([])
    const [ selectedTasks, setSelectedTasks ] = useState<any>({})
    const [ showTaskDetail, setShowTaskDetail ] = useState(false)

    const fetchAllTasks = async () => {
        try {
            let response = await empGetAllTask (user?.UID)
            // console.log(response)
            if(response.message === 'Task  successfully retrieved') {
                response = response.EmployeeTasks || []
                // console.log(response)
                setAllTasks(response)
            }
        } catch (error) {
            showAlert(
                'fetchAllTasks',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }
    useEffect(() => {
        fetchAllTasks()
    }, [user])

    function toggleShowTaskDetail(task: any) {
        setSelectedTasks(task)
        setShowTaskDetail(!showTaskDetail)
    }
    // update task locally
    function handleUpdateTask(updatedTask: any) {
        const newTask = allTasks.map((task:any) => 
            task.taskID === updatedTask.taskID 
            ? updatedTask
            : task
        )
        setAllTasks(newTask)
    }

    return(
        <>
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
                            <div 
                                className="App-timeline-content"
                                onClick={() => toggleShowTaskDetail(task)}
                            >
                                <p className="App-timeline-time">
                                    {formatDisplayDateTime(task.startDate)}
                                </p>
                                <div className='App-timeline-task-title-container'>
                                    <FaCircle 
                                        className={`task-status
                                                    ${task.status === TASK_STATUS[1] ? 'in-progress' : ''}
                                                    ${task.status === TASK_STATUS[2] ? 'completed' : ''}`}
                                    />
                                    <h3 className="App-timeline-task-title">{task.title}</h3>
                                </div>
                                
                                <p 
                                    className="App-timeline-task-description"
                                    dangerouslySetInnerHTML={{ __html: formatTextForDisplay(task.taskDescription) }}
                                />

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        {showTaskDetail && selectedTasks && (
            <TaskDetail 
                task={selectedTasks}
                onClose={() => toggleShowTaskDetail({})}
                onUpdate={handleUpdateTask}
            />
        )}
        </>
    )
}

export default EmpViewSchedule