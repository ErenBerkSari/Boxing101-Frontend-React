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
        <div>Loading, please wait...</div>
      </div>
    );
  }
  return (
    <div>
      <div className="main-banner" id="top">
        <video autoPlay muted loop id="bg-video">
          <source src="assets/images/boxing-pioneer.mp4" type="video/mp4" />
        </video>

        <div className="video-overlay header-text">
          <div id="pioneer-textbox" className="caption">
            <h6>work harder, get stronger</h6>
            <h2>
              easy with our <em>gym</em>
            </h2>
            {!user && (
              <div className="main-button scroll-to-section">
                <a href="/register">Become a member</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pioneer;
