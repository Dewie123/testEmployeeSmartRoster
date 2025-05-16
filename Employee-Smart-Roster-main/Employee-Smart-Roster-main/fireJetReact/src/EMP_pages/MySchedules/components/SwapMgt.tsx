import { useEffect, useState } from 'react'
import { useAuth } from '../../../AuthContext'
import { useAlert } from '../../../components/PromptAlert/AlertContext'
import { SWAP_REQ_STATUS, NO_DATA_MATCHED } from '../../../controller/Variables.js'
import TimelineController from '../../../controller/TimelineController'

import { FaRegListAlt } from '../../../../public/Icons'
import '../MySchedules.css'
import '../../../../public/styles/common.css'

interface TaskForSwapProps {

}
const { viewAllIncomingSwapTime, viewAllSwapTime, updateSwapTimeStatus } = TimelineController
        
const SwapMgt = ({}:TaskForSwapProps) => {
    const { user } = useAuth()
    const { showAlert } = useAlert()
    const [ filterSwapRequestStatus, setFilterSwapRequestStatus ] = useState<string>(SWAP_REQ_STATUS[0])
    const [ allSwapRequest, setAllSwapRequest] = useState<any>([])
    const [ filteredSwapRequest, setFilteredSwapRequest ] = useState<any>([])
    const [ allIncomingSwap, setAllIncomingSwap ] = useState<any>([])
    const [ filteredIncomingSwap, setFilteredIncomingSwap ] = useState<any>([])

    // Get all swap request submitted
    const fetchAllSubmittedSwap = async () => {
        try {
            let response = await viewAllSwapTime (user?.UID)
            // console.log(response)
            if(response.message === 'Swap Request successfully retrieved, postViewEmployeeSwapRequest') {
                response = response.combinedEntry || []
                // console.log(response)
                setAllSwapRequest(response)
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
    // Get all incoming swap request received
    const fetchAllIncomingSwap = async () => {
        try {
            let response = await viewAllIncomingSwapTime (user?.UID)
            console.log(response)
            if(response.message === 'Swap Request successfully retrieved, postViewEmployeeIncomingSwapRequest') {
                // response = response.EmployeeSwapRequestList || []
                // console.log(response)
                setAllIncomingSwap(response)
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
        fetchAllSubmittedSwap()
        fetchAllIncomingSwap()
    }, [user])

    const triggerFilterReceivedSwap = () => {
        let filtered = allSwapRequest

        setFilteredSwapRequest(filtered)
    }
    // Auto trigger when all swap request changed
    useEffect(() => { triggerFilterReceivedSwap() }, [
        allSwapRequest
    ])
    const triggerFilterIncomingSwap = () => {
        let filtered = allIncomingSwap

        setFilteredIncomingSwap(filtered)
    }
    // Auto trigger when all incoming swap request changed
    useEffect(() => { triggerFilterIncomingSwap() }, [
        allIncomingSwap
    ])

    return(
        <div className="content swap-time-management">
            <h1>Swap Time Management</h1>
            <div className="submitted-time-swap">
                <div className="App-filter-search-component">
                    <div className="App-filter-container subscription-status">
                        <p className='App-filter-title'>Swap Request Status</p>
                        {/* Skillset dropdown */}
                        <select 
                            value={filterSwapRequestStatus}
                            onChange={(e) => setFilterSwapRequestStatus(e.target.value)}
                        >
                            {SWAP_REQ_STATUS.map((swapStatus:any) => (
                            <option key={swapStatus} value={swapStatus}>
                                {swapStatus}
                            </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="submitted-swap-list-container">
                    <h3>Submitted Swap Request</h3>
                    {filteredSwapRequest.length > 1 ? (
                        <>
                        {filteredSwapRequest.map((swapRequest: any) => (
                            <div 
                                key={swapRequest.senderDetails.swapReqID}
                                className="App-mobile-responsive-table-card"
                            >
                                <div className="App-mobile-responsive-table-card-title">
                                    <h2>{swapRequest.receiverDetails.fullName}</h2>
                                    <div
                                        className="App-mobile-table-icon"
                                        // onClick={() => handleDetailClick(user)}
                                    >
                                        <FaRegListAlt />
                                    </div>
                                </div>
                                <div className="App-mobile-responsive-table-card-data">
                                    <div className="App-mobile-responsive-table-card-data-detail">
                                        <p className="App-mobile-responsive-table-card-data-title swap-request-task-title">
                                            From
                                        </p>
                                        <p>{swapRequest.senderDetails.taskName}</p>
                                    </div>
                                    <div className="App-mobile-responsive-table-card-data-detail">
                                        <p className="App-mobile-responsive-table-card-data-title swap-request-task-title">
                                            To
                                        </p>
                                        <p>{swapRequest.receiverDetails.taskName}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </>
                    ):(
                        <p>{NO_DATA_MATCHED}</p>
                    )}
                </div>
                
            </div>
            <div className="submitted-swap-list-container">
                    <h3>Received Swap Request</h3>
                    {filteredIncomingSwap.length > 1 ? (
                        <>
                        {filteredIncomingSwap.map((swapRequest: any) => (
                            <div 
                                key={swapRequest.receiverDetails.swapReqID}
                                className="App-mobile-responsive-table-card"
                            >
                                <div className="App-mobile-responsive-table-card-title">
                                    <h2>{swapRequest.receiverDetails.fullName}</h2>
                                    <div
                                        className="App-mobile-table-icon"
                                        // onClick={() => handleDetailClick(user)}
                                    >
                                        <FaRegListAlt />
                                    </div>
                                </div>
                                <div className="App-mobile-responsive-table-card-data">
                                    <div className="App-mobile-responsive-table-card-data-detail">
                                        <p className="App-mobile-responsive-table-card-data-title swap-request-task-title">
                                            From
                                        </p>
                                        <p>{swapRequest.senderDetails.taskName}</p>
                                    </div>
                                    <div className="App-mobile-responsive-table-card-data-detail">
                                        <p className="App-mobile-responsive-table-card-data-title swap-request-task-title">
                                            To
                                        </p>
                                        <p>{swapRequest.receiverDetails.taskName}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </>
                    ):(
                        <p>{NO_DATA_MATCHED}</p>
                    )}
                </div>
        </div>
    )
}

export default SwapMgt