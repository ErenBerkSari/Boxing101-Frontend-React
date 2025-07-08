import React from "react";
import { useSelector } from "react-redux";
import Loader from "./Loader";

function ChooseProgram() {
  const { user, authIsLoading } = useSelector((store) => store.auth);
  if (authIsLoading) {
    return <div
    style={{
      textAlign: "center",
      padding: "20px",
    }}
  >
    <Loader />
  </div>;
  }
  return (
    <div>
      <section className="section" id="about-us">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="section-heading">
                <h2 id="choose-program-title">
                  Choose <em>Your Boxing Program</em>
                </h2>
                <img src="assets/images/line-dec.png" alt="waves" />
                <p>
                  Find the perfect training plan for your boxing journey. Whether you’re a beginner or a pro, we have a program for you!
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <ul className="features-items">
                <li className="feature-item">
                  <div className="left-icon">
                    <img
                      src="assets/images/features-first-icon.png"
                      alt="First One"
                    />
                  </div>
                  <div className="right-content">
                    <h4>Boxing Fundamentals</h4>
                    <p>Start your boxing journey with essential techniques and basic workouts. Learn the foundations of stance, footwork, and punching, while building discipline and confidence.</p>
                    
                  </div>
                </li>
               
                <li className="feature-item">
                  <div className="left-icon">
                    <img
                      src="assets/images/features-first-icon.png"
                      alt="third gym training"
                    />
                  </div>
                  <div className="right-content">
                    <h4>Strength & Endurance</h4>
                    <p>Boost your power and stamina with focused muscle training. This course combines strength-building exercises with endurance drills, ensuring you can deliver powerful punches and maintain your energy throughout every round. </p>
                    
                  </div>
                </li>
              </ul>
            </div>
            <div className="col-lg-6">
              <ul className="features-items">
                <li className="feature-item">
                  <div className="left-icon">
                    <img
                      src="assets/images/features-first-icon.png"
                      alt="fourth muscle"
                    />
                  </div>
                  <div className="right-content">
                    <h4>Advanced Boxing Skills</h4>
                    <p>Take your skills to the next level with advanced routines and techniques. Learn complex combinations, defensive maneuvers, and strategic footwork that will set you apart in the ring.</p>
                    
                  </div>
                </li>
                <li className="feature-item">
                  <div className="left-icon">
                    <img
                      src="assets/images/features-first-icon.png"
                      alt="training fifth"
                    />
                  </div>
                  <div className="right-content">
                    <h4>Flexibility & Balance</h4>
                    <p>Enhance your boxing performance with flexibility and balance exercises. Improve your range of motion, agility, and stability, which are crucial for effective offense and defense in boxing.</p>
                    
                  </div>
                </li>
                
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="section" id="call-to-action">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 offset-lg-1">
              <div className="cta-content">
                <h2>
                  Don’t <em>wait</em>, start <em>now</em>!
                </h2>
                <p>
                  Every champion was once a beginner. Take the first step towards your boxing goals today.
                </p>
                {!user && (
                  <div className="main-button scroll-to-section">
                    <a href="/register">Join Now</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ChooseProgram;
