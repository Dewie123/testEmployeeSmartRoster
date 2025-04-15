import React from 'react';
import Header from '../../components/table/Header';
import Cell from '../../components/table/Cell';
import '../../../public/styles/common.css';

// Define the structure for an employee object.
interface Employee {
  user_id: number;
  fullName: string;
  email: string;
  jobTitle: string;
  hpNo: string;
}

interface EmployeeListProps {
  employees: Employee[];
}

const EmployeeList_t: React.FC<EmployeeListProps> = ({ employees }) => {
  if (employees.length === 0) {
    return (
      <div className="App-desktop-responsive-table">
        <b>No employee data found.</b>
      </div>
    );
  }

  return (
    <div className="App-desktop-responsive-table employee-list">
      <div className="App-desktop-table-row employee-list-header">
        <Header className="employee-list-header-empid" text="ID" />
        <Header className="employee-list-header-fullname" text="NAME" />
        <Header className="employee-list-header-email" text="EMAIL" />
        <Header className="employee-list-header-jobtitle" text="JOB TITLE" />
        <Header className="employee-list-header-role" text="PHONE NUMBER" />
      </div>
      {employees.map((emp) => (
        <div className="App-desktop-table-row employee-list-row" key={emp.user_id}>
          <Cell className="employee-list-cell-id" text={emp.user_id.toString()} />
          <Cell className="employee-list-cell-fullname" text={emp.fullName} />
          <Cell className="employee-list-cell-email" text={emp.email} />
          <Cell className="employee-list-cell-jobtitle" text={emp.jobTitle} />
          <Cell className="employee-list-cell-role" text={emp.hpNo} />
        </div>
      ))}
    </div>
  );
};

export default EmployeeList_t;
