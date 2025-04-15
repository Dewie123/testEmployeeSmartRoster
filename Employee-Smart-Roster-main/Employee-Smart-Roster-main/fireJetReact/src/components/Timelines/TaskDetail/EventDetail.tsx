import { useState, useEffect, useRef } from 'react';
import { useAlert  } from '../../../components/PromptAlert/AlertContext';
import PrimaryButton from '../../../components/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../../components/SecondaryButton/SecondaryButton';
import MoreDetail from './MoreDetail';
import { TASK_STATUS } from '../../../controller/Variables.js';
import AllocatedStaffDetail from './AlloctedStaffDetail';
import TimelineController from '../../../controller/TimelineController.js';
import UserController from '../../../controller/User/UserController.js';
import { IoClose, CgProfile, FaCircle, TbTarget, FaClipboardList,
         TbTargetArrow, FaRegListAlt, VscDebugBreakpointData,
         HiMiniViewfinderCircle, TiTime } from '../../../../public/Icons.js';

import './EventDetail.css'
import '../../../../public/styles/common.css'

interface EventDetailProps {
    task: any;
    onUpdate?: (updatedData: any) => void;
    onDelete?: (deletedTaskId: number) => void;
    onClose?: () => void;
}

const { boGetTaskDetail, deleteTaskDetail } = TimelineController;
const { getCurrentUserProfile } = UserController

