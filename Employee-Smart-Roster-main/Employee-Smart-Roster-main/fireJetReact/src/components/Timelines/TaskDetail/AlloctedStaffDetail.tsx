import './MoreInfor.css'
import '../../../../public/styles/common.css'
import { MdContactPhone, MdOutlineMailOutline } from '../../../../public/Icons.js'

interface AllocatedStaffDetailProps {
    allocatedStaff: any;
}

const AllocatedStaffDetail = ({ allocatedStaff = [] }: AllocatedStaffDetailProps) => {
    // console.log(allocatedStaffID)
    
    return (
        <div className="allocated-staff-content">
            <p className="title">{allocatedStaff.jobTitle}</p>
            {/* Display contact number */}
            <div className="allocated-staff-contact-no">
                <MdContactPhone className='App-popup-content-icon'/>
                {allocatedStaff.hpNo}
            </div>
            {/* Display email */}
            <div className="allocated-staff-email">
                <MdOutlineMailOutline className='App-popup-content-icon'/>
                {allocatedStaff.email}
            </div>
        </div>
    )
}

export default AllocatedStaffDetail