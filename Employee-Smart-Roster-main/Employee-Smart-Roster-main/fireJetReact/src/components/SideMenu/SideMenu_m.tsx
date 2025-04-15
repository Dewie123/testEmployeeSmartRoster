import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import SideMenu_t from "./SideMenu_t.js";
import { RxHamburgerMenu } from '../../../public/Icons.js';

import './menu.css';
import '../NavBar/NavBar.css';
import '../../../public/styles/common.css'

const SideMenu_m = () => {
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
        <div>
            <RxHamburgerMenu 
                className="nav-button"
                onClick={toggleShowMenu}
            />
            {/* System Admin Menu */}
            {showMenu && (
                <div className="App-popup" onClick={toggleShowMenu}>
                    <div className="App-popup-content" onClick={(e) => e.stopPropagation()}>
                        <SideMenu_t />
                    </div>
                </div>
            )}
        </div>
    )
}

export default SideMenu_m
