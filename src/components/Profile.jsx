import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserStats } from "../redux/slices/userSlice";
import "../css/profile.css";
import UsersPrograms from "./UsersPrograms";
import ProgramList from "./ProgramList";
import ProgramListProfile from "./ProgramListProfile";
import CreateProgramByUser from "./CreateProgramByUser";

function Profile() {
  const dispatch = useDispatch();
  const { userStats, userStatsLoading, userStatsError } = useSelector((state) => state.user);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    dispatch(getUserStats());
  }, [dispatch]);

  const handleEdit = (e) => {
    e.preventDefault();
    // Handle form submission here
    setIsEditModalOpen(false);
  };

  if(userStatsLoading) {
    return <div>Loading...</div>
  }

  if(userStatsError) {
    return <div>Error: {userStatsError}</div>
  }

  // İçerik sekmeleri
  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="profile-info">
            <div className="info-card">
              <div className="info-section">
                <h3>Personal Information</h3>
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
      case "settings":
        return (
          <div className="profile-info">
            <div className="info-card">
              <h3>Settings</h3>
              <p>Hesap ayarları ve tercihler burada olacak (örnek içerik).</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile-outer-wrapper">
      <div className="profile-container">
        {/* Sidebar Navigation */}
        <div className="sidebar">
          <div className="sidebar-header">
            <h2>Boxing101</h2>
          </div>
          <nav className="sidebar-nav">
            <ul>
              <li
                className={activeTab === "profile" ? "active" : ""}
                onClick={() => setActiveTab("profile")}
              >
                <span className="nav-icon">👤</span>
                Profile
              </li>
              <li
                className={activeTab === "programs" ? "active" : ""}
                onClick={() => setActiveTab("programs")}
              >
                <span className="nav-icon">💪</span>
                My Programs
              </li>
              <li
                className={activeTab === "progress" ? "active" : ""}
                onClick={() => setActiveTab("progress")}
              >
                <span className="nav-icon">📊</span>
                Progress
              </li>
              <li
                className={activeTab === "nutrition" ? "active" : ""}
                onClick={() => setActiveTab("nutrition")}
              >
                <span className="nav-icon">🥗</span>
                Nutrition
              </li>
              <li
                className={activeTab === "settings" ? "active" : ""}
                onClick={() => setActiveTab("settings")}
              >
                <span className="nav-icon">⚙️</span>
                Settings
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="profile-header">
            <div className="header-content">
              <h1>
                {activeTab === "profile"
                  ? "Profile"
                  : activeTab === "programs"
                  ? "My Programs"
                  : activeTab === "progress"
                  ? "Progress"
                  : activeTab === "nutrition"
                  ? "Nutrition"
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
                  ? "See your nutrition plan"
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
