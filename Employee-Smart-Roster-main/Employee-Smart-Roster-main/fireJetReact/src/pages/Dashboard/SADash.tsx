import { useState, useEffect } from "react";
import { useAlert } from "../../components/PromptAlert/AlertContext";
import SASide from "../../components/SideMenu/SASide";
import RatingChart from "../../SA_components/RatingChart/RatingChart";
import SubscriptionBar from "../../SA_components/SubscriptionBar/SubscriptionBar";
import RegisReq_m from "../../SA_components/Registration_Request/RegisReq_m";
import RegisReqTitle from "../../SA_components/Registration_Request/Title";
import RegisReqController from "../../controller/RegisReqController";

import "./SADash.css"
import "../../../public/styles/common.css"

// Access the function from the RegisReqController default export
const { getRegistrationRequests, 
        handleFilterRegsStatus, } = RegisReqController;

const RegStatus = ["Pending", "Approved", "Rejected"];

export default function SADash() {
    const { showAlert } = useAlert();
    const [ allRegisRequest, setAllRegisRequest ] = useState<any>([]);
    const [ filteredRegisRequest, setFilteredRegisRequest ] = useState<any>([]);
    const [ filterStatus ] = useState(RegStatus[0]); // Default display by pending

    const fetchRegisReqsData = async () => {
        try {
            const data = await getRegistrationRequests();
            const regReqList = data.RegistrationRequestList || [];
            // console.log(regReqList)
            setAllRegisRequest(Array.isArray(regReqList) ? regReqList : []);
            // console.log(allRegisRequest)
        } catch (error) {
            showAlert(
                "fetchRegisReqsData",
                "Fetch data error",
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            )
        }
    };
    // Auto trigger when allRegisRequest length change
    useEffect(() => { 
        fetchRegisReqsData();
    }, [allRegisRequest.length]); 

    const triggerFilterRegReq = async () => {
        try{
            // Filter registration request status
            let filtered = handleFilterRegsStatus(allRegisRequest, filterStatus);
            // console.log(filtered)
            setFilteredRegisRequest(filtered);
        }catch (error) {
            showAlert(
                "triggerFilterRegReq", 
                "Failed to apply filter", 
                {error}.toString(), 
                { type: 'error' }
            );
        }
    }
    // Auto trigger when filter status change
    useEffect(() => { triggerFilterRegReq(); }, [
        filterStatus, 
        allRegisRequest
    ])

    return(
        <div className="App-content">
            <SASide />
            <div className="content">
                <div className="dashboard-content">
                    <div className="virtual-data">
                        <RatingChart />
                        {/* <SubscriptionBar /> */}
                    </div>
                    <div className="regis-request-section">
                        <RegisReqTitle noOfPendingRequest={filteredRegisRequest.length} />
                        <RegisReq_m data={filteredRegisRequest}/>
                    </div>
                </div>
            </div>
        </div>
    );
}