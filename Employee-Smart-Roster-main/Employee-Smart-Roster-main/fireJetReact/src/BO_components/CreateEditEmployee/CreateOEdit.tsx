import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { useAlert } from "../../components/PromptAlert/AlertContext"; 
import { PASS_TYPE, FIRST_3_MIN_MC, MIN_YEAR1_ANNUAL } from '../../controller/Variables.js';
import CompanyController from "../../controller/CompanyController";
import CreateEditAccount from "./EmployeeForm";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";

import { FaPlusCircle } from '../../../public/Icons.js'
import "./CreateNEditEmp.css"
import "../../../public/styles/common.css";

interface employeeProps {
    isCreate: boolean
    selectedEmpValues?: any;
    onEmpAdd?: (newEmp: any) => void;
    onEmpUpdate?: (updatedEmpData: any) => void;
    onCloseDetail?: () => void
}

const { getCompanyRoles, getCompanySkillsets } = CompanyController;

const CreateOEditEmp = ({ 
    isCreate, selectedEmpValues, 
    onEmpAdd, onEmpUpdate , onCloseDetail
}: employeeProps) => {
    // const [ isCreate, setIsCreate ] = useState(true)
    const { user } = useAuth();
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const location = useLocation();
    const navState = location.state as {
        defaultValues?: any;
        allRoles?: any[];
        allSkillsets?: any[];
    };
    const [ allRoles, setAllRoles ] = useState<any>([]);
    const [ allSkillsets, setAllSkillsets ] = useState<any>([]);
    const [ showEmpForm, setShowEmpForm ] = useState(false);
    const isMobile = window.innerWidth <= 768;
    const [ createEmpValues, setCreateEmpValues ] = useState({
        email: '',
        nric: '',
        hpNo: '',
        fullName: '',
        resStatusPassType: PASS_TYPE[0],
        jobTitle: '',
        roleID: '',
        skillSetID: '',
        startWorkTime: '09:00',
        endWorkTime: '18:00',
        daysOfWork: 5,
        noOfLeave: FIRST_3_MIN_MC,
        noOfMC: MIN_YEAR1_ANNUAL
    });

    const fetchRolesNSkillsets = async() => {
        try {
            // Fetch Roles
            let roles = await getCompanyRoles(user?.UID);
            roles = roles.roleName
            // console.log(roles)
            setAllRoles(roles)

            // Fetch Skillsets
            let skillsets = await getCompanySkillsets(user?.UID);
            skillsets = skillsets.skillSets
            // console.log(skillsets)
            setAllSkillsets(skillsets)
        } catch (error) {
            showAlert(
                "fetchRolesNSkillsets",
                "Fetch Roles or Skillsets error",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    }
    // Auto trigger when the user's UID changed
    useEffect(() => { fetchRolesNSkillsets() }, [user?.UID])

    useEffect(() => {
        if (allRoles.length > 0 && allSkillsets.length > 0) {
            setCreateEmpValues((prev) => ({
                ...prev,
                roleID: allRoles[0].roleName,
                skillSetID: allSkillsets[0].skillSetName
            }));
        }
    }, [allRoles, allSkillsets]);

    function toggleShowEmpForm (){
        if(isMobile && isCreate)
            navigate('/create-employee', {
                state: {
                    defaultValues: createEmpValues,
                    allRoles,
                    allSkillsets
                }
            })

        if(isMobile && !isCreate)
            navigate('/edit-employee', {
                state: {
                    defaultValues: selectedEmpValues,
                    allRoles,
                    allSkillsets
                }
            })
        else
            setShowEmpForm(!showEmpForm)
    }
    // Create new employee
    if (isMobile && isCreate && navState && allRoles && allSkillsets) {
        return (
            <CreateEditAccount
                isCreate={true}
                bo_UID={user?.UID}
                defaultValues={navState.defaultValues}
                allRoles={navState.allRoles}
                allSkillsets={navState.allSkillsets}
                onEmpAdd={onEmpAdd}
                onClose={() => navigate(-1)}
            />
        );
    }
    // Update employee information
    if (isMobile && !isCreate && navState && allRoles && allSkillsets) {
        return (
            <CreateEditAccount
                isCreate={false}
                bo_UID={user?.UID}
                defaultValues={navState.defaultValues}
                allRoles={navState.allRoles}
                allSkillsets={navState.allSkillsets}
                onEmpUpdate={onEmpUpdate}
                onClose={() => navigate(-1)}
            />
        );
    }

    return (
        <>
        {isCreate ? (
            // If current in create mode
            <>
                <FaPlusCircle 
                    onClick={() => toggleShowEmpForm()} 
                    className="create-new-emp-icon" 
                />
                {showEmpForm && !isMobile && (
                    <div className="App-popup" onClick={() => toggleShowEmpForm()}>
                        <CreateEditAccount 
                            isCreate = {isCreate}
                            bo_UID={user?.UID}
                            defaultValues={createEmpValues}
                            allRoles={allRoles}
                            allSkillsets={allSkillsets}
                            onEmpAdd={onEmpAdd}
                            onClose={() => toggleShowEmpForm()}
                        />
                    </div>
                )}
            </>
        ) : (
            <>
                <PrimaryButton 
                    text="Edit Employee Information"
                    onClick={() => toggleShowEmpForm()}
                />
                {showEmpForm && !isMobile && (
                    <div className="App-popup" onClick={() => toggleShowEmpForm()}>
                        <CreateEditAccount 
                            isCreate = {isCreate}
                            bo_UID={user?.UID}
                            defaultValues={selectedEmpValues}
                            allRoles={allRoles}
                            allSkillsets={allSkillsets}
                            onEmpUpdate={onEmpUpdate}
                            onCloseDetail={onCloseDetail}
                            onClose={() => toggleShowEmpForm()}
                        />
                    </div>
                )}
            </>
        )}
        </>
    )
    
}

export default CreateOEditEmp