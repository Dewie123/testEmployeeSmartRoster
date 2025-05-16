async function submiAttendance (uid) {
    const body = {
        employee_user_id: uid,
    };
    // console.log(body)

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/employee/attendance/register', {
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
        // console.error(`Network error for fetch task detail: \n`, error);
        throw new Error(`Failed to update the task progress: ${error.message}`);
    }
}

async function empViewMyAttendances (uid) {
    const body = {
        employee_user_id: uid,
    };
    // console.log(body)

    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/employee/attendance/view', {
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
        // console.error(`Network error for fetch task detail: \n`, error);
        throw new Error(`Failed to update the task progress: ${error.message}`);
    }
}

export default {
    submiAttendance,
    empViewMyAttendances,
}