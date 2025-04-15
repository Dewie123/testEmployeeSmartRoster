import { useState } from 'react';
import { useAlert } from '../../components/PromptAlert/AlertContext';
import { BiSolidUserDetail } from '../../../public/Icons.js';
import { NO_DATA_MATCHED } from "../../controller/Variables.js";
import Header from '../../components/table/Header';
import Cell from '../../components/table/Cell';
import BODetail from './BODetail';
import CompanyController from '../../controller/CompanyController';

import './BOUserList_t.css'
import '../../../public/styles/common.css'

const { handleSelectedDetail } = CompanyController;

interface BOListTableProps {
    companies?: any;
    onUpdate?: (updatedData: any) => void;
}

const BOUserList_t = ({ companies = [], onUpdate }: BOListTableProps) => {
    // console.log(companies)
    const { showAlert } = useAlert();
    const [ selectedCompany, setSelectedCompany ] = useState<any>([]);
    const [ showDetail, setShowDetail ] = useState(false);
    const [ error, setError ] = useState("");

    const handleDetailClick = async (company: any) => {
        try{
            // Get Business onwers user list
            const selectedCompany = handleSelectedDetail(company)
            setSelectedCompany(selectedCompany)
            setShowDetail(true)
        } catch (error) {
            setError(error instanceof Error ? error.message : String(error));
            setSelectedCompany([]);
            setShowDetail(false);
        }

        if(error)
            showAlert(
                "handleDetailClick in BOUserList",
                '',
                error,
                { type: 'error' }
            )
    }
    // useEffect(() => {console.log(selectedUser)}, [selectedUser.length])   // Debug to check the latest json Object

    function triggerCloseDetail () {
        setSelectedCompany([]);
        setShowDetail(false);
    }

    if (companies.length === 0) return (
        <div className="App-desktop-responsive-table">
            <b>{NO_DATA_MATCHED}</b>
        </div>
    )

    return (
        <>
        <div className="App-desktop-responsive-table bo-user-list">
            <div className='App-desktop-table-row bo-user-header'>
                <Header className='bo-user-header-uen' text='UEN' />
                <Header className='bo-user-header-company-name' text='COMPANY NAME' />
                <Header className='bo-user-header-subs-status' text='SUBSCRIPTION STATUS' />
                <Header className='App-header-icon-gap' text='' />
            </div>
            {companies.map((company:any) => (
            <div className="App-desktop-table-row bo-user-table-row" key={company.UEN}>
                <Cell className='bo-user-table-row-uen' text={company.UEN} />
                <Cell className='bo-user-table-row-company-name' text={company.bizName} />
                <Cell className='bo-user-table-row-subs-status' text={company.transactions[0]?.subsStatus || 'Unsubscribed'} />
                <div 
                    className="App-desktop-table-icon" 
                    onClick={() => {
                        handleDetailClick(company)
                    }}>
                    <BiSolidUserDetail />
                </div>
            </div>
            ))}
        </div>
        
        {showDetail && selectedCompany && (
            <div className='App-popup' onClick={triggerCloseDetail}>
                <BODetail
                    company={selectedCompany}
                    onClose={() => triggerCloseDetail()}
                    onUpdate={onUpdate}
                />
            </div>
        )}
        </>
    )
}

export default BOUserList_t;