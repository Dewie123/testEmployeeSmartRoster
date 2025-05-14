import { useState, useEffect } from 'react'
import { useAuth } from '../../AuthContext'
import { useAlert } from '../../components/PromptAlert/AlertContext'
import { USER_ROLE } from '../../controller/Variables'
import CreateOEditLeave from './components/CreateOEditLeave'
import LeaveMgtController from '../../controller/LeaveMgtController'
import UserController from '../../controller/User/UserController'

import './LeaveManagement.css'
import '../../../public/styles/common.css'

const { empGetAllLeave } = LeaveMgtController;
const { empGetUserProfile } = UserController;

const LeaveManagement = () => {
    const { showAlert } = useAlert();
    const { user } = useAuth();
    const [ allLeaves, setAllLeave ] = useState<any>([])
    const [ filteredLeaves, setFilteredLeaves ] = useState<any>([])

    const fetchEmpSubmittedLeave = async () => {
        try {
            const response = await empGetAllLeave(user?.UID)
            console.log(response)
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

    return(
        <div className="App-content">
            <div className="content">
                <div className="leave-mgt-page-title">
                    <h1>Leave Management</h1>
                    <CreateOEditLeave 
                        isCreate={true}
                    />
                </div>

            </div>
        </div>
    )
}

export default LeaveManagement