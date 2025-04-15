import { useAuth } from '../../AuthContext' 
import { USER_ROLE } from '../../controller/Variables.js'
import SASide from './SASide'
import BOSide from './BOSide'
import EmpSide from './EmpSide'

import './menu.css'
import '../../../public/styles/common.css'

const SideMenu_t = ({}) => {
    const { user } = useAuth();

    return(
        <>
        {user?.role === USER_ROLE[0] && <SASide />}
        {user?.role === USER_ROLE[1] && <BOSide />}
        {user?.role === USER_ROLE[1] && <EmpSide />}
        </>
    )
}

export default SideMenu_t;