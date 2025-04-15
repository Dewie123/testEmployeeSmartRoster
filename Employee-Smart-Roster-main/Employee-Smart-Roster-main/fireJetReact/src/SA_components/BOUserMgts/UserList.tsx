import { useState, useEffect } from 'react';
import { useAlert } from '../../components/PromptAlert/AlertContext';
import CompanyController from '../../controller/CompanyController';
import SubscribtionController from '../../controller/SubscribtionController';
import UserController from '../../controller/User/UserController';
import BOUserList_t from './BOUserList_t';
import BOUserList_m from './BOUserList_m';
import './UserList.css';
import '../../../public/styles/common.css';

// import functions needed from UserController
const { handleUserAccStatusFilter, } = UserController;
// import functions needed from CompanyController
const { getCompany,
        handleFilterUENBizName, } = CompanyController;
// import functions needed from SubscribtionController
const { getSubscriptionTransactions, 
        getSubsTransForACompany,
        getSortedSubsTransactions,
        handleFilterSubsStatus, } = SubscribtionController;

const SubscribingStatus = ['Subscribed', 'Pending Payment', 'Unsubscribed', 'Cancelled Subscription']
const IsAccSuspended = ['Activated', 'Suspended']

const BOUserList = ({boUsers = []}: BOListProps) => {
    // console.log(boUsers)
    const { showAlert } = useAlert();
    const [ filterSubsStatus, setFilterSubsStatus ] = useState(SubscribingStatus[0]);
    const [ filterAccStatus, setFilterAccStatus ] = useState(IsAccSuspended[0]);
    const [ filterUENOBizName, setFilterUENOBizName ] = useState('');
    const [ allCompanies, setAllCompanies ] = useState<any>([])
    const [ companies, setCompanies ] = useState<any>([]);  // Data to Display

    const fetchCompaniesData = async() => {
        if(!boUsers) return; // If no boUsers return nothing
        
        try{
            const companyPromises = boUsers.map(async (user: any) => {
                try {
                    const company = await getCompany(user.UID);
                    return {
                        ...company,
                        owner: user,
                    }
                } catch(error) {
                    showAlert(
                        `Error fetching company`,
                        `UID: ${user.UID}: `,
                        {error}.toString(),
                        { type: 'error' }
                    )
                    return null;
                }
            })
            const companyWithOwnes = await Promise.all(companyPromises)
            // console.log("Companies with owner: \n", companyWithOwnes)
            
            const transactions = await getSubscriptionTransactions();
            // console.log(transactions);
            const fullCompaniesDataPromises = companyWithOwnes.map(async (company:any) => {
                // Get all transactions for current company
                const transactionsForACompany = await getSubsTransForACompany(transactions.SubscriptionDetails, company.UEN);
                // Get latest transactions for current company
                const sortedTransactions = await getSortedSubsTransactions(transactionsForACompany)
                // console.log(sortedTransactions) // Debug line
                return{
                    ...company, // All data for current company
                    transactions: sortedTransactions, // Include new transactions data
                }
                
            })
            const fullCompaniesData = await Promise.all(fullCompaniesDataPromises)
            // console.log(`Full company data: \n`, fullCompaniesData)
            setAllCompanies(Array.isArray(fullCompaniesData) ? fullCompaniesData : [])
            
        } catch(error) {
            setCompanies([]);
            showAlert(
                "Fetch Company Data Error",
                'Failed to fetch company data BOUserList',
                {error}.toString(),
                { type: 'error' }
            )
        }
    }
    // Auto trigger when companies length change
    useEffect(() => { fetchCompaniesData(); }, [boUsers]);
    // useEffect(() => {console.log(allCompanies)})   // Debug to check the latest json Object
    
    const triggerFilterBOData = async () => {
        // console.log("Data received in filter subscription status:\n", allCompanies)
        try {
            // Fiter with Subscribing Status
            let filtered = handleFilterSubsStatus(allCompanies, filterSubsStatus);
            // Filter with Business Owner Acc Status
            filtered = handleUserAccStatusFilter(filtered, filterAccStatus);
            // Filter with UEN or BizName
            filtered = handleFilterUENBizName(filtered, filterUENOBizName);
            setCompanies(filtered);
        } catch (error) {
            showAlert(
                "triggerFilterBOData", 
                "Failed to apply filter", 
                {error}.toString(), 
                { type: 'error' }
            );
        }
    }
    // Auto trigger when filter subscription status, account status, and all companies data change
    useEffect(() => { triggerFilterBOData(); }, [
        filterSubsStatus, 
        filterAccStatus, 
        filterUENOBizName, 
        allCompanies
    ])

    const handleDataUpdate = (updatedData:any) => {
        const updatedItem = allCompanies.map((data:any) => 
            data.owner?.UID === updatedData.owner?.UID
            ? { ...data, 
                owner: updatedData.owner
              }
            : data
        )
        // console.log(updatedItem)
        setAllCompanies(updatedItem) // Update data locally
    }

    return (
        <>
        <div className="App-filter-search-component">
            <div className="App-filter-container subscription-status">
                <p className='App-filter-title'>Subscription Status</p>
                {/* Subscription Status dropdown */}
                <select 
                    value={filterSubsStatus}
                    onChange={(e) => setFilterSubsStatus(e.target.value)}
                >
                {SubscribingStatus.map(status => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
                </select>
            </div>
            <div className="App-filter-container account-status">
                <p className='App-filter-title'>Account Status</p>
                {/* Account Status dropdown */}
                <select 
                    value={filterAccStatus}
                    onChange={(e) => setFilterAccStatus(e.target.value)}
                >
                {IsAccSuspended.map(accStatus => (
                    <option key={accStatus} value={accStatus}>
                        {accStatus}
                    </option>
                ))}
                </select>
            </div>
            <div className="App-filter-container uen-company-name">
                <p className='App-filter-title'>UEN/Company Name</p>
                <input type='text' 
                    className='search-input'
                    placeholder='Search UEN / Company Name' 
                    onChange={(e) => setFilterUENOBizName(e.target.value)}
                />
            </div>
        </div>
        {/* Desktop Table */}
        <BOUserList_t 
            companies={companies}
            onUpdate={handleDataUpdate} />

        {/* Tablet and Mobile Table */}
        <BOUserList_m 
            companies={companies}
            onUpdate={handleDataUpdate} />
        </>
    )
}

interface BOListProps {
    boUsers?: any;
}

export default BOUserList;