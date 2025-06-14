import React, { useState } from "react";
import "../css/profile.css";
import UsersPrograms from "./UsersPrograms";
import ProgramList from "./ProgramList";
import ProgramListProfile from "./ProgramListProfile";

function Profile() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    email: "john@example.com",
    age: 28,
    weight: 75,
    height: 180,
    experience: "Intermediate",
    goals: "Improve technique and stamina",
  });

  const handleEdit = (e) => {
    e.preventDefault();
    // Handle form submission here
    setIsEditModalOpen(false);
  };

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
                    <label>Name</label>
                    <span>{userInfo.name}</span>
                  </div>
                  <div className="info-item">
                    <label>Email</label>
                    <span>{userInfo.email}</span>
                  </div>
                  <div className="info-item">
                    <label>Age</label>
                    <span>{userInfo.age} years</span>
                  </div>
                  <div className="info-item">
                    <label>Weight</label>
                    <span>{userInfo.weight} kg</span>
                  </div>
                  <div className="info-item">
                    <label>Height</label>
                    <span>{userInfo.height} cm</span>
                  </div>
                  <div className="info-item">
                    <label>Experience</label>
                    <span>{userInfo.experience}</span>
                  </div>
                </div>
              </div>
              <div className="info-section">
                <h3>Training Goals</h3>
                <div className="goals-content">
                  <p>{userInfo.goals}</p>
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
          <div className="profile-info">
            <div className="info-card">
              <h3>Nutrition Plan</h3>
              <p>Burada beslenme planı ve öneriler olacak (örnek içerik).</p>
            </div>
          </div>
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
            {activeTab === "profile" && (
              <button
                className="edit-button"
                onClick={() => setIsEditModalOpen(true)}
              >
                Edit Profile
              </button>
            )}
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
                    <input type="text" defaultValue={userInfo.name} />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" defaultValue={userInfo.email} />
                  </div>
                  <div className="form-group">
                    <label>Age</label>
                    <input type="number" defaultValue={userInfo.age} />
                  </div>
                  <div className="form-group">
                    <label>Weight (kg)</label>
                    <input type="number" defaultValue={userInfo.weight} />
                  </div>
                  <div className="form-group">
                    <label>Height (cm)</label>
                    <input type="number" defaultValue={userInfo.height} />
                  </div>
                  <div className="form-group">
                    <label>Experience</label>
                    <select defaultValue={userInfo.experience}>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Goals</label>
                  <textarea defaultValue={userInfo.goals}></textarea>
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
