import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./menu.css";
import "../../../public/styles/common.css"

const BOSide = () => {
    useEffect(() => {
        // Add event listeners to all .main elements
        const mainElements = document.querySelectorAll(".main");
    
        mainElements.forEach((main) => {
          main.addEventListener("click", () => {
            // Remove active class and hide all sub-menus
            mainElements.forEach((el) => {
              el.classList.remove("active");
              const subMenu = el.nextElementSibling as HTMLElement;
              if (subMenu && subMenu.classList.contains("sub-menu")) {
                subMenu.style.display = "none";
              }
            });
    
            // Add active class to the clicked .main
            main.classList.add("active");
    
            // Display the corresponding sub-menu
            const subMenu = main.nextElementSibling as HTMLElement;
            if (subMenu && subMenu.classList.contains("sub-menu")) {
              subMenu.style.display = "flex";
            }
          });
        });
    
        // Cleanup event listeners on component unmount
        return () => {
          mainElements.forEach((main) => {
            main.removeEventListener("click", () => {});
          });
        };
      }, []);

    return (
        <div className="App-side-menu">
            <div className="main">COMPANY</div>
            <div className="sub-menu company">
                <Link to="/company-detail" className="sub-link-hover">
                    My Company
                </Link>
                <Link to="/view-bo-detail" className="sub-link-hover">
                    View Profile
                </Link>
                <Link to="/roles-skills-menagement" className="sub-link-hover">
                    Roles & Skillsets Management
                </Link>
                <Link to="/subscription-menagement" className="sub-link-hover">
                    Subscription Management
                </Link>
            </div>

            <div className="main">
                <Link to="/timeline-management" className="sub-link-hover" >
                    TIMELINE MANAGEMENT
                </Link>
            </div>

            <div className="main">
              <Link to="/users-menagement" className="sub-link-hover">
                MY EMPLOYEE
              </Link>
            </div>
            <div className="sub-menu employee">
                <Link to="/attendance-records-management" className="sub-link-hover">
                    Attendance Records
                </Link>
                <Link to="/mc-management" className="sub-link-hover">
                    MC Management
                </Link>
                <Link to="/leave-management" className="sub-link-hover">
                    Leave Management
                </Link>
            </div>

            <div className="main">
                <Link to="/report-issues" className="sub-link-3" >
                    REPORT ISSUES
                </Link>
            </div>
        </div>
    );
}

export default BOSide;