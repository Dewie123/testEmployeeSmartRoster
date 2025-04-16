import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../AuthContext";
import { useLocation } from "react-router-dom";
import { USER_ROLE } from "../../controller/Variables";
import { SA_Items, BO_Items, EMP_Items } from './SideMenu_t'
import Menu from "./Menu";
import { RxHamburgerMenu } from '../../../public/Icons.js';

import './menu.css';

const SideMenu_m: React.FC = () => {
    const location = useLocation();
    const { user } = useAuth();
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside or when route changes
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    // Close menu when route changes
    useEffect(() => {
        setShowMenu(false);
    }, [location.pathname]);

    const toggleMenu = () => {
        setShowMenu(prev => !prev);
    };

    return (
        <div className="mobile-menu-container">
            <RxHamburgerMenu 
                className="nav-button"
                onClick={toggleMenu} 
            />
            
            <div className={`mobile-menu-overlay ${showMenu ? 'active' : ''}`}>
                <div className="mobile-menu-content" ref={menuRef}>
                    <button 
                        className="mobile-menu-close" 
                        onClick={toggleMenu}
                    >
                        <RxHamburgerMenu className="nav-button" />
                    </button>
                    {user?.role === USER_ROLE[0] && (
                        <Menu menuItems={SA_Items} responsive="mobile" />
                    )}
                    {user?.role === USER_ROLE[1] && (
                        <Menu menuItems={BO_Items} responsive="mobile" />
                    )}
                    {user?.role === USER_ROLE[2] && (
                        <Menu menuItems={EMP_Items} responsive="mobile" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SideMenu_m;