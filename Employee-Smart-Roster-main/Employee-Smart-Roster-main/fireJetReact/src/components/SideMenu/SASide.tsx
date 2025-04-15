import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SideMenu_m from "./SideMenu_m";
import "./menu.css";
import "../../../public/styles/common.css"

const SASide = () => {
  const location = useLocation();

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

        // Pre-expand submenu based on location
        const path = location.pathname;
        const menuMap = [
          { pathList: [
              "/registration-req-management", 
              "/users-menagement"
            ], 
            className: "user" 
          },
          { pathList: [
              "/video-management", 
              "/review-rating", 
              "/faqs-management", 
              "/preview-landing-page"
            ], 
            className: "landing" 
          }
        ];
    
        menuMap.forEach((group) => {
          if (group.pathList.some(p => path.startsWith(p))) {
            const targetSub = document.querySelector(`.sub-menu.${group.className}`) as HTMLElement;
            const targetMain = targetSub?.previousElementSibling;
            if (targetSub && targetMain) {
              targetSub.style.display = "flex";
              targetMain.classList.add("active");
            }
          }
        });

      // Cleanup event listeners on component unmount
      return () => {
        mainElements.forEach((main) => {
          main.replaceWith(main.cloneNode(true)); // remove all listeners
        });
      };
    }, [location]);

    return (
      <div className="App-side-menu">
        <div className="main">
            <Link to="/users-menagement" className="sub-link-hover">
              BUSINESS OWNER MANAGEMENT
            </Link>
        </div>
        <div className="sub-menu user">
            <Link to="/registration-req-management" className="sub-link-hover">
              Registration Request Management
            </Link>
        </div>
        
        <div className="main">
            <Link to="/issues-reported" className="sub-link-hover" >
                ISSUES REPORTED
            </Link>
        </div>

        <div className="main">LANDING PAGE MANAGEMENT</div>
        <div className="sub-menu landing">
            <Link to="/video-management" className="sub-link-hover">
              Demo Video Management
            </Link>
            <Link to="/review-rating" className="sub-link-hover">
              Reviews & Ratings
            </Link>
            <Link to="/faqs-management" className="sub-link-hover">
              FAQs Management
            </Link>
            <Link to="/preview-landing-page" className="sub-link-hover">
                Preview Landing Page
            </Link>
        </div>
      </div>
    );
}

export default SASide;