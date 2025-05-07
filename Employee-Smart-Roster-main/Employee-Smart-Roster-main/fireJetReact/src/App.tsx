import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import { AlertProvider } from "./components/PromptAlert/AlertContext";
import Alert from "./components/PromptAlert/Alert";

// Pages or Component for general use
import Login from "./pages/RegistrationNLogin/Login";  // Import Login component
import Register from "./pages/RegistrationNLogin/Registration";
import ResetPassword from "./pages/RegistrationNLogin/ResetPW";
import ReqResetEmail from "./pages/RegistrationNLogin/ReqResetEmail";
import Navbar from "./components/NavBar/NavBar";
import GuestLanding from './pages/Landing/LandingPage';
import SideMenu_t from "./components/SideMenu/SideMenu_t";
import UserProfile from "./pages/UserProfile/UserProfile";
import ReportIssues from "./pages/ReportIssues/ReportIssues";

// Pages for System Admin
import SADash from "./pages/Dashboard/SADash";
import RegisRequests from "./SA_pages/RegisRequest/RegisRequests";
import UserMgts from "./pages/UserManagement/UserMgts";
import PreviewLanding from "./SA_pages/PreviewLanding";
import ViewRating from "./SA_pages/RegisRequest/ViewRating";
import FAQManagement from "./SA_pages/SA_FAQ/SA_FAQ";

// Pages for Busines Owner
import RequiredCompleteProfile from "./BO_pages/FirstLogin/RequiredCompleteProfile";
import RoleNSkillset from "./BO_pages/RoleNSkillsets/RoleNSkillset";
import BODashboard from "./BO_pages/Dashboard/Dashboard";
import CreateOEditTask from "./components/Timelines/CreateOEdit/CreateOEdit";
import BOCompanyProfile from "./BO_pages/CompanyProfile/CompanyProfile";
import SubsMgts from "./BO_pages/SubsManagement/SubsMgts";
import BOLeaveManagement from "./BO_pages/LeaveManagement/LeaveManagement";
import CreateOEditEmp from "./BO_components/CreateEditEmployee/CreateOEdit";
import BOTimelinesPage from "./BO_pages/ViewTimelines/TimelinesPage";
import AllTasksInTimeline from "./BO_pages/ViewTimelines/AllTasksInTimeline";

// Import for testing
import "./App.css";
import "../public/styles/common.css";

function App() {

  // const { user } = useAuth();
  //console.log(user);

  return (
    <AlertProvider>
    <AuthProvider>
      <div className="App">
        <Router>
          {/* Display navigation bar only when 
              user is not in the following page */}
          <Navbar />
          <div className="App-content" >
            <Routes>
              {/* Route for General pages */}
              <Route path="/home" element={<GuestLanding />} />
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-pw/:email" element={<ResetPassword />} />
              {/* <Route path="/reset-pw/:email/:token" element={<ResetPassword />} /> */}
              <Route path="/reset-pw" element={<ReqResetEmail />} />
              <Route path="/login" element={<Login />} />
              {/* Both System Admin and BO */}
              <Route
                path="/users-management"
                element={
                  <ProtectedRoute>
                    <SideMenu_t />
                    <UserMgts />
                  </ProtectedRoute>
                }
              />

              {/* Route for User Profile */}
              <Route
                path="/user-profile"
                element={
                  <ProtectedRoute>
                    <SideMenu_t />
                    <UserProfile />
                  </ProtectedRoute>
                }
              />

              {/* Report issues page */}
              <Route
                path="/report-issues"
                element={
                  <ProtectedRoute>
                    <SideMenu_t />
                    <ReportIssues />
                  </ProtectedRoute>
                }
              />

              {/* Route for System Admin Pages */}
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute>
                    <SideMenu_t />
                    <SADash />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/registration-req-management"
                element={
                  <ProtectedRoute>
                    <SideMenu_t />
                    <RegisRequests />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/video-management"
                element={
                  <ProtectedRoute>
                    <div className="App-content">
                      <SideMenu_t />
                      <div className="content">
                        <h1>Demo Video Management</h1>
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/issues-reported"
                element={
                  <ProtectedRoute>
                    <SideMenu_t />
                    <ReportIssues />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/review-rating"
                element={
                  <ProtectedRoute>
                    <div className="App-content">
                      <SideMenu_t />
                      <div className="content">
                        <h1>Review & Rating</h1>
                        <ViewRating />
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/faqs-management"
                element={
                  <ProtectedRoute>
                    <SideMenu_t />
                    <FAQManagement />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/preview-landing-page"
                element={
                  <ProtectedRoute>
                    <SideMenu_t />
                    <PreviewLanding />
                  </ProtectedRoute>
                }
              />

              <Route element={<RequiredCompleteProfile/>}>
                {/* Route for Business Owner pages */}
                <Route
                  path="/business-dashboard"
                  element={
                    <ProtectedRoute>
                      <SideMenu_t />
                      <BODashboard />
                    </ProtectedRoute>
                  }
                />  
                
                <Route
                  path="/company-detail"
                  element={
                    <ProtectedRoute>
                      <SideMenu_t />
                      <BOCompanyProfile />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/subscription-management"
                  element={
                    <ProtectedRoute>
                      <SideMenu_t />
                      <SubsMgts />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/timeline-management"
                  element={
                    <ProtectedRoute>
                      <SideMenu_t />
                      <BOTimelinesPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/create-new-task"
                  element={
                    <ProtectedRoute>
                      <SideMenu_t />
                      <CreateOEditTask 
                        isCreate={true}
                      />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/timeline-tasks-list"
                  element={
                    <ProtectedRoute>
                      <SideMenu_t />
                      <AllTasksInTimeline />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/edit-task"
                  element={
                    <ProtectedRoute>
                      <SideMenu_t />
                      <CreateOEditTask 
                        isCreate={false}
                      />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/attendance-records-management"
                  element={
                    <ProtectedRoute>
                      <div className="App-content">
                        <SideMenu_t />
                        <h1>Attendance Records Management</h1>
                      </div>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/mc-management"
                  element={
                    <ProtectedRoute>
                      <SideMenu_t />
                      <BOLeaveManagement />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/create-employee"
                  element={
                    <ProtectedRoute>
                      <SideMenu_t />
                      <CreateOEditEmp 
                        isCreate={true}
                      />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/edit-employee"
                  element={
                    <ProtectedRoute>
                      <SideMenu_t />
                      <CreateOEditEmp 
                        isCreate={false}
                      />
                    </ProtectedRoute>
                  }
                />
                
                <Route
                  path="/leave-management"
                  element={
                    <ProtectedRoute>
                      <div className="App-content">
                        <SideMenu_t />
                        <h1>Leave Management</h1>
                      </div>
                    </ProtectedRoute>
                  }
                />

              </Route>
              
              {/* Route for Employee pages */}
              <Route
                path="/employee-dashboard"
                element={
                  <ProtectedRoute>
                    <SideMenu_t />
                    <div>Employee</div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employee-projects"
                element={
                  <ProtectedRoute>
                    <SideMenu_t />
                    <div>Employee Project</div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/view-rating"
                element={
                    <ViewRating />
                }
              />
            </Routes>
          </div>
        </Router>
      </div>
    </AuthProvider>
    <Alert />
    </AlertProvider>
  );
}

export default App;