import { useAuth } from '../../AuthContext';
import { useEffect, useState } from 'react';
import { useAlert } from '../../components/PromptAlert/AlertContext';
import EmployeeMgntController from '../../controller/BOEmpMgntProfile/EmployeeMgntController';
import UserController from '../../controller/User/UserController';
import BOUserList_t from '../../BO_components/EmployeeMgnts/BOUserList_t';
import BOUserList_m from '../../BO_components/EmployeeMgnts/BOUserList_m';

import './UserMgts.css';
import "../../../public/styles/common.css";

const AvailableUserTypes = ['Employee'];

const UserMgts = () => {
  const { showAlert } = useAlert();
  const { user } = useAuth();

  // Explicitly type state as an array of User objects.
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [filterUserType, setFilterUserType] = useState("Employee");
  const [filterName, setFilterName] = useState("");
  const [error, setError] = useState("");

  // Fetch user data from the controller.
  // If filterUserType is "Employee", call EmployeeMgntController.getEmployeeList; otherwise, use UserController.getUsers.
  const fetchUsersData = async () => {
    try {
      let response;
      if (filterUserType === "Employee") {
        // Ensure 'user' exists and has a UID; UID is the business_owner_id.
        if (!user?.UID) return;
        response = await EmployeeMgntController.getEmployeeList(user.UID);
      } else {
        response = await UserController.getUsers();
      }
      console.log("Fetched response:", response);
      setAllUsers(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Error in fetchUsersData:", err);
      setError(`${err}`);
      setAllUsers([]);
      showAlert("UserMgts page", '', `${err}`, { type: 'error' });
    }
  };

  // Fetch users when the component mounts or when filterUserType or user changes.
  useEffect(() => {
    if (user) {
      fetchUsersData();
    }
  }, [filterUserType, user]);

  // Update filtering logic (this filters based on fullName).
  const triggerFilterUsers = () => {
    try {
      let filtered = [];
      if (filterUserType === "Employee") {
        // Simply load all employees without filtering by a role property.
        filtered = allUsers;
        if (filterName.trim() !== "") {
          // Optionally filter the employees based on a search term:
          filtered = filtered.filter((emp: any) =>
            emp.email.toLowerCase().includes(filterName.toLowerCase()) ||
            emp.jobTitle.toLowerCase().includes(filterName.toLowerCase()) ||
            (emp.fullName && emp.fullName.toLowerCase().includes(filterName.toLowerCase()))
          );
        }
      } else {
        // For business owners (or other roles), use the original filtering logic.
        filtered = UserController.handleFilterRole(allUsers, filterUserType);
        if (filterName.trim() !== "") {
          filtered = filtered.filter((u: any) =>
            (u.fullName || "").toLowerCase().includes(filterName.toLowerCase())
          );
        }
      }
      setFilteredUsers(filtered);
    } catch (err) {
      setError(`${err}`);
      setFilteredUsers([]);
      showAlert("Filtering Users", "Filter error", `${err}`, { type: 'error' });
    }
  };
  
  
  // Re-run filtering when source data or filter values change.
  useEffect(() => {
    triggerFilterUsers();
  }, [allUsers, filterUserType, filterName]);

  // Callback to update a single user in state after an update (e.g., suspension).
  const handleUserUpdate = (updatedUser: any) => {
    setAllUsers((prevUsers: any[]) =>
      prevUsers.map((user) =>
        user.UID === updatedUser.UID ? updatedUser : user
      )
    );
  };

  return (
    <div className="UserMgts">
      <div className="content">
        <h1>User Management</h1>
        <div className="App-filter-search-component">
          <div className="App-filter-container">
            <p className="App-filter-title">User Type</p>
            <select
              value={filterUserType}
              onChange={(e) => setFilterUserType(e.target.value)}
            >
              {AvailableUserTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="App-filter-container">
            <p className="App-filter-title">Search Name</p>
            <input
              type="text"
              placeholder="Search by name"
              onChange={(e) => setFilterName(e.target.value)}
            />
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div>Loading users...</div>
        ) : (
          <>
            <div className="desktop-view">
              <BOUserList_t users={filteredUsers} onUpdate={handleUserUpdate} />
            </div>
            <div className="mobile-view">
              <BOUserList_m users={filteredUsers} onUpdate={handleUserUpdate} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserMgts;
