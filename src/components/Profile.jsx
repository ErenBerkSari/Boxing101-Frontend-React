import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserStats } from "../redux/slices/userSlice";
import "../css/profile.css";
import UsersPrograms from "./UsersPrograms";
import ProgramList from "./ProgramList";
import ProgramListProfile from "./ProgramListProfile";
import CreateProgramByUser from "./CreateProgramByUser";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userStats, userStatsLoading, userStatsError } = useSelector((state) => state.user);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    dispatch(getUserStats());
  }, [dispatch]);

  // Mobile menü için window resize listener
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobil menü overlay click handler
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleEdit = (e) => {
    e.preventDefault();
    // Handle form submission here
    setIsEditModalOpen(false);
  };

  const handleTabClick = (tab) => {
    if (tab === "Anasayfa") {
      navigate("/");
      return;
    }
    setActiveTab(tab);
    setIsMobileMenuOpen(false); // Mobilde tab seçildiğinde menüyü kapat
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
console.log("userStats",userStats);
  if(userStatsLoading) {
    return (
      <div>
        <Loader />
        <div>Loading, please wait...</div>
      </div>
    );
  }

  if(userStatsError) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#ed563b'
      }}>
        Error: {userStatsError}
      </div>
    );
  }

  // İçerik sekmeleri
  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="profile-info">
            <div className="info-card">
              <div className="info-section">
                <h3 style={{display: "flex", justifyContent: "center",alignItems: "center",marginTop: "10px"}}>Personal Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Username</label>
                    <span>{userStats?.user?.username || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Email</label>
                    <span>{userStats?.user?.email || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Kayıtlı Program</label>
                    <span>{userStats?.stats?.totalPrograms || 0}</span>
                  </div>
                  <div className="info-item">
                    <label>Tamamlanan Program</label>
                    <span>{userStats?.stats?.totalCompletedPrograms || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "programs":
        return (
          <div className="profile-info">
            <div className="info-card">
              <UsersPrograms/>
            </div>
          </div>
        );
      case "progress":
        return (
          <div className="profile-info">
            <div className="info-card">
              <ProgramListProfile/>
            </div>
          </div>
        );
      case "nutrition":
        return (
          <CreateProgramByUser/>
        );
      case "Anasayfa":
        return (
          <div className="profile-info">
            <div className="info-card">
             
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile-outer-wrapper">
      {/* Mobile Menu Toggle Button */}
      <button 
        className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      <div className="profile-container">
        {/* Sidebar Navigation */}
        <div className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-header">
            <h2 >Boxing101</h2>
          </div>
          <nav className="sidebar-nav">
            <ul>
              <li
                className={activeTab === "profile" ? "active" : ""}
                onClick={() => handleTabClick("profile")}
              >
                <span className="nav-icon">👤</span>
                Profile
              </li>
              <li
                className={activeTab === "programs" ? "active" : ""}
                onClick={() => handleTabClick("programs")}
              >
                <span className="nav-icon">📝</span>
                My Created Programs
              </li>
              <li
                className={activeTab === "progress" ? "active" : ""}
                onClick={() => handleTabClick("progress")}
              >
                <span className="nav-icon">🎯</span>
                Boxing101 Programs
              </li>
              <li
                className={activeTab === "nutrition" ? "active" : ""}
                onClick={() => handleTabClick("nutrition")}
              >
                <span className="nav-icon">➕</span>
                Create Program
              </li>
              <li
                className={activeTab === "Anasayfa" ? "active" : ""}
                onClick={() => handleTabClick("Anasayfa")}
              >
                <span className="nav-icon">🏠</span>
                Anasayfa
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="profile-header">
            <div style={{textAlign: "center",width: "100%"}} className="header-content">
              <h1>
                {activeTab === "profile"
                  ? "Profile"
                  : activeTab === "programs"
                  ? "My Created Programs"
                  : activeTab === "progress"
                  ? "Boxing101 Programs"
                  : activeTab === "nutrition"
                  ? "Create Program"
                  : activeTab === "settings"
                  ? "Settings"
                  : "Profile"}
              </h1>
              <p className="subtitle">
                {activeTab === "profile"
                  ? "Manage your personal information"
                  : activeTab === "programs"
                  ? "View and manage your boxing programs"
                  : activeTab === "progress"
                  ? "Track your progress and stats"
                  : activeTab === "nutrition"
                  ? "Create your own program"
                  : activeTab === "settings"
                  ? "Account settings and preferences"
                  : "Manage your personal information"}
              </p>
            </div>
          </div>

          {renderTabContent()}
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Edit Profile</h2>
                <button
                  className="close-button"
                  onClick={() => setIsEditModalOpen(false)}
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleEdit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Name</label>
                    <input type="text" defaultValue={userStats?.user?.username} />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" defaultValue={userStats?.user?.email} />
                  </div>
                </div>
                <div className="modal-buttons">
                  <button type="submit" className="save-button">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;