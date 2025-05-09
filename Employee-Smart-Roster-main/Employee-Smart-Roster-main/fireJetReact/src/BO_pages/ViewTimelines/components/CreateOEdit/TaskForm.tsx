import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../../components/PromptAlert/AlertContext";
import { formatKey, formatDateTime, generateSGDateTimeForDateTimeInput } from "../../../../controller/Variables";
import TimelineForm from "./TimelineForm";
import PrimaryButton from "../../../../components/PrimaryButton/PrimaryButton";
import SecondaryButton from "../../../../components/SecondaryButton/SecondaryButton";
import BOEmployeeController from "../../../../controller/BOEmployeeController";
import TimelineController from "../../../../controller/TimelineController";

import { IoArrowBack } from '../../../../../public/Icons.js'
import "./CreateNEditTask.css"
import "../../../../../public/styles/common.css"

interface CreateOEditTaskProps {
    isCreate: boolean;
    bo_UID: any;
    defaultTaskValues: any;
    defaultTimelineValues?: any;
    allRoles: any;
    allSkillsets: any;
}

interface TaskAssignationInfoProps {
    bo_UID: number;
    taskValues: any;
    assignedTask: any;
    roleID: number;
    skillSetID: number;
}

const { getRoleIdForEmp, getSkillIdForEmp } = BOEmployeeController;
const { createTask, handleTaskAutoAllocation, handleManualUpdateTaskAllocation,
        getAvailableEmployees } = TimelineController;

