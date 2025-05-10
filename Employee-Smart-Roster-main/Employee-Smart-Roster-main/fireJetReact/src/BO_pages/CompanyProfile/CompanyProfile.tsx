import { useEffect, useState } from 'react'
import { useAlert } from '../../components/PromptAlert/AlertContext'
import { useAuth } from '../../AuthContext'
import { formatPhoneNumber } from '../../controller/Variables.js'
import CompanyController from '../../controller/CompanyController'
import EditCompanyProfile from './components/EditCompanyPr'

import { FaRegBuilding } from "react-icons/fa";
import { FaFilePdf, FaRegEdit, 
         MdDeleteForever, FaPlusCircle } from '../../../public/Icons.js'
import './CompanyProfile.css'
import '../../../public/styles/common.css'

const { getCompany, getCompanyRoles, 
        getCompanySkillsets, getCompanyBizFile,
        createSkillset, createRole,
        removeRole, removeSkillset,
        checkIfRoleCreated, checkIfSkillsetCreated } = CompanyController;

const BOCompanyProfile = () => {
    const { user } = useAuth();
    const { showAlert } = useAlert();
    const [ companyInfo, setCompanyInfo ] = useState<any>([])
    const [ bizFileURL, setBizFileURL ] = useState<string>('')
    const [ allRoles, setAllRoles ] = useState<any>([])
    const [ allSkillsets, setAllSkillsets ] = useState<any>([]) 
    const [ newRole, setNewRole ] = useState<string>('')
    const [ selectedRoleForNewSkill, setSelectedRoleForNewSkill ] = useState<any>('')
    const [ newSkillset, setNewSkillset ] = useState<string>('')
    const [ showEditCompanyProfile, setShowEditCompanyProfile ] = useState(false)

    const fetchCompanyProfile = async() => {
        if (!user?.UID) return;
        try {
            const companyData = await getCompany(user?.UID);
            // console.log(companyData)
            setCompanyInfo(companyData)

            let companyRoles = await getCompanyRoles(user?.UID);
            companyRoles = companyRoles.roleName;
            // console.log(companyRoles)
            setAllRoles(Array.isArray(companyRoles) ? companyRoles : []);

            let companySkillsets = await getCompanySkillsets(user?.UID);
            companySkillsets = companySkillsets.skillSets;
            // console.log(companySkillsets)
            setAllSkillsets(Array.isArray(companySkillsets) ? companySkillsets : []);

            // Get company biz file
            await fetchBizFilePDF();
        } catch (error) {
            showAlert(
                "fetchCompanyProfile",
                "Fetch data error",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    }
    useEffect(() => {
        if(user?.UID)
            fetchCompanyProfile();
    }, [user?.UID])

    const fetchBizFilePDF = async () => {
        try {
            const fileData = await getCompanyBizFile (user?.email);
            // Decode base64 to binary string
            const byteCharacters = atob(fileData.fileData);
            const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) =>
                byteCharacters.charCodeAt(i)
            );
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });

            const pdfUrl = URL.createObjectURL(blob);
            // console.log(pdfUrl)
            setBizFileURL(pdfUrl)
        } catch (error) {
            showAlert(
                'fetchBizFilePDF',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    // Create new role
    const triggerCreateRole = async () => {
        let isSameRoleCreated = allRoles;
        // console.log(allRoles)
        if(isSameRoleCreated)
            isSameRoleCreated = await checkIfRoleCreated(allRoles, newRole)
        // console.log(isSameRoleCreated)
        if(isSameRoleCreated.length > 0) { // If the role is created before
            showAlert(
                'Create Role',
                `Create Role Failed`,
                `"${newRole}" is created before`,
                { type: 'error' }
            );
        } else {
            try {
                const response = await createRole (newRole, user?.UID)
                // console.log(response)
                if(response.message === "Role successfully added") {
                    const lastRoleNo = response.roleID.length - 1
                    const newRoleID = response.roleID[lastRoleNo].roleID
                    const newRoleObj = {
                        roleName: newRole,
                        roleID: newRoleID
                    };
    
                    setAllRoles((prevRoles: any) => [
                        ...prevRoles, 
                        newRoleObj
                    ]);

                    showAlert(
                        'Create Role',
                        ``,
                        `Role: "${newRole}" Created successfully`,
                        { type: 'success' }
                    );

                    setNewRole('')
                }
            } catch(error) {
                showAlert(
                    'triggerCreateRole',
                    '',
                    error instanceof Error ? error.message : String(error),
                    { type: 'error' }
                );
            }
        }
    }

    // Create new skillset
    const triggerCreateSkillset = async () => {
        let isSameSkillsetCreated = [];
        if(allSkillsets)
            isSameSkillsetCreated = await checkIfSkillsetCreated(allSkillsets, newSkillset)
        // console.log(isSameSkillsetCreated)
        if(isSameSkillsetCreated.length > 0) { // If the role is created before
            showAlert(
                'Create Skillset',
                `Create Skillset Failed`,
                `"${newSkillset}" is created before`,
                { type: 'error' }
            );
        } else {
            try {
                const response = await createSkillset (newSkillset, user?.UID, selectedRoleForNewSkill)
                // console.log(response)
                if(response.message === "Skillset added successfully") {
                    const lastSkillNo = response.skillSetID.length - 1
                    const newSkillSetID = response.skillSetID[lastSkillNo].skillSetID
                    const newSkillSetObj = {
                        skillSetName: newSkillset,
                        skillSetID: newSkillSetID
                    };
    
                    setAllSkillsets((prevSkills: any) => [
                        ...prevSkills, 
                        newSkillSetObj
                    ]);

                    showAlert(
                        'Create Skillset',
                        ``,
                        `Skillset: "${newSkillset}" Created successfully`,
                        { type: 'success' }
                    );

                    setNewSkillset('')
                }
            } catch(error) {
                showAlert(
                    'triggerCreateSkillset',
                    '',
                    error instanceof Error ? error.message : String(error),
                    { type: 'error' }
                );
            }
        }
    }

    // Remove role
    const triggerRemoveRole = async(roleName: string) => {
        try {
            const response = await removeRole(roleName, user?.UID)
            // console.log(response)

            if(response.message === 'Role deleted successfully') {
                // Update removal locally
                const removedRole = allRoles.filter((role: any) => 
                    role.roleName !== roleName
                )
                setAllRoles(removedRole)
                showAlert(
                    'Remove Role',
                    ``,
                    `Role: "${roleName}" Removed successfully`,
                    { type: 'success' }
                );
            }

        } catch (error) {
            showAlert(
                'triggerRemoveRole',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    // Remove skillset
    const triggerRemoveSkillset = async(skillSetName: string) => {
        try {
            const response = await removeSkillset(skillSetName, user?.UID)
            // console.log(response)

            if(response.message === 'Skillset deleted successfully') {
                // Update removal locally
                const removedSkillset = allSkillsets.filter((skill: any) => 
                    skill.skillSetName !== skillSetName
                )
                setAllSkillsets(removedSkillset)
                showAlert(
                    'Remove Role',
                    ``,
                    `Role: "${skillSetName}" Removed successfully`,
                    { type: 'success' }
                );
            }

        } catch (error) {
            showAlert(
                'triggerRemoveRole',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    if(!companyInfo) return "Company Information is Loading..."

    function toggleEditCompanyProfile() {
        setShowEditCompanyProfile(!showEditCompanyProfile)
    }

    // Update Company Profile Locally
    function handleUpdateCompanyProfile(updatedData: any) {
        setCompanyInfo(updatedData)
    }

    return (
        <>
        {companyInfo && (
            <>
            <div className="content company-profile-page-container">
                <h1>My Company</h1>
                <div className="company-profile-page-top">
                    <div className="company-profile card">
                        <div className="company-profile-title">
                                <FaRegBuilding className='company-profile-icon'/>
                            <div className="company-profile-title-end">
                                <a href={bizFileURL}
                                    target="_blank"
                                    onClick={bizFileURL ? undefined : (e) => {
                                        e.preventDefault();
                                    }}
                                    className="icons"
                                >
                                    <FaFilePdf />
                                </a>
                                <FaRegEdit 
                                    className='edit-company-profile'
                                    onClick={() => toggleEditCompanyProfile()}
                                />
                            </div>
                        </div>
                        <div className="company-profile-data uen odd-row">
                            <p className="title">UEN</p>
                            <p className="main-data">{companyInfo.UEN}</p>
                        </div>
                        <div className="company-profile-data company-name ">
                            <p className="title">Company Name</p>
                            <p className="main-data">{companyInfo.bizName}</p>
                        </div>
                        <div className="company-profile-data company-address odd-row">
                            <p className="title">Address</p>
                            <p className="main-data">{companyInfo.address}</p>
                        </div>
                        <div className="company-profile-data company-contact">
                            <p className="title">Contact Number</p>
                            <p className="main-data">{formatPhoneNumber(String(companyInfo.contactNo))}</p>
                        </div>
                    </div> 
    
                    <div className="create-new-role-n-skill card">
                        <h3>Create New Role</h3>
                        <div className="add-new-role">
                            <input type='text' 
                                name='role'
                                placeholder='Input New Role Here...' 
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                                required
                            />
                            <button 
                                className="add-role-skill"
                                onClick={() => triggerCreateRole()}
                                disabled = {!newRole}
                            >
                                <FaPlusCircle/>
                            </button>
                        </div>
                        <div className="create-new-skillset-card">
                            <h3>Create New Skillset</h3>
                            {/* Role */}
                            <div className='forms-input'>
                                {/* Role dropdown */}
                                <select 
                                    name="roleID"
                                    value={selectedRoleForNewSkill}
                                    onChange={(e) => setSelectedRoleForNewSkill(e.target.value)}
                                >
                                    <option value={''}>No Role Selected</option>
                                    {allRoles.map((role:any) => (
                                    <option key={role.roleID} value={role.roleID}>
                                        {role.roleName}
                                    </option>
                                    ))}
                                </select>
                            </div>

                            <div className="add-new-skillset">
                                <input type='text' 
                                    name='skillset'
                                    placeholder='Input New Skillset Here...' 
                                    value={newSkillset}
                                    onChange={(e) => setNewSkillset(e.target.value)}
                                    required
                                />
                                <button 
                                    className={`add-role-skill 
                                        ${!newSkillset || !selectedRoleForNewSkill ? 'disabled' : ''}`}
                                    onClick={() => triggerCreateSkillset()}
                                    disabled = {!newSkillset || !selectedRoleForNewSkill}
                                >
                                    <FaPlusCircle/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="roles-n-skillsets-container">
                    <div className="roles card">
                        <h3>Roles</h3>
                        {!allRoles || allRoles.length === 0 ? (
                            <p className='role-n-skillset-text even-row'>
                                No Role Added
                            </p>
                        ) : (
                            allRoles?.map((role:any, index: any) => (
                                <p key={role.roleID}
                                    className={`role-n-skillset-text 
                                    ${index % 2 === 0 ? 'even-row' : ''}`}
                                >
                                    {role.roleName}
                                    <MdDeleteForever 
                                        className='icons remove-role-n-skillset-icon'
                                        onClick={() => triggerRemoveRole(role.roleName)}
                                    />
                                </p>
                            ))
                        )}
                    </div>
    
                    <div className="skillsets card">
                        <h3>Skillsets</h3>
                        {!allSkillsets || allSkillsets.length === 0 ? (
                            <p className='role-n-skillset-text even-row'>
                                No Skillset Added
                            </p>
                        ) : (
                            allSkillsets?.map((skillset:any, index:number) => (
                                <p key={skillset.skillSetID}
                                    className={`role-n-skillset-text 
                                                ${index % 2 === 0 ? 'even-row' : ''}`}
                                >
                                    {skillset.skillSetName}
                                    <MdDeleteForever 
                                        className='icons remove-role-n-skillset-icon'
                                        onClick={() => triggerRemoveSkillset(skillset.skillSetName)}
                                    />
                                </p>
                            ))
                        )}
                    </div>
                </div>
            </div>
            {showEditCompanyProfile && (
                <EditCompanyProfile 
                    companyData={companyInfo}
                    onClose={toggleEditCompanyProfile}
                    onUpdate={handleUpdateCompanyProfile}
                />
            )}
            </>
        )}
        </>
        
        
    );
}

export default BOCompanyProfile;