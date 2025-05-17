import { formatDisplayDateTime, USER_ROLE } from '../../../controller/Variables'

import '../Attendance.css'
import '../../../../public/styles/common.css'

interface AttendanceRecord_TProps {
    attendanceRecords: any;
    user: any;
}

const Attendance_m = ({ attendanceRecords, user } : AttendanceRecord_TProps) => {
    // console.log(attendanceRecords)

    return(
        <>
        <div className="App-mobile-responsive-table">
            {attendanceRecords.map((attendance:any) => (
                <div key={attendance.attendanceID} className="App-mobile-responsive-table-card">
                    
                </div>
            ))}
        </div>
        </>
    )
}
export default Attendance_m
