import { useState, useEffect } from "react";
import { useAlert } from "../../../components/PromptAlert/AlertContext";
import PrimaryButton from "../../../components/PrimaryButton/PrimaryButton";
import TimelineController from "../../../controller/TimelineController";

import { IoClose, FaPlusCircle } from '../../../../public/Icons.js'
import './CreateNEditTask.css'
import '../../../../public/styles/common.css'

interface TimelineFormProps {
    isCreateTask: boolean;
    defaultValues: any;
    bo_UID: any;
    newTimelineValue: (timelineValue: any) => void;
}

const { createNewTimeline, getTimelines, getTimelineSelected } = TimelineController

const TimelineForm = ({ 
    isCreateTask, defaultValues, bo_UID, newTimelineValue
}: TimelineFormProps) => {
    // console.log(bo_UID)
    const { showAlert } = useAlert()
    const [ isCreateTimeline, setIsCreateTimeline ] = useState(false)
    const [ allTimelines, setAllTimelines ] = useState<any>([])
    const [ timelineValue, setTimelineValues ] = useState({
        timeLineID: '',
        title: '',
        timeLineDescription: '',
    })
    useEffect(() => { 
        timelineDefaultSetup() 
    }, [isCreateTask, allTimelines.length])
    // Set default timeline setup
    function timelineDefaultSetup() {
        if(isCreateTask) {
            if(allTimelines.length > 0) {
                const initialTimeline = allTimelines[0];
                const value = {
                    timeLineID: initialTimeline.timeLineID,
                    title: initialTimeline.title,
                    timeLineDescription: initialTimeline.timeLineDescription,
                };
                setTimelineValues(value);
                if(newTimelineValue)
                    newTimelineValue(value)
            }
        } else {
            setTimelineValues(defaultValues);
        }
    }

    const handleInputChange = (event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >) => {
        const { name, value } = event.target;
        setTimelineValues((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const triggerFetchAllTimelines = async() => {
        try {
            let response = await getTimelines(bo_UID);
            if (response.message === 'Timeline retrieved successfully.'){
                response = response.timeline || [];
                // console.log(response)
                setAllTimelines(response)
                if(response.length > 0) {
                    setTimelineValues(response[0]) //Set 1st selected timeline
                }
            }
        } catch(error) {
            showAlert(
                "triggerFetchAllTimelines",
                `Failed to Fetch All Timelines`,
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }
    useEffect(() => {triggerFetchAllTimelines()}, [defaultValues, bo_UID])

    const handleSelectedTimeline = (timeLineID: any) => {
        // console.log(timeLineID)
        const timelineMatch = getTimelineSelected(allTimelines, timeLineID)
        // console.log(timelineMatch)
        if (timelineMatch) {
            const value = {
                timeLineID: timelineMatch.timeLineID,
                title: timelineMatch.title,
                timeLineDescription: timelineMatch.timeLineDescription,
            }
            setTimelineValues(value)
            if(newTimelineValue)
                newTimelineValue(value)
        }
    }

    const triggerCreateTimeline = async() => {
        try {
            const response = await createNewTimeline (bo_UID, timelineValue)
            // console.log(response)
            // Return: message, timeLineID
            if(response.message === 'Timeline created successfully') {
                const newData = {
                    ...timelineValue,
                    timeLineID: response.timelineID
                }
                // console.log(newData)
                if(newTimelineValue)
                    newTimelineValue(newData)

                setTimelineValues({
                    timeLineID: newData.timeLineID,
                    title: newData.title,
                    timeLineDescription: newData.timeLineDescription,
                })
                toggleisCreateTimeline()
            }
        } catch(error) {
            showAlert(
                "triggerCreateTimeline",
                `Failed to Create Timeline for "${timelineValue.title}"`,
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    function toggleisCreateTimeline() {
        setIsCreateTimeline(!isCreateTimeline)
    }

    if(isCreateTimeline) return (
        <div className="App-popup" onClick={toggleisCreateTimeline}>
            <div className='App-popup-content' onClick={(e) => e.stopPropagation()}>
                <div className='App-header'>
                    <h1>Create New Timeline</h1>
                    <IoClose 
                        className="icons"
                        onClick={toggleisCreateTimeline}
                    />
                </div>
                <div className="App-popup-main-content">
                    {/* Input Timeline Title */}
                    <div className='forms-input'>
                        <strong>
                            Timeline Title <span style={{ color: 'red' }}>*</span>
                        </strong>
                        <input type='text' 
                            name='title'
                            placeholder='Timeline Title' 
                            value={timelineValue.title}
                            onChange={(e) => handleInputChange(e)}
                            required
                        />
                    </div>
                    {/* Input Task Description */}
                    <div className='forms-input'>
                        <strong>
                            Timeline Description <span style={{ color: 'red' }}>*</span>
                        </strong>
                        <textarea name='timeLineDescription'
                            rows={4}
                            placeholder='Timeline Description' 
                            value={timelineValue.timeLineDescription}
                            onChange={(e) => handleInputChange(e)}
                            required
                        />
                    </div>
                    <PrimaryButton 
                        text="Create Timeline"
                        disabled={!timelineValue.title
                                || !timelineValue.timeLineDescription}
                        onClick={() => triggerCreateTimeline()}
                    />
                </div>
            </div>
        </div>
    )

    return (
        <div className="timeline-creation-form card">
            {/* Available Timeline */}
            <div className='forms-input'>
                <strong className="select-available-timeline-title">
                    Select Available Timeline 
                    <FaPlusCircle 
                        className="create-new-timeline-icon"
                        onClick={toggleisCreateTimeline}
                    />
                </strong>
                <div className="fields">
                    {/* Timeline dropdown */}
                    <select 
                        id="selectTimeline"
                        name="timelineValue"
                        value={timelineValue.timeLineID}
                        onChange={(e) => handleSelectedTimeline(e.target.value)}
                    >
                        {allTimelines.map((timeline:any) => (
                        <option key={timeline.timeLineID} value={timeline.timeLineID}>
                            {timeline.title}
                        </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}

export default TimelineForm