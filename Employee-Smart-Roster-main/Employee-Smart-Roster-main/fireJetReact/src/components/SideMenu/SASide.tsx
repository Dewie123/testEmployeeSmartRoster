import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BsShopWindow } from "react-icons/bs";
import { MdOutlineBugReport } from "react-icons/md";
import { LuUserCog } from "react-icons/lu";

import { FaChevronCircleDown,
         FaChevronCircleUp, } from '../../../public/Icons.js'
import "./menu.css";
import "../../../public/styles/common.css";

const SASide = () => {
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
    const location = useLocation();

    const menuItems = [
        {
            name: 'user',
            label: 'USER MANAGEMENT',
            src: <LuUserCog className="menu-icon"/>,
            items: [
                {
                    name: 'userManagement',
                    label: 'BUSINESS OWNER MANAGEMENT',
                    navHref: '/users-management',
                },
                {
                    name: 'userRegReq',
                    label: 'Registration Request Management',
                    navHref: '/registration-req-management',
                }
            ]
        },
        {
            name: 'issue',
            label: 'ISSUES REPORTED',
            navHref: '/issues-reported',
            src: <MdOutlineBugReport className="menu-icon"/>,
        },
        {
            name: 'landing',
            label: 'LANDING PAGE MANAGEMENT',
            src: <BsShopWindow className="menu-icon"/>,
            items: [
                {
                    name: 'landingDemoVideo',
                    label: 'Demo Video Management',
                    navHref: '/video-management'
                },
                {
                    name: 'landingReview',
                    label: 'Reviews & Ratings',
                    navHref: '/review-rating'
                },
                {
                    name: 'landingFAQ',
                    label: 'FAQs Management',
                    navHref: '/faqs-management'
                },
                {
                    name: 'landingPreview',
                    label: 'Preview Landing Page',
                    navHref: '/preview-landing-page'
                },
            ]
        },
    ]

    // Initialize expanded state based on current location
    useEffect(() => {
        const newExpandedItems: Record<string, boolean> = {};
        
        menuItems.forEach(item => {
        if (item.items) {
            // Check if any sub-item matches current path
            const isActive = item.items.some(subItem => 
            subItem.navHref === location.pathname
            );
            
            if (isActive) {
            newExpandedItems[item.name] = true;
            }
        }
        });
        
        setExpandedItems(newExpandedItems);
    }, [location.pathname]);

    const toggleExpand = (name: string) => {
        setExpandedItems(prev => ({
        ...prev,
        [name]: !prev[name]
        }));
    };

    return(
        <div className="App-side-menu">
            {menuItems.map(({label, name, navHref, src, items: subItems}) => (
            <div key={name}>
            <ul className="menu-item-container">
                {subItems ? (
                // Main tab: if current item with subItems
                <li 
                    className={`side-menu-btn ${expandedItems[name] ? 'expanded' : ''}`} 
                    onClick={() => toggleExpand(name)}
                >
                    <a href={navHref} className="menu-tab">
                        <div className="menu-tab-label">
                        {src}
                        {label}
                        </div>
                        {subItems && (
                            <>{expandedItems[name] 
                                ? <FaChevronCircleUp className="expand-icon"/> 
                                : <FaChevronCircleDown className="expand-icon"/>
                            }</>
                        )}
                    </a>
                </li>
                ) : (
                // Main tab: if current item without subItems
                <li 
                    className={`side-menu-btn sub-navHref-hover 
                        ${location.pathname === navHref 
                            ? 'active' 
                            : ''}`
                        } 
                    onClick={() => toggleExpand(name)}
                >
                    <a href={navHref} className="menu-tab">
                    <div className="menu-tab-label">
                        {src}
                        {label}
                    </div>
                    </a>
                </li>
                )}
            
                {/* Sub tab */}
                {Array.isArray(subItems) && expandedItems[name] && (
                <ul className="sub-menu">
                    {subItems.map((subItem) => (
                    <li 
                        className={`sub-navHref-hover 
                            ${location.pathname === subItem.navHref 
                                ? 'active' 
                                : ''}`
                            }
                        key={subItem.name}
                    >
                        <a href={subItem.navHref}>{subItem.label}</a>
                    </li>
                    ))}
                </ul>
                )}
            </ul>
            </div>
            ))}
        </div>
    )
}
export default SASide;