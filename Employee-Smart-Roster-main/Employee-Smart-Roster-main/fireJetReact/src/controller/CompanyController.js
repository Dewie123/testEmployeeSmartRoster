function getCompanies (){
    const data = [
        {
            cID: 1,
            UEN: "202017097M",
            bizName: "GOOGLE VENTURES PTE. LTD.",
            contactNo: "+65 6666 1111",
            bizFilePath: "https://mymailsimedu-my.sharepoint.com/:b:/g/personal/wmlim014_mymail_sim_edu_sg/EfaXUfD99AdHrSO5GjbQNssBfoSXi7ZLWPO2oGbLADvDAA?e=MT6By8",
            email: "GoogleVentures@gmail.com",
            address: "#01-01 Clementi S111111",
            createdAt: "2025-3-25 12:00:08",
            lastUpdate: "",
        },
        {
            cID: 2,
            UEN: "53137217X",
            bizName: "GOOGLE CARS",
            contactNo: "+65 6666 1112",
            bizFilePath: "https://mymailsimedu-my.sharepoint.com/:b:/g/personal/wmlim014_mymail_sim_edu_sg/EfaXUfD99AdHrSO5GjbQNssBfoSXi7ZLWPO2oGbLADvDAA?e=MT6By8",
            email: "GoogleCars@gmail.com",
            address: "#02-02 Clementi S111122",
            createdAt: "2025-3-25 12:00:08",
            lastUpdate: "",
        },
        {
            cID: 3,
            UEN: "53342345K",
            bizName: "GOOGLE CLOUD",
            contactNo: "+65 6666 1113",
            bizFilePath: "https://mymailsimedu-my.sharepoint.com/:b:/g/personal/wmlim014_mymail_sim_edu_sg/EfaXUfD99AdHrSO5GjbQNssBfoSXi7ZLWPO2oGbLADvDAA?e=MT6By8",
            email: "GoogleCloud@gmail.com",
            address: "#03-03 Clementi S111133",
            createdAt: "2025-3-25 12:00:08",
            lastUpdate: "",
        }
    ]
    return data;
}

async function getCompany (uid){
    const body = {
        UID: uid,
    }
    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/company/profile', {
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
    } catch (error) {
        console.error(`Network error for UID ${uid}: \n`, error);
        throw new Error(`Failed to fetch company data: ${error.message}`);
    }
}

async function getCompanyRoles (boID){
    // console.log(boID)
    const body = {
        business_owner_id: boID,
    }
    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/company/role/view', {
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
    } catch (error) {
        console.error(`Network error for UID ${uid}: \n`, error);
        throw new Error(`Failed to fetch company data: ${error.message}`);
    }
}

async function getCompanySkillsets (boID){
    const body = {
        business_owner_id: boID,
    }
    try{
        const response = await fetch('https://e27fn45lod.execute-api.ap-southeast-2.amazonaws.com/dev/business-owner/company/skillset/view', {
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
    } catch (error) {
        console.error(`Network error for UID ${uid}: \n`, error);
        throw new Error(`Failed to fetch company data: ${error.message}`);
    }
}

function GetCompanyRoles (){
    const data = [
        {
            uen: "202017097M",
            role: "Programmer",
        },
        {
            uen: "202017097M",
            role: "Database Designer",
        },
        {
            uen: "202017097M",
            role: "UI Designer",
        },
        {
            uen: "53342345K",
            role: "Project Manager",
        },
        {
            uen: "53342345K",
            role: "Financial",
        },
    ]
    return data;
}

function GetCompanySkillsets (){
    const data = [
        {
            uen: "202017097M",
            skill: "React",
        },
        {
            uen: "202017097M",
            skill: "Figma",
        },
        {
            uen: "202017097M",
            skill: "Draw.io",
        },
        {
            uen: "53342345K",
            skill: "Microsoft Project",
        },
        {
            uen: "53342345K",
            skill: "Visual Studio",
        },
    ]
    return data;
}

const handleSelectedDetail = (selectedCompany) => {
    return selectedCompany;
}

function handleFilterUENBizName(companies, filterString){
    const filteredData = companies.filter((company) => {
        const search = filterString.trim().toLowerCase();
        if (!search) return true;

        const uenMatch = company.UEN.toLowerCase().includes(search);
        const bizNameMatch = company.bizName.toLowerCase().includes(search);

        return uenMatch || bizNameMatch;
    })
    return filteredData
}

export default {
    getCompanies,
    getCompany,
    getCompanyRoles,
    getCompanySkillsets,
    GetCompanyRoles, // Not Using
    GetCompanySkillsets, // Not Using
    handleSelectedDetail,
    handleFilterUENBizName,
}