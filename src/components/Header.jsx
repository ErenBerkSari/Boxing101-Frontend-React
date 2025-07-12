import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessages, logout } from "../redux/slices/authSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ScrollToHash from "./ScrollToHash";
import "../css/header.css";
import Loader from "./Loader";
import { Snackbar, Alert } from "@mui/material";

function Header() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  
  const { user, authIsLoading, isLoggedIn, successMessage, error } = useSelector(
    (store) => store.auth
  );

  // Error veya success message değiştiğinde snackbar'ı göster
  useEffect(() => {
    if (error || successMessage) {
      setShowMessage(true);
    }
  }, [error, successMessage]);

  // Snackbar kapandığında Redux state'ini temizle
  useEffect(() => {
    if (!showMessage && (error || successMessage)) {
      // Snackbar kapandıktan sonra state'i temizle
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showMessage, error, successMessage, dispatch]);

  const handleLogout = async () => {
    try {
      const result = await dispatch(logout());
      
      if (logout.fulfilled.match(result)) {
        setMenuOpen(false);
        setTimeout(() => {
          // Ana sayfada değilse yönlendir
          if (location.pathname !== "/") {
            navigate("/");
          } else {
            // Ana sayfadaysa Snackbar'ı da kapat
            setShowMessage(false);
          }
          dispatch(clearMessages());
        }, 2000);
      }
    } catch (error) {
      console.error("Error during logout process: ", error);
    }
  };

  const handleCloseMessage = () => {
    setShowMessage(false);
  };

  // Sayfa içi bölümleri izle
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      const scrollPosition = window.scrollY;

      // Home section için özel kontrol - sayfa başındaysa home aktif olsun
      if (location.pathname === "/" && scrollPosition < 470) {
        setActiveSection("home");
        return;
      }

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Menü açıkken body scroll'unu engelle
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  // Escape tuşu ile menüyü kapat
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  // Menü açıkken bir linke tıklanınca menüyü kapat
  const handleMenuLinkClick = () => {
    setMenuOpen(false);
  };

  const isActive = (path) => {
    // Ana sayfa kontrolü
    if (path === "/" && location.pathname === "/" && !location.hash)
      return true;

    // Hash-based navigation kontrolü
    if (path.startsWith("/#")) {
      const hash = path.replace("/#", "");
      return activeSection === hash;
    }

    // Normal path kontrolü
    return location.pathname.startsWith(path);
  };

  if (authIsLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div>
      {/* Logout mesajları için Snackbar */}
      <Snackbar
        open={showMessage}
        autoHideDuration={4000}
        onClose={handleCloseMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: 9999 }}
      >
        <Alert
          onClose={handleCloseMessage}
          severity={error ? "error" : "success"}
          sx={{ width: "100%", minWidth: "300px" }}
        >
          {error ? error.message : successMessage}
        </Alert>
      </Snackbar>
      
      <ScrollToHash />

      <header  className="header-area header-sticky background-header">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav className="main-nav">
                {/* Logo */}
                
                <a href="/" className="logo">
                  Boxing<em>101</em>
                </a>

                {/* Desktop Menu */}
                <ul className={`nav${menuOpen ? " open" : ""}`}>
                  <li className="scroll-to-section">
                    <a
                      href="/#home"
                      className={isActive("/#home") ? "active" : ""}
                      onClick={handleMenuLinkClick}
                    >
                      Home
                    </a>
                  </li>
                  <li className="scroll-to-section">
                    <a
                      href="/#about-us"
                      className={isActive("/#about-us") ? "active" : ""}
                      onClick={handleMenuLinkClick}
                    >
                      About
                    </a>
                  </li>
                  <li className="scroll-to-section">
                    <a
                      href="/#our-programs"
                      className={isActive("/#our-programs") ? "active" : ""}
                      onClick={handleMenuLinkClick}
                    >
                      Our Programs
                    </a>
                  </li>
                  <li className="scroll-to-section">
                    <a
                      href="/#movements"
                      className={isActive("/#movements") ? "active" : ""}
                      onClick={handleMenuLinkClick}
                    >
                      Movements
                    </a>
                  </li>
                    {user && (
                      <li className="scroll-to-section">
                        <a
                          href={user.role === "admin" ? "/adminProfile" : "/profile"}
                          className={
                            isActive(user.role === "admin" ? "/adminProfile" : "/profile")
                              ? "active"
                              : ""
                          }
                          onClick={handleMenuLinkClick}
                        >
                          Profile
                        </a>
                      </li>
                    )}
                  

                  {user ? (
                    <li id="sign-in-li" className="main-button">
                      <a id="sign-in-link"
                        style={{ cursor: "pointer" }}
                        onClick={handleLogout}
                      >
                        Logout
                      </a>
                    </li>
                  ) : (
                    <li id="sign-in-li" className="main-button">
                      <a
                        id="sign-in-link"
                        href="/login"
                        style={{ color: "#fff", background: "#ed563b" }}
                        className={isActive("/login") ? "active" : ""}
                        onClick={handleMenuLinkClick}
                      >
                        Sign In
                      </a>
                    </li>
                  )}
                </ul>

                {/* Mobile Menu Toggle Button */}
                <button
                  className={`menu-trigger${menuOpen ? " active" : ""}`}
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Toggle Menu"
                  aria-expanded={menuOpen}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </button>

                {/* Mobile Menu Overlay */}
                {menuOpen && (
                  <div
                    className="mobile-menu-overlay"
                    onClick={handleMenuLinkClick}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Mobile Navigation Menu"
                  >
                    <div
                      className="mobile-menu-content"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Mobile Menu Title */}
                      <div className="mobile-menu-title">
                        <span>
                          BOXING<em>101</em>
                        </span>
                        <button
                          className="mobile-menu-close"
                          onClick={handleMenuLinkClick}
                          aria-label="Close Menu"
                        >
                          <span></span>
                          <span></span>
                        </button>
                      </div>
                      {/* Close Button */}
                      

                      {/* Mobile Menu Items */}
                      <nav className="mobile-nav">
                        <ul>
                          <li>
                            <a
                              href="/#home"
                              className={isActive("/#home") ? "active" : ""}
                              onClick={handleMenuLinkClick}
                            >
                              <span className="menu-icon">🏠</span>
                              Home
                            </a>
                          </li>
                          <li>
                            <a
                              href="/#about-us"
                              className={isActive("/#about-us") ? "active" : ""}
                              onClick={handleMenuLinkClick}
                            >
                              <span className="menu-icon">ℹ️</span>
                              About
                            </a>
                          </li>
                          <li>
                            <a
                              href="/#our-programs"
                              className={
                                isActive("/#our-programs") ? "active" : ""
                              }
                              onClick={handleMenuLinkClick}
                            >
                              <span className="menu-icon">📋</span>
                              Our Programs
                            </a>
                          </li>
                          <li>
                            <a
                              href="/#movements"
                              className={
                                isActive("/#movements") ? "active" : ""
                              }
                              onClick={handleMenuLinkClick}
                            >
                              <span className="menu-icon">💪</span>
                              Movements
                            </a>
                          </li>
                          {user && (
                            <li>
                              <a
                                href={user.role === "admin" ? "/adminProfile" : "/profile"}
                                className={
                                  isActive(user.role === "admin" ? "/adminProfile" : "/profile")
                                    ? "active"
                                    : ""
                                }
                                onClick={handleMenuLinkClick}
                              >
                                <span className="menu-icon">👤</span>
                                Profile
                              </a>
                            </li>
                          )}

                          {user !== null && user.role === "admin" && (
                            <li>
                              <a
                                href="/movements/createMovement"
                                className={
                                  isActive("/movements/createMovement")
                                    ? "active"
                                    : ""
                                }
                                onClick={handleMenuLinkClick}
                              >
                                <span className="menu-icon">⚡</span>
                                Create Movement
                              </a>
                            </li>
                          )}
                        </ul>

                        {/* User Actions */}
                        <div className="mobile-menu-actions">
                          {user ? (
                            <>
                              <div className="user-info-box">
                                <span className="user-greeting">
                                  Hello, {user.username || "User"}
                                </span>
                                {user.role === "admin" && (
                                  <span className="user-badge">Admin</span>
                                )}
                              </div>
                              <button
                                className="logout-btn"
                                onClick={handleLogout}
                              >
                                Logout
                              </button>
                            </>
                          ) : (
                            <a
                              href="/login"
                              className="signin-btn"
                              id="signin-mobile"
                              onClick={handleMenuLinkClick}
                            >
                              <span  className="menu-icon">👤</span>
                              Sign In
                            </a>
                          )}
                        </div>
                      </nav>
                    </div>
                  </div>
                )}
              </nav>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;