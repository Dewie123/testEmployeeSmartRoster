import { useState } from 'react';
import { IoClose } from '../../../public/Icons.js'; // Adjust the import path as needed
import { useAlert } from '../../components/PromptAlert/AlertContext';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton/SecondaryButton';
import './UserDetail.css';
import '../../../public/styles/common.css';

interface UserDetailProps {
  user?: any;
  onClose?: () => void;
  onUpdate?: (updatedData: any) => void;
}

const UserDetail = ({ user, onClose, onUpdate }: UserDetailProps) => {
  const { showAlert } = useAlert();
  const [suspend, setSuspend] = useState(false);
  const [reasonSuspend, setReasonSuspend] = useState("");
  const [error, setError] = useState("");

  const handleSuspendUser = () => {
    try {
      // Create updated user data with suspension details
      const updatedUser = {
        ...user,
        isSuspended: true,
        reasonOfSuspend: reasonSuspend,
        lastUpdate: new Date().toISOString(),
      };

      if (onUpdate) onUpdate(updatedUser);
      if (onClose) onClose();
    } catch (err) {
      setError(`${err}`);
    }

    if (error)
      showAlert(
        'UserDetail: suspend user failed',
        '',
        error,
        { type: 'error' }
      );
  };

  const handleCancelSuspend = () => {
    setReasonSuspend("");
    setSuspend(false);
  };

  if (suspend)
    return (
      <div className="App-popup">
        <div className="App-popup-prompt-content suspend-user">
          <div>
            <p className="App-prompt-confirmation-title">
              Confirm to Suspend {user.fullName}
            </p>
          </div>
          <input
            type="text"
            placeholder="Reason for suspension"
            onChange={(e) => setReasonSuspend(e.target.value)}
            required
          />
          <div className="btns-grp">
            <PrimaryButton 
              text="Confirm" 
              onClick={handleSuspendUser}
              disabled={!reasonSuspend}
            />
            <SecondaryButton 
              text="Cancel" 
              onClick={handleCancelSuspend}
            />
          </div>
        </div>
      </div>
    );

  return (
    <div className="App-popup-content">
      <div className="App-header">
        <h1>{user.fullName}</h1>
        <button className="icons" onClick={onClose}>
          <IoClose />
        </button>
      </div>
      <div className="content">
        <div className="user-info">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>NRIC:</strong> {user.nric}</p>
          <p><strong>Phone:</strong> {user.hpNo}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p>
            <strong>Status:</strong> {user.isSuspended ? "Suspended" : "Active"}
          </p>
          {user.isSuspended && (
            <p>
              <strong>Reason:</strong> {user.reasonOfSuspend}
            </p>
          )}
          <p><strong>Created At:</strong> {user.createdAt}</p>
          <p><strong>Last Update:</strong> {user.lastUpdate}</p>
        </div>
      </div>
      <div className="suspend-btn">
        {!user.isSuspended && (
          <SecondaryButton 
            text="Suspend" 
            onClick={() => setSuspend(true)}
          />
        )}
      </div>
    </div>
  );
};

export default UserDetail;
