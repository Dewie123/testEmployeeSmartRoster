import { useAuth } from '../../AuthContext';
import { useEffect, useState } from 'react';
import { useAlert } from '../../components/PromptAlert/AlertContext';
import UserController from '../../controller/User/UserController';
import SASide from '../../components/SideMenu/SASide';
import UserList from '../../components/UserMgt/UserList';
import BOUserList from '../../SA_components/BOUserMgts/UserList';
import BOSide from '../../components/SideMenu/BOSide';
import EmployeeTableContainer from '../../components/EmployeeMgt/EmployeeTableContainer';


import './UserMgts.css'
import "../../../public/styles/common.css"


// Import functions needed from UserController
const { getUsers, getBOUsers, handleFilterRole } = UserController
const UserType = ['Business Owner', 'System Admin', 'Employee']

const UserMgts = () => {
    const { showAlert } = useAlert()
    const { user } = useAuth();
    const [ allUsers, setAllUsers ] = useState<any>([]);
    const [ bizOwners, setBizOwners ] = useState<any>([]);
    const [ employee, setEmployee ] = useState<any>([]);
    const [ error, setError ] = useState("")

    const fetchUsersData = async () => {
        try {
            const response = getUsers();
            setAllUsers(Array.isArray(response) ? response : []);
        } catch (err) {
            setError(`${err}`);
            setAllUsers([]);
        }

        if(error)
            showAlert(
                "UserMgts page",
                '',
                error,
                { type: 'error' }
            )
    }
    // Auto trigger when allUsers length change
    useEffect(() => { fetchUsersData(); }, [allUsers.length])
    // useEffect(() => { console.log(allUsers); }, [allUsers.length])

    const filterEmployee = async () => {
        try {
            const filter = handleFilterRole(allUsers, UserType[2]); // Filter Business Owner
            setBizOwners(Array.isArray(filter) ? filter : []);
        } catch (error) {
            setError(error instanceof Error ? error.message : String(error))
            setEmployee([])
        }
        if(error)
            showAlert(
                "filterEmployee",
                "Fetch data error",
                error,
                { type: 'error' }
            )
    }

    const fetchBoUsersData = async () => {
        try{
            const data = await getBOUsers();
            const boList = data.BOList || [];
            // console.log(boList)
            setBizOwners(Array.isArray(boList) ? boList : []);
        } catch(error) {
            showAlert(
                "fetchBoUsersData",
                "Fetch data error",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    }
    useEffect(() => {
        fetchBoUsersData();
    }, [bizOwners.length, user?.role === UserType[1]])
    // useEffect(() => {console.log(bizOwners)},[bizOwners])



    return (
        <div className='App-content'>
            
            {/* Display side menu base on user role */}
            {user?.role === 'System Admin' && (
                <>
                    <SASide />
                    <div className="content">
                        <h1>Business Owner Management</h1>
                        {bizOwners.length === 0 ? (
                            <div>Loading business owners...</div>
                        ) : (
                            <BOUserList boUsers={bizOwners} />
                        )}
                    </div>
                </>
            )}

            {user?.role === 'Business Owner' && (
                <>
                    <BOSide />
                    <div className="content">
                        <h1>My Employee</h1>
                        <EmployeeTableContainer />
                    </div>
                </>
            )}
        </div>
    );
    
}

export default UserMgts;