const EventDetail = ({task, onUpdate, onDelete, onClose}: EventDetailProps) => {
    const { showAlert } = useAlert()
    const [ taskDetail, setTaskDetail ] = useState<any>([])
    const [ showDeleteTask, setShowDeleteTask ] = useState(false)
    const [ showSeeMoreDetail, setShowSeeMoreDetail ] = useState(false)
    const triggerCloseSeeMoreDetailOutsite = useRef<HTMLDivElement>(null);
    const [ showAllocatedDetail, setShowAllocatedDetail ] = useState(false)
    const triggerCloseAllocatedDetailOutsite = useRef<HTMLDivElement>(null);
    const [ allocatedStaff, setAllocatedStaff ] = useState<any>([])

    const fetchTaskDetail = async () => {
        try {
            let taskDetail = await boGetTaskDetail(task.taskID);
            taskDetail = taskDetail.taskDetails
            
            // Convert task allocated time to Singapore time
            const allocatedTime = new Date(taskDetail[0].createdOn);
            allocatedTime.setHours(allocatedTime.getHours() - 2);
            taskDetail[0].createdOn = new Date(allocatedTime).toISOString().split('T');
            
            // Convert task start time to Singapore time
            const startTime = new Date(taskDetail[0].startDate);
            startTime.setHours(startTime.getHours() - 2);
            taskDetail[0].startDate = new Date(startTime).toISOString().split('T');
            
            // Convert task start time to Singapore time
            const endTime = new Date(taskDetail[0].endDate);
            endTime.setHours(startTime.getHours() - 2);
            taskDetail[0].endDate = new Date(endTime).toISOString().split('T');

            // console.log(taskDetail[0])
            setTaskDetail(taskDetail[0]);
        } catch (error) {
            showAlert(
                "fetchTaskDetail",
                "Fetch data error",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    };

    useEffect(() => { fetchTaskDetail() }, [task])
    // useEffect(() => { console.log(taskDetail) }, [task])

    const fetchAllocatedStaffDetail = async () => {// Get allocated staff detail
        let staff = await getCurrentUserProfile(taskDetail.user_id);
        staff = staff.employeeProfile
        // console.log(staff[0])
        setAllocatedStaff(staff[0])
    }
    useEffect(() => {fetchAllocatedStaffDetail()}, [taskDetail])

    // Close allocated staff detail when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (triggerCloseAllocatedDetailOutsite.current && !triggerCloseAllocatedDetailOutsite.current.contains(event.target as Node)) {
            setShowAllocatedDetail(false);
        }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    function toggleShowAllocationDetail () {
        setShowAllocatedDetail(!showAllocatedDetail)
    }
    // useEffect(() => {console.log(showAllocatedDetail)}, [showAllocatedDetail])


    // Close see more task detail when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (triggerCloseSeeMoreDetailOutsite.current && !triggerCloseSeeMoreDetailOutsite.current.contains(event.target as Node)) {
            setShowSeeMoreDetail(false);
        }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    function toggleShowMoreTaskDetail() {
        setShowSeeMoreDetail(!showSeeMoreDetail);
    }
    // useEffect(() => {console.log(showSeeMoreDetail)}, [showSeeMoreDetail])

    // Delete Task
    function toggleShowDelete () {
        if (showDeleteTask === false)
            setShowDeleteTask(true)
        else
            setShowDeleteTask(false)
    }

    const triggerDeleteTask = async() => {
        try {
            const response = await deleteTaskDetail(taskDetail.taskID);
            
            showAlert(
                `${taskDetail.title}`,
                "",
                `${response.message}`,
                { type: 'success' }
            )

            // Pass delete detail
            if(onDelete)
                onDelete(taskDetail.taskID)

            // Close task detail
            if(onClose)
                onClose()

        } catch(error) {
            showAlert(
                "confirmDeleteTask",
                `${taskDetail.title} Failed to Delete`,
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    }

    if (showDeleteTask) return (
        <div className="App-popup" onClick={toggleShowDelete}>
            <div className='App-popup-prompt-content' onClick={(e) => e.stopPropagation()}>
                <p className='App-prompt-confirmation-title App-header'>Confirm to Delete the Task Detail for:</p>
                <p className="App-prompt-confirmation-title-highlighted-text">{taskDetail.title}</p>
                
                <div className="btns-grp">
                    <PrimaryButton 
                        text='Confirm'
                        onClick={() => triggerDeleteTask()}
                    />
                    <SecondaryButton 
                        text='Cancel'
                        onClick={() => toggleShowDelete()}
                    />
                </div>
            </div>
        </div>
    )

    return(
        <div className='App-popup-content' onClick={(e) => e.stopPropagation()}>
            <div className="App-header">
                <h1>{taskDetail.title}</h1>
                <IoClose className='icons' onClick={onClose}/>
            </div>

            <div className="task-allocation-detail">
                <div className="task-allocation-detail-title">
                    <h3>Task Allocation's Detail</h3>
                    <FaCircle 
                        className={`task-allocated-status
                                    ${taskDetail.status === TASK_STATUS[1] ? 'in-progress' : ''}
                                    ${taskDetail.status === TASK_STATUS[2] ? 'completed' : ''}`}
                    />
                </div>
                <div className={`allocated-staff-info ${showAllocatedDetail ? 'active' : ''}`}
                    ref={triggerCloseAllocatedDetailOutsite}
                >
                    <div 
                        className="allocated-staff-detail-title"
                        onClick={toggleShowAllocationDetail}
                    >
                        <CgProfile className='App-popup-content-icon'/>
                        <p>{task.fullName}</p>
                    </div>
                    <div className="allocated-staff-detail-content">
                        <AllocatedStaffDetail
                            allocatedStaff = {allocatedStaff}
                        />
                    </div>
                </div>
                
                {taskDetail?.createdOn?.length === 2 && (
                <div className="allocated-date-detail">
                    <p className="title">Allocated Date:</p>
                    <div className="event-detail-date-display">
                        <HiMiniViewfinderCircle className='App-popup-content-icon'/>
                        <p className="main-data">{taskDetail.createdOn[0]}</p>
                    </div>
                    <div className="event-detail-time-display">
                        <TiTime className='App-popup-content-icon'/>
                        <p className="main-data">{taskDetail.createdOn[1].split('.')[0]}</p>
                    </div>
                </div>
                )}
            </div>

            <div className="task-detail-information">
                <div className="task-detail-info-title">
                    <h3>Task's Detail</h3>
                    {/* See More Detail */}
                    <div className={`see-more-task-detail ${showSeeMoreDetail ? 'active' : ''}`}
                            ref={triggerCloseSeeMoreDetailOutsite}
                    >
                        <SecondaryButton 
                            text='See More'
                            onClick={() => toggleShowMoreTaskDetail()}
                        />
                        <div className="see-more-task-detail-content">
                            <MoreDetail
                                roleID = {taskDetail.rolesNeeded}
                                skillID = {taskDetail.skillSetNeeded}
                            />
                        </div>
                    </div>
                </div>
                {/* Task description */}
                <div className="task-detail-description">
                    <FaClipboardList className='App-popup-content-icon'/>
                    <p className="main-data">
                        {taskDetail.description}
                    </p>
                </div>
                {taskDetail?.startDate?.length === 2 && (
                <div className="start-date-detail">
                    <p className="title">Start Date:</p>
                    <div className="start-date-detail-data">
                        <div className="event-detail-date-display">
                            <TbTarget className='App-popup-content-icon'/>
                            <p className="main-data">{taskDetail.startDate[0]}</p>
                        </div>
                        <div className="event-detail-time-display">
                            <TiTime className='App-popup-content-icon'/>
                            <p className="main-data">{taskDetail.startDate[1].split('.')[0]}</p>
                        </div>
                    </div>
                </div>
                )}
                {taskDetail?.endDate?.length === 2 && (
                <div className="end-date-detail">
                    <p className="title">End Date:</p>
                    <div className="end-date-detail-data">
                        <div className="event-detail-date-display">
                            <TbTargetArrow className='App-popup-content-icon'/>
                            <p className="main-data">{taskDetail.endDate[0]}</p>
                        </div>
                        <div className="event-detail-time-display">
                            <TiTime className='App-popup-content-icon'/>
                            <p className="main-data">{taskDetail.endDate[1].split('.')[0]}</p>
                        </div>
                    </div>
                </div>
                )}
            </div>
            
            <div className="event-button-group">
                <PrimaryButton 
                    text='Edit Task'
                />
                <SecondaryButton 
                    text='Delete Task'
                    onClick={() => toggleShowDelete()}
                />
            </div>
        </div>
    )
}

export default EventDetail