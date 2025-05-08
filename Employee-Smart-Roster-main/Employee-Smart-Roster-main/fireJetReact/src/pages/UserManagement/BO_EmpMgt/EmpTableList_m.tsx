import { useState } from 'react';
import { useAlert } from '../../../components/PromptAlert/AlertContext';
import { BiSolidUserDetail } from '../../../../public/Icons.js';
import UserDetail from './UserDetail';

import '../../../../public/styles/common.css';

interface BOListMobileProps {
  users: any;
  roles: any;
  skillsets: any;
  onEmpUpdate?: (updatedData: any) => void
}

const EMPUserList_m = ({ users, roles, skillsets, onEmpUpdate }: BOListMobileProps) => {
  const { showAlert } = useAlert();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [error, setError] = useState("");

  // Handle clicking on a user card to open the detail modal
  const handleDetailClick = (user: any) => {
    try {
      setSelectedUser(user);
      setShowDetail(true);
    } catch (err) {
      setError(`${err}`);
      setSelectedUser(null);
      setShowDetail(false);
    }
    if (error)
      showAlert("handleDetailClick in BOUserList_m", '', error, { type: 'error' });
  };

  function returnRoleName (roleID:number) {
    const roleName = roles.filter((role:any) => {
      return role.roleID === roleID
    })
    return roleName[0].roleName
  }

  function returnSkillName (skillID:number) {
    const skill = skillsets.filter((skill:any) => {
      return skill.skillSetID === skillID
    })
    // console.log(skill[0])
    return skill[0].skillSetName
  }

  function triggerCloseDetail() {
    setSelectedUser(null);
    setShowDetail(false);
  }

  if (users.length === 0)
    return (
      <div className="App-mobile-responsive-table">
        <b>No Data Loaded...</b>
      </div>
    );

  return (
    <>
      <div className="App-mobile-responsive-table">
        {users.map((user: any) => (
          <div key={user.email} className="App-mobile-responsive-table-card">
            <div className="App-mobile-responsive-table-card-title">
              <h2>{user.fullName}</h2>
              <div
                className="App-mobile-table-icon"
                onClick={() => handleDetailClick(user)}
              >
                <BiSolidUserDetail />
              </div>
            </div>

            <div className="App-mobile-responsive-table-card-data">
              <div className="App-mobile-responsive-table-card-data-detail">
                <p className="App-mobile-responsive-table-card-data-title">
                  NRIC
                </p>
                <p>{user.nric}</p>
              </div>

              <div className="App-mobile-responsive-table-card-data-detail">
                <p className="App-mobile-responsive-table-card-data-title">
                  Status
                </p>
                <p>{user.isSuspended ? "Suspended" : "Active"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showDetail && selectedUser && (
        <div className="App-popup" onClick={triggerCloseDetail}>
          <UserDetail
            user={selectedUser}
            role={returnRoleName(selectedUser.roleID)}
            skillset={returnSkillName(selectedUser.skillSetID)}
            onClose={triggerCloseDetail}
            onEmpUpdate={onEmpUpdate}
          />
        </div>
      )}
    </>
  );
};

export default EMPUserList_m;
