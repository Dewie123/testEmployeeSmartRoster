import { useAuth } from '../../AuthContext'
import { useAlert } from '../../components/PromptAlert/AlertContext'
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import AttendanceController from '../../controller/AttendanceController';

import './Attendance.css'
import '../../../public/styles/common.css'

const { submiAttendance, } = AttendanceController

const AttendanceRecord = () => {
    const { showAlert } = useAlert()
    const { user } = useAuth()

    const checkIn = async() => {
        try {
            // console.log(empData)
            let response = await submiAttendance(user?.UID)
            // console.log(response)
            if(response.message === 'Attendance successfully added') {
                showAlert(
                    'Check In Successfully',
                    '',
                    ``,
                    { type: 'success' }
                );
            }
        } catch (error) {
            showAlert(
                'checkIn',
                '',
                error instanceof Error ? error.message : String(error),
                { type: 'error' }
            );
        }
    }

    return (
        <div className="App-content">
            <div className="content">
                <div className="attendance-record-page-header">
                    <h1>Attendance Record</h1>
                    <PrimaryButton 
                        text='Clock In'
                        onClick={() => checkIn()}
                    />
                </div>
            </div>
        </div>
    )
}
export default AttendanceRecord