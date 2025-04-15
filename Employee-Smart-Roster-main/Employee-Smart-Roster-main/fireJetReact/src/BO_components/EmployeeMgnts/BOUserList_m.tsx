import { useState } from 'react';
import { useAlert } from '../../components/PromptAlert/AlertContext';
import { BiSolidUserDetail } from '../../../public/Icons.js';
import UserDetail from './UserDetail';

import './BOUserList_m.css';
import '../../../public/styles/common.css';

const BOUserList_m = ({ users = [], onUpdate }: BOListMobileProps) => {
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
          <div key={user.nric} className="App-mobile-responsive-table-card">
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
        <div className="App-popup">
          <UserDetail
            user={selectedUser}
            onClose={triggerCloseDetail}
            onUpdate={onUpdate}
          />
        </div>
      )}
    </>
  );
};

interface BOListMobileProps {
  users?: any;
  onUpdate?: (updatedData: any) => void;
}

export default BOUserList_m;
