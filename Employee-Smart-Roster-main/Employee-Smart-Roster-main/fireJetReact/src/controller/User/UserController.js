import { EMAIL_PATTERN } from "../../controller/Variables";

function getUsers (){
    const data = [
        {
            email: "bo1@gmail.com",
            UID: 1,
            role: 'Business Owner',
            nric: "encrpted_nric",
            isSuspended: false,
            isLoggedIn: false,
            lastUpdate: '15 / 03 / 2025',
            updateBy: "", 
            createdAt: "2025-3-25 12:00:08",
            lastOnline: '',
            reasonOfSuspend: '',
            hpNo: "+65 1111 1111",
            fullName: "BO 1",
            ownes: 1,
        }, 
        {
            email: "bo2@gmail.com",
            UID: 2,
            role: 'Business Owner',
            nric: "encrpted_nric",
            isSuspended: false,
            isLoggedIn: false,
            lastUpdate: '15 / 03 / 2025',
            updateBy: "", 
            createdAt: "2025-3-25 12:00:08",
            lastOnline: '',
            reasonOfSuspend: '',
            hpNo: "+65 1111 1112",
            fullName: "BO 2",
            ownes: 2,
        }, 
        {
            email: "bo3@gmail.com",
            UID: 3,
            role: 'Business Owner',
            nric: "encrpted_nric",
            isSuspended: false,
            isLoggedIn: false,
            lastUpdate: '15 / 03 / 2025',
            updateBy: "", 
            createdAt: "2025-3-25 12:00:08",
            lastOnline: '',
            reasonOfSuspend: '',
            hpNo: "+65 1111 1113",
            fullName: "BO 3",
            ownes: 3,
        }, 
        {
            email: "emp1@gmail.com",
            UID: 4,
            role: 'Employee',
            nric: "encrpted_nric",
            isSuspended: "false",
            isLoggedIn: "false",
            lastUpdate: '',
            updateBy: "", 
            createdAt: "2025-3-25 12:00:08",
            lastOnline: '',
            reasonOfSuspend: '',
            hpNo: "+65 1111 2221",
            fullName: "Emp 1",
            resStatusPassType: "Singapore Citizen/ PR",
            dateJoined: "2025-05-03",
            jobTitle: "Developer",
            roles:'["1", "2", "3"]',
            standardWrkHrs: 5.2,
            skillsets:'["1", "2", "3"]',
            noOfLeave: 10,
            noOfMC: 10,
            noOfLeaveAvailable: 10,
            noOfMCAvailable: 10,
            startWorkTime: "09:00",
            endWorkTime: "18:00",
            daysOfWork: '[1, 2, 3, 4, 5]',
            EmployedBy: 1,
        }, 
        {
            email: "emp2@gmail.com",
            UID: 5,
            role: 'Employee',
            nric: "encrpted_nric",
            isSuspended: "false",
            isLoggedIn: "false",
            lastUpdate: '',
            updateBy: "", 
            createdAt: "2025-3-25 12:00:08",
            lastOnline: '',
            reasonOfSuspend: '',
            hpNo: "+65 1111 2222",
            fullName: "Emp 2",
            resStatusPassType: "Singapore Citizen/ PR",
            dateJoined: "2025-05-03",
            jobTitle: "Developer",
            roles:'["1", "2", "3"]',
            standardWrkHrs: 5.2,
            skillsets:'["1", "2", "3"]',
            noOfLeave: 10,
            noOfMC: 10,
            noOfLeaveAvailable: 10,
            noOfMCAvailable: 10,
            startWorkTime: "09:00",
            endWorkTime: "18:00",
            daysOfWork: '[1, 2, 3, 4, 5]',
            EmployedBy: 1,
        }, 
        {
            email: "emp3@gmail.com",
            UID: 6,
            role: 'Employee',
            nric: "encrpted_nric",
            isSuspended: "false",
            isLoggedIn: "false",
            lastUpdate: '',
            updateBy: "", 
            createdAt: "2025-3-25 12:00:08",
            lastOnline: '',
            hpNo: "+65 1111 2223",
            fullName: "Emp 3",
            resStatusPassType: "Singapore Citizen/ PR",
            dateJoined: "2025-05-03",
            jobTitle: "Developer",
            roles:'["1"]',
            standardWrkHrs: 5.2,
            skillsets:'["2"]',
            noOfLeave: 10,
            noOfMC: 10,
            noOfLeaveAvailable: 10,
            noOfMCAvailable: 10,
            startWorkTime: "09:00",
            endWorkTime: "18:00",
            daysOfWork: '[1, 2, 3, 4, 5]',
            EmployedBy: 2,
        }, 
    ]
    return data;
}

