import { useState } from 'react';
import { useAlert } from '../../components/PromptAlert/AlertContext';
import Header from '../../components/table/Header';
import Cell from '../../components/table/Cell';
import { BiSolidUserDetail } from '../../../public/Icons.js';
import UserDetail from './UserDetail';
import './BOUserList_t.css';
import '../../../public/styles/common.css';

// Define an interface for Employee.
export interface Employee {
    activeOrInactive: number;
    dateJoined: string;            // e.g. "2025-03-28T20:05:28.000Z"
    daysOfWork: number;
    email: string;
    endWorkTime: string;
    fullName: string;
    hpNo: number | string;
    jobTitle: string;
    noOfLeave: number;
    noOfLeaveAvailable: number;
    noOfMC: number;
    noOfMCAvailable: number;
    resStatusPassType: string;
    roleID: number;               
    skillSet: string;             
    standardWrkHrs: number | string; 
    startWorkTime: string;
    user_id: number;
  
    // Controller for filtering/identification:
    role: string; // e.g. "Employee"
}

interface BOListTableProps {
  users?: Employee[];
  onUpdate?: (updatedData: Employee) => void;
}

const BOUserList_t = ({ users = [], onUpdate }: BOListTableProps) => {
  const { showAlert } = useAlert();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [error, setError] = useState("");

  // Helper function to format the ISO date string to dd/mm/yyyy
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDetailClick = (employee: Employee) => {
    try {
      setSelectedEmployee(employee);
      setShowDetail(true);
    } catch (err) {
      setError(`${err}`);
      setSelectedEmployee(null);
      setShowDetail(false);
    }
    if (error) {
      showAlert("handleDetailClick in BOUserList_t", '', error, { type: 'error' });
    }
  };

  const triggerCloseDetail = () => {
    setSelectedEmployee(null);
    setShowDetail(false);
  };

  if (users.length === 0)
    return (
      <div className="App-desktop-responsive-table">
        <b>No Data Loaded...</b>
      </div>
    );

  return (
    <>
      <div className="App-desktop-responsive-table">
        <div className="desktop-table-header">
          <Header className="header-employee-id" text="NAME" />
          <Header className="header-email" text="EMAIL" />
          <Header className="header-job-title" text="JOB TITLE" />
          <Header className="header-role" text="DATE JOINED" />
          <Header className="header-phone" text="PHONE" />
          <Header className="header-status" text="STATUS" />
          <Header className="header-icon" text="" />
        </div>
        {users.map((employee: Employee) => (
          <div className="table-body" key={employee.user_id}>
            <Cell className="body-employee-id" text={employee.fullName} />
            <Cell className="body-email" text={employee.email} />
            <Cell className="body-job-title" text={employee.jobTitle} />
            <Cell className="body-role" text={formatDate(employee.dateJoined)} />
            <Cell className="body-phone" text={employee.hpNo.toString()} />
            <Cell
              className="body-status"
              text={employee.activeOrInactive === 1 ? "Active" : "Inactive"}
            />
            <div
              className="App-desktop-table-icon"
              onClick={() => handleDetailClick(employee)}
            >
              <BiSolidUserDetail />
            </div>
          </div>
        ))}
      </div>

      {showDetail && selectedEmployee && (
        <div className="App-popup">
          <UserDetail
            user={selectedEmployee}
            onClose={triggerCloseDetail}
            onUpdate={onUpdate}
          />
        </div>
      )}
    </>
  );
};

export default BOUserList_t;
