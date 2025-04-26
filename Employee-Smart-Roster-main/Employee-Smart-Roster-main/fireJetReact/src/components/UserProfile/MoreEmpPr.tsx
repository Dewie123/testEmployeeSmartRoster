import { useState, useEffect } from 'react'
import { useAlert } from '../../components/PromptAlert/AlertContext'
import CompanyController from '../../controller/CompanyController.js'
import UserController from '../../controller/User/UserController.js'
import BOEmployeeController from '../../controller/BOEmployeeController'

import { TiTime } from '../../../public/Icons.js'
import './styles.css'
import '../../../public/styles/common.css'

interface EmpMoreUserProfileDetailProps {
    userData: any
}

const { getCompanyRoles, getCompanySkillsets } =  CompanyController
const { getRoleNameForEmp, getSkillNameForEmp } = BOEmployeeController

const EMP_MoreUserPrDetail = ({ userData }: EmpMoreUserProfileDetailProps) => {
    const { showAlert } = useAlert();
    const [ role, setRole ] = useState<any>([]);
    const [ skillset, setSkillset ] = useState<any>([]);
    const fetchAllocatedRoleNSkillset = async() => {
        try {
            const allRoles = await getCompanyRoles(userData.business_owner_id);
            const allocatedRole = getRoleNameForEmp(allRoles.roleName, userData.roleID);
            // console.log("Allocated Role: ", allocatedRole)
            setRole(allocatedRole[0])

            const allSkillsets = await getCompanySkillsets(userData.business_owner_id);
            const allocatedSkillsets = getSkillNameForEmp(allSkillsets.skillSets, userData.skillSetID);
            // console.log("Allocated Skillset: ", allocatedSkillsets)
            setSkillset(allocatedSkillsets[0])

        } catch (error) {
            showAlert(
                "fetchRole",
                "Fetch data error",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    }

    useEffect(() => {fetchAllocatedRoleNSkillset()}, [userData])

    return(
        <>
        {role && skillset && (
            <>
            <h3>Job Detail</h3>
            <div className="user-profile-data job-title even-row">
                <p className="title">JOB TITLE</p>
                <p className="main-data">{userData.jobTitle}</p>
            </div>
            <div className="user-profile-data working-time">
                <div className="title user-profile-title-icon">
                    <TiTime />
                    <p className="title-with-icon">{userData.standardWrkHrs} hrs/day</p>
                </div>
                <p className="main-data">
                    {userData.startWorkTime.split(":")[0]}:{userData.startWorkTime.split(":")[1]}&nbsp;
                    to&nbsp;
                    {userData.endWorkTime.split(":")[0]}:{userData.endWorkTime.split(":")[1]}
                    <br />
                    {userData.daysOfWork} days per week
                </p>
            </div>
            <div className="user-profile-data role even-row">
                <p className="title">ROLE</p>
                <p className="main-data">{role.roleName}</p>
            </div>
            <div className="user-profile-data skillset">
                <p className="title">SKILLSET</p>
                <p className="main-data">{skillset.skillSetName}</p>
            </div>
            </>
        )}
        </>
    )
}

export default EMP_MoreUserPrDetail