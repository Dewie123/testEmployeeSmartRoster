import { useState, useEffect } from 'react'
import { useAuth } from '../../AuthContext'
import { useAlert } from '../../components/PromptAlert/AlertContext'
import { USER_ROLE, NO_DATA_MATCHED, LEAVE_STATUS } from '../../controller/Variables'
import CreateOEditLeave from './components/CreateOEditLeave'
import LeaveMgtController from '../../controller/LeaveMgtController'
import LeaveMgt_t from './components/LeaveMgt_t'
import LeaveMgt_m from './components/LeaveMgt_m'

import './LeaveManagement.css'
import '../../../public/styles/common.css'

const { empGetAllLeave } = LeaveMgtController;

const LeaveManagement = () => {
    const { showAlert } = useAlert();
    const { user } = useAuth();
    const [ allLeaves, setAllLeave ] = useState<any>([])
    const [ filteredLeaves, setFilteredLeaves ] = useState<any>([])

    const fetchEmpSubmittedLeave = async () => {
        try {
            const response = await empGetAllLeave(user?.UID)
            // console.log(response)
            const leaves = response.leaveDetails || []
            setAllLeave(leaves)
        } catch(error) {
            showAlert(
                "fetchEmpSubmittedLeave",
                `Failed to fetch all submitted leave`,
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }
    useEffect(() => { 
        if(user?.role === USER_ROLE[2])
            fetchEmpSubmittedLeave() 
    }, [user])

    const handleFilterLeaves = async () => {
        let filtered = allLeaves 
        setFilteredLeaves(filtered)
    }
    useEffect(() => { handleFilterLeaves() }, [allLeaves])

    // Update create locally
    function onLeaveCreate(newData: any) {
        // console.log(newData)
        const leaves = [
            ...allLeaves,
            {
                ...newData,
                status: LEAVE_STATUS[0],
                submittedAt: new Date().toISOString()
            }
        ]
        // console.log(leaves)
        setAllLeave(leaves)
    }

    // Update leave status change locally
    function onLeaveChangeStatus(updatedLeave: any) {
        // console.log(updatedLeave)
        const leaves = allLeaves.map((leave: any) => 
            leave.leaveID === updatedLeave.leaveID 
            ? updatedLeave
            : leave
        )
        setAllLeave(leaves)
    }

    return(
        <div className="App-content">
            <div className="content">
                <div className="leave-mgt-page-title">
                    <h1>Leave/MC Management</h1>
                    <CreateOEditLeave 
                        isCreate={true}
                        onCreate={onLeaveCreate}
                    />
                </div>

                {filteredLeaves.length > 0 ? (
                    <>
                        <LeaveMgt_t 
                            leaves={filteredLeaves}
                            user={user}
                            onUpdateLeave={onLeaveChangeStatus}
                        />
                        <LeaveMgt_m
                            leaves={filteredLeaves}
                            user={user}
                            onUpdateLeave={onLeaveChangeStatus}
                        />
                    </>
                ) : (
                    <p>{NO_DATA_MATCHED}</p>
                )}
            </div>
        </div>
    )
}

export default LeaveManagement