const CreateEditTask = ({ 
    isCreate, bo_UID, defaultTaskValues, defaultTimelineValues,
    allRoles, allSkillsets
} : CreateOEditTaskProps) => {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [ showConfirmation, setShowConfirmation ] = useState(false);
    const [ isHavingTimeline, setIsHavingTimeline ] = useState(false);
    const [ isTaskAssigned, setIsTaskAssigned ] = useState(false);
    const [ assignedTask, setAssignedTask ] = useState<any>([])
    const [ taskValues, setTaskValues ] = useState({
        title: '',
        taskDescription: '',
        roleID: '',
        skillSetID: '',
        startDate: '',
        endDate: '',
        noOfEmp: '',
    });
    const [ timelineValues, setTimelineValues ] = useState({
        timeLineID: '',
        title: '',
        timeLineDescription: '',
    })
    useEffect(() => {
        setTaskValues(defaultTaskValues)
        setTimelineValues(defaultTimelineValues)
    }, [defaultTaskValues, defaultTimelineValues])

    const handleInputChange = (event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >) => {
        const { name, value } = event.target;
        setTaskValues((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Check if create/edit form all filled
    const isTaskIncomplete = () => {
        const requiredFields: (keyof typeof taskValues)[] = [
            'title',
            'taskDescription',
            'roleID',
            'skillSetID',
            'startDate',
            'endDate',
            'noOfEmp'
        ];
        return requiredFields.some(field => !taskValues[field]);
    };

    // Prompt user confirmation for update
    function toggleConfirmation () {
        setShowConfirmation(!showConfirmation)
    }

    const triggerCreateTask = async() => {
        const roleID = getRoleIdForEmp(allRoles, taskValues.roleID)
        taskValues.roleID = roleID[0].roleID

        const skillSetID = getSkillIdForEmp(allSkillsets, taskValues.skillSetID)
        taskValues.skillSetID = skillSetID[0].skillSetID

        let timelineID = timelineValues.timeLineID
        try {
            let response = await createTask (bo_UID, taskValues, timelineID)
            // response = JSON.parse(response.body)
            // console.log("Create Task: ", response)

            if(response.message === "Task successfully created"){
                showAlert(
                    "Task Created Successfully",
                    `${taskValues.title}`,
                    `Auto Task Allocation is In Progress`,
                    { type: 'success' }
                );
                
                toggleConfirmation()
                // Start task allocation
                let allocationRes = await handleTaskAutoAllocation(bo_UID);
                allocationRes = JSON.parse(allocationRes.body)
                // console.log("Tasks Allocation: ", allocationRes)
                if(allocationRes.message === "Auto-allocation process completed."){
                    let allAllocatedTasks = allocationRes.assignedTasks || [];
                    if(allAllocatedTasks) {
                        allAllocatedTasks = allAllocatedTasks.filter((task: any) => {
                            return task.taskID === response.TaskIDCreated
                        })
                        // console.log("Filtered task allocation: ", allAllocatedTasks)
                        setAssignedTask(allAllocatedTasks)
                        setIsTaskAssigned(true) // Set assignation completed
                    }
                    else {
                        setIsTaskAssigned(true) // Set assignation completed
                        showAlert(
                            "Task Allocation Failed",
                            `No Employee Available Matched to The Need`,
                            ``,
                            { type: 'info' }
                        )
                    } 
                }
            }
        } catch (error) {
            showAlert(
                "triggerCreateTask",
                `Failed to Create Task for "${taskValues.title}"`,
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    function handleTimelineValueChange (timelineValue: any) {
        setTimelineValues(timelineValue)
    }

    if(showConfirmation) return (
        <div className="App-popup" onClick={toggleConfirmation}>
            <div className="App-popup-prompt-content confirm-create-edit-emp-completion" onClick={(e) => e.stopPropagation()}>
                <h3>
                    {isCreate ? (
                        "Confirm The Task Information"
                    ):("Confirm The Updated Task Information")}  
                </h3>
                <div className="all-create-employee-data">
                    {isHavingTimeline && (
                        <div className="create-employee-confirmation-detail odd-row">
                            <p className="title">Timeline Title</p>
                            <p className="main-data">{timelineValues.title}</p>
                        </div>
                    )}
                    {Object.entries(taskValues).map(([key, value], index) => (
                        <div key={`task-value-${key}-${index}`}
                            className={`create-employee-confirmation-detail 
                                        ${index % 2 === 1 ? 'odd-row' : ''}`}>
                            {key === 'roleID' ? ( // If current key is roleID
                                <p className="title">Role</p>
                            ) : key === 'skillSetID' ? ( // If current key is skillSetID
                                <p className="title">Skillset</p>
                            ) : (
                                <p className="title">{formatKey(key)}</p>
                            )}

                            {key === 'startDate' ? (
                                <p className="main-data">
                                    {formatDateTime(String(value))}
                                </p>
                            ) : key === 'endDate' ? (
                                <p className="main-data">
                                    {formatDateTime(String(value))}
                                </p>
                            ) : (
                                <p className="main-data">{String(value)}</p>
                            )}
                        </div>
                    ))}
                </div>
                <div className="btns-grp">
                    {isCreate ? ( // Create new task
                        <PrimaryButton 
                            text="Confirm" 
                            onClick={() => triggerCreateTask()}
                        />
                    ):( // Update task
                        <PrimaryButton 
                            text="Confirm" 
                            // onClick={() => triggerCreateEmpAcc()}
                        />
                    )}
                    <SecondaryButton 
                        text="Cancel" 
                        onClick={() => toggleConfirmation()}
                    />
                </div>
            </div>
        </div>
    )

    return (
        <div className="content create-n-edit-task-page">
            <div className="App-header create-n-edit-task-header">
                <IoArrowBack 
                    className="icons"
                    onClick={() => navigate(-1)}    
                />
                <h2>{isCreate ? "Create New " : "Edit "}Task</h2>
            </div>
            <div className="create-n-edit-task-form-container">
                <div className="create-n-edit-task-form-content">
                    <div className="create-or-view-timeline-info">
                        <label className="checkbox-container">
                            Include in project timeline
                            <input 
                                type="checkbox" 
                                checked={isHavingTimeline} 
                                disabled={isTaskAssigned}
                                onChange={(e) => setIsHavingTimeline(e.target.checked)}/>
                            <span className="checkmark"></span>
                        </label>
                        {isHavingTimeline && isCreate && (
                            <TimelineForm 
                                isCreateTask={true}
                                defaultValues={timelineValues}
                                bo_UID={bo_UID}
                                newTimelineValue={handleTimelineValueChange}
                            />
                        )}
                    </div>
                    {/* Input Task Title */}
                    <div className='forms-input'>
                        <strong>
                            Task Title <span style={{ color: 'red' }}>*</span>
                        </strong>
                        <input type='text' 
                            name='title'
                            placeholder='Task Title' 
                            value={taskValues.title}
                            onChange={(e) => handleInputChange(e)}
                            disabled={isTaskAssigned}
                            required
                        />
                    </div>
                    {/* Input Task Description */}
                    <div className='forms-input'>
                        <strong>
                            Task Description <span style={{ color: 'red' }}>*</span>
                        </strong>
                        <textarea name='taskDescription'
                            maxLength={500}
                            rows={4}
                            placeholder='Task Description' 
                            value={taskValues.taskDescription}
                            onChange={(e) => handleInputChange(e)}
                            disabled={isTaskAssigned}
                            required
                        />
                    </div>
                    {/* Role Needed */}
                    <div className='forms-input'>
                        <strong>
                            Required Role <span style={{ color: 'red' }}>*</span>
                        </strong>
                        <div className="fields">
                            {/* Role dropdown */}
                            <select 
                                name="roleID"
                                value={taskValues.roleID}
                                onChange={(e) => handleInputChange(e)}
                                disabled={isTaskAssigned}
                            >
                                {allRoles.map((role:any) => (
                                <option key={role.roleID} value={role.roleName}>
                                    {role.roleName}
                                </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* Skillsets Needed */}
                    <div className='forms-input'>
                        <strong>
                            Required Skillsets <span style={{ color: 'red' }}>*</span>
                        </strong>
                        {/* Skillsets dropdown */}
                        <select 
                            name="skillSetID"
                            value={taskValues.skillSetID}
                            onChange={(e) => handleInputChange(e)}
                            disabled={isTaskAssigned}
                        >
                            {allSkillsets.map((skill:any) => (
                            <option key={skill.skillSetID} value={skill.skillSetName}>
                                {skill.skillSetName}
                            </option>
                            ))}
                        </select>
                    </div>
                    {/* Task Start */}
                    <div className='forms-input'>
                        <strong>
                            Start Date Time <span style={{ color: 'red' }}>*</span>
                        </strong>
                        <input type='datetime-local' 
                            name='startDate'
                            placeholder='Task Description' 
                            value={taskValues.startDate}
                            onChange={(e) => handleInputChange(e)}
                            min={generateSGDateTimeForDateTimeInput(new Date)}
                            max={taskValues.endDate}
                            disabled={isTaskAssigned}
                            required
                        />
                    </div>
                    {/* Task End */}
                    <div className='forms-input'>
                        <strong>
                            End Date Time <span style={{ color: 'red' }}>*</span>
                        </strong>
                        <input type='datetime-local' 
                            name='endDate'
                            placeholder='Task Description' 
                            value={taskValues.endDate}
                            onChange={(e) => handleInputChange(e)}
                            min={taskValues.startDate}
                            disabled={isTaskAssigned}
                            required
                        />
                    </div>
                    <div className="create-task-button">
                        {/* Number of Employee */}
                        <div className='forms-input'>
                            <strong>
                                No.of Employee <span style={{ color: 'red' }}>*</span>
                            </strong>
                            <input type='number' 
                                name='noOfEmp'
                                placeholder='No of employee needed' 
                                value={taskValues.noOfEmp}
                                onChange={(e) => handleInputChange(e)}
                                min={1}
                                max={3}
                                className="no-of-emp-input"
                                disabled={isTaskAssigned}
                                required
                            />
                        </div>
                        <PrimaryButton 
                            text="Create Task"
                            onClick={() => toggleConfirmation()}
                            disabled={isTaskIncomplete() || isTaskAssigned}
                        />
                    </div>
                </div>
                {isTaskAssigned && assignedTask && (
                    <div className="task-assignation-detail-container">
                        <TaskAssignationInfo 
                            bo_UID={bo_UID} 
                            taskValues={taskValues}
                            assignedTask={assignedTask}
                            roleID={Number(taskValues.roleID)}
                            skillSetID={Number(taskValues.skillSetID)}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
////////////////////////////////////////////////////////////////////////////////////////////
const TaskAssignationInfo = ({
    bo_UID, assignedTask, roleID, skillSetID, taskValues
} : TaskAssignationInfoProps) => {
    // console.log(assignedTask)
    const navigate = useNavigate()
    const { showAlert } = useAlert()
    const [ allEmployees, setAllEmployees ] = useState<any>([])
    const [ selectedEmp, setSelectedEmp ] = useState<any>([])
    
    const fetchAllEmployee = async() => {
        try {
            let employees = await getAvailableEmployees(roleID, skillSetID, bo_UID)
            employees = employees.availableEmployees || []
            // console.log(employees)

            if(assignedTask.length > 0){
                // Set allocated task detail to same data returned in employees
                const initialSelection = assignedTask.map((task:any) => ({
                    fullName: task.fullName,
                    user_id: task.assignedTo,
                    roleID: task.roleID,
                    skillSetID: task.skillSetID
                }))
                // console.log(initialSelection)
                setSelectedEmp(initialSelection || [])
                // Merging if available employees are not empty
                employees = [
                    ...initialSelection,
                    ...employees
                ]
                employees = employees.filter((employee: any, index: number, self: any[]) => 
                    index === self.findIndex((e: any) => (
                        e.user_id === employee.user_id
                    ))
                );
            }
            // console.log(employees)
            setAllEmployees(employees)
        } catch(error) {
            showAlert(
                "fetchAllEmployee",
                `Failed to Fetch Employee Detail`,
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }
    useEffect(() => { fetchAllEmployee() }, [bo_UID, assignedTask])
    // console.log(selectedEmp)

    const toggleEmployeeSelection = (employee: any) => {
        setSelectedEmp((prev:any) => {
            const isSelected = prev.some((emp:any) => emp.user_id === employee.user_id);
            if (isSelected) {   // If the employee is selected before
                return prev.filter((emp:any) => emp.user_id !== employee.user_id);
            } else {
                return [...prev, employee];
            }
        });
        
    };

    const handleSelectEmployee = (employee: any) => {
        // console.log(employee)
        if(selectedEmp.length >= taskValues.noOfEmp) {
            showAlert(
                "Task Assignment Limit",
                `"${taskValues.title}" requires ${taskValues.noOfEmp} employee(s)`,
                `You selected ${selectedEmp.length}. Please adjust your selection.`,
                { type: 'warning' }
            );
        } else {
            toggleEmployeeSelection(employee)
        }
    }

    const selectAllMatched = () => {
        const matchedEmployees = allEmployees.filter((emp:any) => 
            emp.roleID === roleID && emp.skillSetID === skillSetID
        );
        setSelectedEmp(matchedEmployees);
    };

    const clearAllSelections = () => {
        setSelectedEmp([]);
    };

    const triggerSubmitConfirmAllocation = async() => {
        const employeesArray = Array.isArray(selectedEmp) ? selectedEmp : [selectedEmp];
        try {
            employeesArray.map(async(allocation: any, index: number) => {
                let response = await handleManualUpdateTaskAllocation(
                    allocation.user_id, assignedTask[index].taskAllocationID, 
                    taskValues.title
                )
                // console.log(response)
                if(response.message === 'Employee has been reassigned successfully')
                    showAlert(
                        "Task Created Created",
                        `${taskValues.title} was created and allocated`,
                        ``,
                        { type: 'success' }
                    );
                else
                    showAlert(
                        "Task Created Created",
                        `${taskValues.title} was created and allocated base on system allocation`,
                        ``,
                        { type: 'success' }
                    );
            })
        } catch(error) {
            showAlert(
                "triggerSubmitConfirmAllocation",
                `Failed to Update Allocation Confirmation`,
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
        navigate(-1)
    }

    return (
        <div className="task-assignation-detail-content">
            {/* Employee Dropdown */}
            <div className='forms-input'>
                <strong>
                    Allocated To
                </strong>
                {/* Multi-select dropdown container */}
                <div className="multiselect-dropdown-container">
                    {/* Dropdown header with search and buttons */}
                    <div className="dropdown-header">
                        <input 
                            type="text" 
                            placeholder="Search employees..."
                        />
                        <div className="dropdown-buttons">
                            <PrimaryButton
                                text="Select All Matched"
                                onClick={() => selectAllMatched()}
                            />
                            <SecondaryButton 
                                text="Clear All"
                                onClick={() => clearAllSelections()}
                            />
                        </div>
                    </div>
                    
                    {/* Selected items display */}
                    <div className="selected-items">
                        {selectedEmp.map((employee:any) => (
                            <span key={employee.user_id} className="selected-tag">
                                {employee.fullName}
                                <span 
                                    className="remove-tag"
                                    onClick={() => toggleEmployeeSelection(employee)}
                                >
                                    ×
                                </span>
                            </span>
                        ))}
                        <span className="no-selected">{selectedEmp.length}</span>
                    </div>
                    
                    
                    {/* Dropdown options */}
                    <div className="dropdown-options">
                        {allEmployees.map((employee:any) => {
                            const isSelected = selectedEmp.some(
                                (emp:any) => emp.user_id === employee.user_id
                            );
                            const isMatched = employee.roleID === roleID && 
                                            employee.skillSetID === skillSetID;
                            
                            return (
                                <div 
                                    key={employee.user_id}
                                    className={`option ${isSelected ? 'selected' : ''} ${isMatched ? 'matched' : ''}`}
                                    onClick={() => handleSelectEmployee(employee)}
                                >
                                    <input 
                                        type="checkbox" 
                                        checked={isSelected}
                                        readOnly
                                    />
                                    <span className="employee-name">
                                        {employee.fullName}
                                        {isMatched && <span className="matched-badge">Matched</span>}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="btn-grp">
                <span>The auto allocation is auto saved even you exit this page</span>
                <PrimaryButton 
                    text="Confirm Allocation"
                    disabled={selectedEmp.length < taskValues.noOfEmp}
                    onClick={() => triggerSubmitConfirmAllocation()}
                />
            </div>
        </div>
    )
}

export default CreateEditTask