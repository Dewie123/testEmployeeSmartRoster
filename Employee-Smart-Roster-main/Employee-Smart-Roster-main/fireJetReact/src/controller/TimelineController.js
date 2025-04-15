// return all tasks
async function getTimelines (boID) {
    const body = {
        business_owner_id: boID
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/timeline/view', {
            method: 'POST',
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
        throw new Error(`Failed to fetch company data: ${error.message}`);
    }
}

// return task's detail for BO
async function boGetTaskDetail (taskID) {
    const body = {
        taskID: taskID
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/timeline/task/view', {
            method: 'POST',
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
        throw new Error(`Failed to fetch company data: ${error.message}`);
    }
}

// return delete tasks's detail for BO
async function deleteTaskDetail (taskID) {
    const body = {
        taskID: taskID
    };

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/timeline/task/delete', {
            method: 'DELETE',
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
        throw new Error(`Failed to fetch company data: ${error.message}`);
    }
}

// return get aloocated task's detail
async function getTaskDetail (userID) {
    const body = {
        employee_user_id: userID
    };
// 
    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/employee/task/view', {
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
        throw new Error(`Failed to fetch company data: ${error.message}`);
    }
}

function getRoleNeededForTask (allRoles, roleNeededID){
    const roleNeeded = allRoles.filter((role) => 
        role.roleID === roleNeededID
    )
    return roleNeeded
} 

function getSkillNeededForTask (allSkills, skillNeededID){
    const skillNeeded = allSkills.filter((skill) => 
        skill.skillSetID === skillNeededID
    )
    return skillNeeded
} 

export default {
    getTimelines, 
    boGetTaskDetail,
    deleteTaskDetail, 
    getTaskDetail,
    getRoleNeededForTask,
    getSkillNeededForTask,
}