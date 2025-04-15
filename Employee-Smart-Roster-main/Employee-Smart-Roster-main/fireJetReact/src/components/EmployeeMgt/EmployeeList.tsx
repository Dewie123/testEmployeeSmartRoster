import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import UserController from '../../controller/User/UserController';

// Define the structure of an employee object
interface Employee {
  user_id: number;
  fullName: string;
  email: string;
  jobTitle: string;
  hpNo: string;
}

// Define the shape of the API response
interface EmployeeResponse {
  employeeList: Employee[];
}

const EmployeeList: React.FC = () => {
  const { user } = useAuth();
  // Type the state as an array of Employee objects
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Guard clause: if there is no user or UID, stop fetching.
    if (!user || !user.UID) {
      setLoading(false);
      return;
    }
    
    const fetchEmployees = async () => {
      try {
        // Call getEmployeeList with the business owner's UID
        // Expecting the returned data to contain an employeeList property
        const data: EmployeeResponse = await UserController.getEmployeeList(user.UID);
        setEmployees(data.employeeList || []);
      } catch (err) {
        // Ensure err is handled even if its type is unknown
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to fetch employees');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmployees();
  }, [user]);

  if (loading) return <div>Loading employees...</div>;
  if (error) return <div>Error: {error}</div>;
  if (employees.length === 0) return <div>No employees found.</div>;

  return (
    <ul>
      {employees.map((emp) => (
        <li key={emp.user_id}>
          <strong>{emp.fullName}</strong> – {emp.email} – {emp.jobTitle}
        </li>
      ))}
    </ul>
  );
};

export default EmployeeList;
