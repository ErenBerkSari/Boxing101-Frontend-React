import React from "react";
import { useSelector } from "react-redux";
import Loader from "./Loader";
import "../css/pioneer.css"
function Pioneer() {
  const { user, authIsLoading } = useSelector((store) => store.auth);
  if (authIsLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }
  return (
    <div>
      <div className="main-banner" id="top">
        <video autoPlay muted loop id="bg-video">
          <source src="assets/images/boxing-pioneer4.mp4" type="video/mp4" />
        </video>

        <div className="video-overlay header-text">
          <div id="pioneer-textbox" className="caption">
            <h6>Push Your Limits, Unleash Your Power</h6>
            <h2>
              Discover Boxing with <em>Boxing101</em>
            </h2>
            {!user && (
              <div className="main-button scroll-to-section">
                <a href="/register">Start Your Journey</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pioneer;
