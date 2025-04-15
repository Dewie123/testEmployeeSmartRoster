import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaRegBuilding } from "react-icons/fa";
import { GrSchedules } from "react-icons/gr";
import { FaUsersViewfinder } from "react-icons/fa6";
import { MdOutlineBugReport } from "react-icons/md";
import { CiStar } from "react-icons/ci";

import { FaChevronCircleDown,
         FaChevronCircleUp, } from '../../../public/Icons.js'
import "./menu.css";
import "../../../public/styles/common.css"

const BOSide = () => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const location = useLocation();
    
  const menuItems = [
      {
          name: 'user',
          label: 'COMPANY',
          src: <FaRegBuilding className="menu-icon"/>,
          items: [
              {
                  name: 'companyProfile',
                  label: 'My Company',
                  navHref: '/company-detail',
              },
              {
                name: 'subscriptionManagement',
                label: 'Subscription Management',
                navHref: '/subscription-management',
              }
          ]
      },
      {
          name: 'timelineManagement',
          label: 'TIMELINE MANAGEMENT',
          navHref: '/timeline-management',
          src: <GrSchedules className="menu-icon"/>,
      },
      {
          name: 'employee',
          label: 'MY EMPLOYEE',
          src: <FaUsersViewfinder className="menu-icon"/>,
          items: [
              {
                  name: 'employeeManagement',
                  label: 'Employee Management',
                  navHref: '/users-management'
              },
              {
                  name: 'attendanceRecords',
                  label: 'Attendance Records',
                  navHref: '/attendance-records-management'
              },
              {
                  name: 'leaveManagement',
                  label: 'Leave Management',
                  navHref: '/mc-management'
              },
          ]
      },
      {
          name: 'reportIssues',
          label: 'REPORT ISSUES',
          navHref: '/report-issues',
          src: <MdOutlineBugReport className="menu-icon"/>,
      },
      {
          name: 'reviwRating',
          label: 'REVIEW & RATING MANAGEMENT',
          navHref: '/review-n-rating-management',
          src: <CiStar className="menu-icon"/>,
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

export default BOSide;