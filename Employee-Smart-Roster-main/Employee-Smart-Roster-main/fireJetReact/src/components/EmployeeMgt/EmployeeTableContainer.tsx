import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import UserController from '../../controller/User/UserController';
import EmployeeList_t from './EmployeeList_t';

// Define the structure for an employee object.
interface Employee {
    user_id: number;
    fullName: string;
    email: string;
    jobTitle: string;
    hpNo: string;
}

interface EmployeeResponse {
  employeeList: Employee[];
}

const EmployeeTableContainer: React.FC = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!user || !user.UID) {
      setLoading(false);
      return;
    }
    const fetchEmployees = async () => {
      try {
        const data: EmployeeResponse = await UserController.getEmployeeList(user.UID);
        setEmployees(data.employeeList || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to fetch employees.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [user]);

  if (loading) return <div>Loading employees...</div>;
  if (error) return <div>Error: {error}</div>;

  return <EmployeeList_t employees={employees} />;
};

export default EmployeeTableContainer;
