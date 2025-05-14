import { useState, useEffect } from 'react'
import { useAuth } from '../../AuthContext'
import { useAlert } from '../../components/PromptAlert/AlertContext'
import { formatDisplayDateTime, formatTextForDisplay,
         TASK_STATUS } from '../../controller/Variables.js'
import { GrSchedules } from "react-icons/gr";
import TaskDetail from './components/TaskDetail';
import TimelineController from '../../controller/TimelineController';
import UserController from '../../controller/User/UserController';

import { FaCircle, FaClock } from '../../../public/Icons.js'
import { RiSwap2Fill } from "react-icons/ri";
import './MySchedules.css'
import '../../../public/styles/common.css'

const { empGetUserProfile } = UserController
const { empGetAllTask, viewOtherTasksToSwap, viewAllSwapTime, 
        submitSwapTime, updateSwapTimeStatus, getAllTasks } = TimelineController

const EmpViewSchedule = () => {
    const { showAlert } = useAlert()
    const { user } = useAuth()
    const [ userProfile, setUserProfile ] = useState<any>([])
    const [ allTasks, setAllTasks ] = useState<any>([])
    const [ tasksAvailableForSwap, setTasksAvailableForSwap ] = useState<any>([])
    const [ showTasksForSwap, setShowTasksForSwap ] = useState(false)
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
    // Get employee informations
    const fetchMyProfile = async () => {
        try {
            let response = await empGetUserProfile (user?.UID)
            // console.log(response)
            if(response.message === 'Employee Profile successfully retrieved') {
                response = response || []
                // console.log(response)
                setUserProfile(response)
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
        fetchMyProfile()
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
    // Fetch all other task for swap
    const triggerAvailableTasksForSwap = async() => {
        try {
            const empData = userProfile.employeeProfile[0] || {}
            let response = await viewOtherTasksToSwap(empData.business_owner_id,
                empData.roleID, empData.skillSetID, empData.user_id
            )
            if(response?.message === 'Employee Tasks with similar skillset and role required successfully retrieved'){
                // console.log(response)
                response = response.employeeProfile || []
                const filteredTaskAllocatedToSameEmp = response.filter((task: any) => {
                    return task.user_id !== user?.UID
                })
                setTasksAvailableForSwap(response)
                setShowTasksForSwap(true)
            }
        } catch (error) {
            showAlert(
                'triggerAvailableTasksForSwap',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    const triggerCreateNewSwapRequest = async() => {
        try {
            const empData = userProfile.employeeProfile || {}
            let response = await submitSwapTime(empData.business_owner_id,
                empData.roleID, empData.skillSetID, empData.user_id
            )
            console.log(response)
            // if(response.message === 'Task  successfully retrieved') {
            //     response = response.EmployeeTasks || []
            //     // console.log(response)
            //     setAllTasks(response)
            // }
        } catch (error) {
            showAlert(
                'fetchAllTasks',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
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
                                <div className='App-timeline-task-title-container'>
                                    <div className='App-timeline-task-title'>
                                        <FaCircle 
                                            className={`task-status
                                                        ${task.status === TASK_STATUS[1] ? 'in-progress' : ''}
                                                        ${task.status === TASK_STATUS[2] ? 'completed' : ''}`}
                                            style={{ fontSize: '12px', minWidth: '12px', minHeight: '12px' }}
                                        />
                                        <h3 className="App-timeline-task-title">{task.title}</h3>
                                    </div>
                                    <p className="App-timeline-time">
                                        <FaClock />
                                        {formatDisplayDateTime(task.startDate)}
                                    </p>

                                </div>
                                <hr className="App-timeline-divider" />
                                <p
                                    className="App-timeline-task-description"
                                    dangerouslySetInnerHTML={{ __html: formatTextForDisplay(task.taskDescription) }}
                                />
                                <div 
                                    className='emp-timeline-button-container'
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button 
                                        className="primary-button"
                                        onClick={triggerAvailableTasksForSwap}
                                    >
                                        <RiSwap2Fill className='primary-button-icon'/>
                                        Request Swap
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="content">
                <h1>Swap Time Management</h1>
                <div className="submitted-time-swap">

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