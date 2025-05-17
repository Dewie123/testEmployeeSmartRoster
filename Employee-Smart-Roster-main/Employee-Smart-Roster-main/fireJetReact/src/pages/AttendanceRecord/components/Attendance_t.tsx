import { formatDisplayDateTime, USER_ROLE } from '../../../controller/Variables'
import Header from '../../../components/table/Header';
import Cell from '../../../components/table/Cell';

import '../Attendance.css'
import '../../../../public/styles/common.css'

interface AttendanceRecord_TProps {
    attendanceRecords: any;
    user: any;
}

const Attendance_t = ({ attendanceRecords, user } : AttendanceRecord_TProps) => {
    // console.log(attendanceRecords)
    
    return (
        <>
        <div className="App-desktop-responsive-table">
            <div className="App-desktop-table-row desktop-table-header">
                {user.role === USER_ROLE[1] && (
                    <Header className="header-attendance-submitted-by" text="SUBMITTED BY" />
                )}
                <Header className="header-attendance-start" text="START WORKING TIME" />
                <Header className="header-attendance-end" text="END WORKING TIME" />
                <Header className="header-attendance-total-working-hrs" text="TOTAL WORKING HOURS" />
                {/* <Header className="App-header-icon-gap" text="" /> */}
            </div>
            {attendanceRecords.map((attendance:any) => (
            <div className="App-desktop-table-row table-body" key={attendance.attendanceID}>
                {user.role === USER_ROLE[1] && (
                    <Cell className="body-attendance-submitted-by" text={attendance.user_id} />
                )}
                <Cell className="body-attendance-start" text={formatDisplayDateTime(attendance.startTime)} />
                <Cell className="body-attendance-end" text={formatDisplayDateTime(attendance.endTime)} />
                <Cell className="body-attendance-total-working-hrs" text={attendance.hrsWorked} />
            </div>
            ))}
        </div>
        </>
    )
}
export default Attendance_t