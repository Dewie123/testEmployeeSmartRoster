import { useState } from "react";
import "../../../../public/styles/common.css";
import CreateEmployeeController from "../../../controller/CreateEmployeeController";
import SubmitButton from "../../../components/PrimaryButton/PrimaryButton";
import { IoClose } from "react-icons/io5"; 
import { useAlert } from "../../../components/PromptAlert/AlertContext"; 
import "./CreateEmployee.css"

const CreateAccount = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const [employeeData, setEmployeeData] = useState({
        name: "",
        email: "",
        hpNo: "",
        resStatusPassType: "",
        jobTitle: "",
        roleID: "",
        standardWrkHrs: "",
        skillSetID: "",
        noOfLeave: "",
        noOfLeaveAvailable: "",
        noOfMC: "",
        noOfMCAvailable: "",
        startWorkTime: "",
        endWorkTime: "",
        daysOfWork: "",
        activeOrInactive: "",
    });

    const { showAlert } = useAlert();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setEmployeeData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        console.log("Submitted Employee Data:", employeeData);

        const requestData = {
            business_owner_id: 2,
            user_id: 10,
            email: "test@test.com",
            hpNo: 91234567,
            resStatusPassType: "Work Permit",
            jobTitle: "Test Title",
            roleID: 3,
            standardWrkHrs: 10,
            skillSetID: 3,
            noOfLeave: 10,
            noOfLeaveAvailable: 5,
            noOfMC: 5,
            noOfMCAvailable: 4,
            startWorkTime: "10:00:00",
            endWorkTime: "12:00:00",
            daysOfWork: 6,
            activeOrInactive: 1,
        };

        try {
            const response = await CreateEmployeeController.createEmployee(requestData);
            console.log(response);

            showAlert(
                `Employee Account Created`, 
                "The employee account has been created successfully.", 
                "Account Created", 
                { type: "success" }
            );

            setIsPopupOpen(false);
            console.log("Employee created successfully:", response);
        } catch (error) {
            console.error("Error creating employee:", error);
            showAlert("Error", "There was an error creating the employee account.", "Error", { type: "error" });
        }
    };

    return (
        <div>
            <SubmitButton onClick={() => setIsPopupOpen(true)} text="Create Account" />

            {isPopupOpen && (
                <div className="App-popup">
                    <div className="App-popup-content">
                        <div className='App-header'>
                            <h1>Create Account</h1>
                            <button className='icons' onClick={() => setIsPopupOpen(false)}>
                                <IoClose />
                            </button>
                        </div>

                        <table className="createEmployeeTable">
                            <tbody>
                                {/* Name */}
                                <tr><td><label>Name</label></td><td><input className="full-width" type="text" name="name" placeholder="Name" value={employeeData.name} onChange={handleInputChange} /></td></tr>

                                {/* Email */}
                                <tr><td><label>Email</label></td><td><input className="full-width" type="email" name="email" placeholder="Email" value={employeeData.email} onChange={handleInputChange} /></td></tr>

                                {/* HP No */}
                                <tr><td><label>HP No</label></td><td><input className="full-width" type="text" name="hpNo" placeholder="Mobile Number" value={employeeData.hpNo} onChange={handleInputChange} /></td></tr>

                                {/* Pass Type */}
                                <tr><td><label>Pass Type</label></td><td><input className="full-width" type="text" name="resStatusPassType" placeholder="e.g. Work Permit" value={employeeData.resStatusPassType} onChange={handleInputChange} /></td></tr>

                                {/* Job Title */}
                                <tr><td><label>Job Title</label></td><td><input className="full-width" type="text" name="jobTitle" placeholder="e.g. Manager" value={employeeData.jobTitle} onChange={handleInputChange} /></td></tr>

                                {/* Role */}
                                <tr>
                                    <td><label>Role</label></td>
                                    <td>
                                        <div className="form-field">
                                            <select name="roleID" value={employeeData.roleID} onChange={handleInputChange}>
                                                <option value="">Select Role</option>
                                                <option value="1">Admin</option>
                                                <option value="2">Manager</option>
                                                <option value="3">Employee</option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>

                                {/* Skill Set */}
                                <tr>
                                    <td><label>Skill Set</label></td>
                                    <td>
                                        <div className="form-field">
                                            <select name="skillSetID" value={employeeData.skillSetID} onChange={handleInputChange}>
                                                <option value="">Select Skillset</option>
                                                <option value="1">Frontend</option>
                                                <option value="2">Backend</option>
                                                <option value="3">Fullstack</option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>

                                {/* Standard Working Hours */}
                                <tr><td><label>Working Hours</label></td><td><input className="full-width" type="text" name="standardWrkHrs" placeholder="e.g. 8" value={employeeData.standardWrkHrs} onChange={handleInputChange} /></td></tr>

                                {/* Start Time */}
                                <tr><td><label>Start Time</label></td><td><input className="full-width" type="time" name="startWorkTime" value={employeeData.startWorkTime} onChange={handleInputChange} /></td></tr>

                                {/* End Time */}
                                <tr><td><label>End Time</label></td><td><input className="full-width" type="time" name="endWorkTime" value={employeeData.endWorkTime} onChange={handleInputChange} /></td></tr>

                                {/* Days of Work */}
                                <tr><td><label>Days of Work</label></td><td><input className="full-width" type="number" name="daysOfWork" value={employeeData.daysOfWork} onChange={handleInputChange} /></td></tr>

                                {/* Leaves */}
                                <tr><td><label>Total Leave</label></td><td><input className="full-width" type="number" name="noOfLeave" value={employeeData.noOfLeave} onChange={handleInputChange} /></td></tr>

                                <tr><td><label>Leave Available</label></td><td><input className="full-width" type="number" name="noOfLeaveAvailable" value={employeeData.noOfLeaveAvailable} onChange={handleInputChange} /></td></tr>

                                {/* MCs */}
                                <tr><td><label>Total MC</label></td><td><input className="full-width" type="number" name="noOfMC" value={employeeData.noOfMC} onChange={handleInputChange} /></td></tr>

                                <tr><td><label>MC Available</label></td><td><input className="full-width" type="number" name="noOfMCAvailable" value={employeeData.noOfMCAvailable} onChange={handleInputChange} /></td></tr>

                                {/* Active or Inactive */}
                                <tr>
                                    <td><label>Status</label></td>
                                    <td>
                                        <div className="form-field">
                                            <select name="activeOrInactive" value={employeeData.activeOrInactive} onChange={handleInputChange}>
                                                <option value="">Select Status</option>
                                                <option value="1">Active</option>
                                                <option value="0">Inactive</option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>

                                {/* Submit */}
                                <tr>
                                    <td colSpan={2}>
                                        <div className="buttonContainer">
                                            <SubmitButton onClick={handleSubmit} text="Submit" />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateAccount;