function validateEmail(email) {
    if(!EMAIL_PATTERN.test(email))
        return "Invalid Email Format Found"
    else
        return ""
}

async function getBOUsers () {
    const body = {

    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/systemadmin/businessowner/list/view', {
            method: 'GET',
            body: JSON.stringify(),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data;
    } catch(error) {
        console.error(`Network error for UID ${uid}: \n`, error);
        throw new Error(`Failed to fetch company data: ${error.message}`);
    }
}

async function handleSuspendUser (uid, reason) {
    const body = {
        UID: uid,
        reasonOfSuspend: reason
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/systemadmin/user/suspend', {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data;
    } catch(error) {
        console.error(`Network error for UID ${uid}: \n`, error);
        throw new Error(`Failed to suspend the user: ${error.message}`);
    }
}

async function handleUsuspendUser (uid, ) {
    const body = {
        UID: uid,
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/systemadmin/user/unsuspend', {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);

        return await data;
    } catch(error) {
        console.error(`Network error for UID ${uid}: \n`, error);
        throw new Error(`Failed to suspend the user: ${error.message}`);
    }
}

function handleFilterRole (allData, role) {
    const filteredData = allData.filter((data) => {
        const roleMatch = role === "" || 
            data.role === role
        return roleMatch
    });
    return filteredData;
}

function getUserOwnesCompany (users, companyID) {
    // console.log("All Users", users)
    const userOwnes = users.filter((data) => {
        const cIDMatch = companyID === "" ||
            data.ownes === companyID
        return cIDMatch
    })
    // console.log("Company ownes by User", userOwnes)
    return userOwnes
}

function setUser(updatedData){
    console.log(updatedData)
}

function handleUserAccStatusFilter(companies, accStatus) {
    const filteredData = companies.filter((company) => {
        const dataAccStatus = company.owner.isSuspended
        // If accStatus is 'Activated'
        if (accStatus === 'Activated'){
            const IS_SUSPENDED = 0  // The account is not suspended
            return dataAccStatus === IS_SUSPENDED  
        }
        else {
            const IS_SUSPENDED = 1  // The account is suspended
            return dataAccStatus === IS_SUSPENDED  
        }
    })
    return filteredData;
}

// Check if user registered an account before
async function checkIfEmailRegistered(email) {
    const body = {
        email: email,
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/account/change-password/send-email-address', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);

        return await data;
    } catch(error) {
        console.error(`Network error for UID ${uid}: \n`, error);
        throw new Error(`Failed to suspend the user: ${error.message}`);
    }
}

async function getEmployeeList(boID) {
    const body = {
        business_owner_id: boID
    };

    try {
        console.log("Sending request to fetch employee list with body:", body);
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/company/employee/view', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API returned an error response:", errorData);
            throw new Error(errorData.message || `HTTP error status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Employee data returned:", data);
        return data;
    } catch (error) {
        console.error(`Network error for business owner ID ${boID}:`, error);
        throw new Error(`Failed to fetch employee data: ${error.message}`);
    }
}



export default {
    getUsers,
    validateEmail,
    handleFilterRole,
    getUserOwnesCompany,
    setUser,
    handleUserAccStatusFilter,
    getBOUsers,
    handleSuspendUser,
    handleUsuspendUser,
    checkIfEmailRegistered,
    getEmployeeList,
}