import React from "react";
import { useSelector } from "react-redux";

function ChooseProgram() {
  const { user, authIsLoading } = useSelector((store) => store.auth);
  if (authIsLoading) {
    return <div>Yükleniyor, lütfen bekleyin..</div>;
  }
  return (
    <div>
      <section className="section" id="about-us">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="section-heading">
                <h2>
                  Choose <em>Program</em>
                </h2>
                <img src="assets/images/line-dec.png" alt="waves" />
                <p>
                  Training Studio is free CSS template for gyms and fitness
                  centers. You are allowed to use this layout for your business
                  website.
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
                    <h4>Basic Fitness</h4>
                    <p>
                      Please do not re-distribute this template ZIP file on any
                      template collection website. This is not allowed.
                    </p>
                    <a href="#" className="text-button">
                      Discover More
                    </a>
                  </div>
                </li>
                <li className="feature-item">
                  <div className="left-icon">
                    <img
                      src="assets/images/features-first-icon.png"
                      alt="second one"
                    />
                  </div>
                  <div className="right-content">
                    <h4>New Gym Training</h4>
                    <p>
                      If you wish to support TemplateMo website via PayPal,
                      please feel free to contact us. We appreciate it a lot.
                    </p>
                    <a href="#" className="text-button">
                      Discover More
                    </a>
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
                    <h4>Basic Muscle Course</h4>
                    <p>
                      Credit goes to
                      <a
                        rel="nofollow"
                        href="https://www.pexels.com"
                        target="_blank"
                      >
                        Pexels website
                      </a>
                      for images and video background used in this HTML
                      template.
                    </p>
                    <a href="#" className="text-button">
                      Discover More
                    </a>
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
                    <h4>Advanced Muscle Course</h4>
                    <p>
                      You may want to browse through
                      <a
                        rel="nofollow"
                        href="https://templatemo.com/tag/digital-marketing"
                        target="_parent"
                      >
                        Digital Marketing
                      </a>
                      or
                      <a href="https://templatemo.com/tag/corporate">
                        Corporate
                      </a>
                      HTML CSS templates on our website.
                    </p>
                    <a href="#" className="text-button">
                      Discover More
                    </a>
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
                    <h4>Yoga Training</h4>
                    <p>
                      This template is built on Bootstrap v4.3.1 framework. It
                      is easy to adapt the columns and sections.
                    </p>
                    <a href="#" className="text-button">
                      Discover More
                    </a>
                  </div>
                </li>
                <li className="feature-item">
                  <div className="left-icon">
                    <img
                      src="assets/images/features-first-icon.png"
                      alt="gym training"
                    />
                  </div>
                  <div className="right-content">
                    <h4>Body Building Course</h4>
                    <p>
                      Suspendisse fringilla et nisi et mattis. Curabitur sed
                      finibus nisi. Integer nibh sapien, vehicula et auctor.
                    </p>
                    <a href="#" className="text-button">
                      Discover More
                    </a>
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
                  Don’t <em>think</em>, begin <em>today</em>!
                </h2>
                <p>
                  Ut consectetur, metus sit amet aliquet placerat, enim est
                  ultricies ligula, sit amet dapibus odio augue eget libero.
                  Morbi tempus mauris a nisi luctus imperdiet.
                </p>
                {!user && (
                  <div className="main-button scroll-to-section">
                    <a href="/register">Become a member</a>
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
