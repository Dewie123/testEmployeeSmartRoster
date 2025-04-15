import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { USER_ROLE } from "../../controller/Variables.js";
import SASide from "./SASide";
import BOSide from "./BOSide";
import { RxHamburgerMenu } from '../../../public/Icons.js'

import './menu.css';
import '../NavBar/NavBar.css';
import '../../../public/styles/common.css'

interface SideMenuMProps {
    role?: string;
}

const SideMenu_m = ({role}: SideMenuMProps) => {
    // console.log(role)
    const location = useLocation();
    const [ showMenu, setShowMenu ] = useState(false)
    const triggerCloseMenuOutsite = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (triggerCloseMenuOutsite.current && !triggerCloseMenuOutsite.current.contains(event.target as Node)) {
            toggleShowMenu();
        }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [location.pathname]);
    

    function toggleShowMenu() {
        setShowMenu(!showMenu)
    }

    return (
        <div 
            className={`menu-info${showMenu ? 'active' : ''}`}
            ref={triggerCloseMenuOutsite}>
            <RxHamburgerMenu 
                className="nav-button"
                onClick={toggleShowMenu}
            />
            {/* System Admin Menu */}
            {showMenu && (
                <div className="menu-for-mobile-responsive">
                    {role === USER_ROLE[0] && <SASide/>}
                    {role === USER_ROLE[1] && <BOSide/>}
                </div>
            )}
        </div>
    )
}

export default SideMenu_m
