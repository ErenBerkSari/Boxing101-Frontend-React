import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { Link, useLocation } from "react-router-dom";
import ScrollToHash from "./ScrollToHash";
import "../css/header.css";
function Header() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, authIsLoading, isLoggedIn } = useSelector(
    (store) => store.auth
  );

  const handleLogout = async () => {
    await dispatch(logout());
  };

  // Sayfa içi bölümleri izle
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      const scrollPosition = window.scrollY;

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

  console.log(user?.role);
  console.log(activeSection);

  if (authIsLoading) {
    return <div>Yükleniyor, lütfen bekleyin..</div>;
  }

  return (
    <div>
      <ScrollToHash />

      <header className="header-area header-sticky background-header">
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
                    <li className="scroll-to-section">
                      <a
                        href="/profile"
                        className={
                          isActive("/profile")
                            ? "active"
                            : ""
                        }
                        onClick={handleMenuLinkClick}
                      >
                        Profile
                      </a>
                    </li>
                  

                  {user !== null && user.role === "admin" && (
                    <li className="scroll-to-section">
                      <a
                        href="/movements/createMovement"
                        className={
                          isActive("/movements/createMovement") ? "active" : ""
                        }
                        onClick={handleMenuLinkClick}
                      >
                        Create Movement
                      </a>
                    </li>
                  )}

                  {user ? (
                    <li className="main-button">
                      <a
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          handleLogout();
                          handleMenuLinkClick();
                        }}
                      >
                        Çıkış Yap
                      </a>
                    </li>
                  ) : (
                    <li className="main-button">
                      <a
                        href="/login"
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
                      {/* Close Button */}
                      <button
                        className="mobile-menu-close"
                        onClick={handleMenuLinkClick}
                        aria-label="Close Menu"
                      >
                        <span></span>
                        <span></span>
                      </button>

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
                                href="/program/createProgramByUser"
                                className={
                                  isActive("/program/createProgramByUser")
                                    ? "active"
                                    : ""
                                }
                                onClick={handleMenuLinkClick}
                              >
                                <span className="menu-icon">➕</span>
                                Create Program
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
                              <div className="user-info">
                                <span className="user-greeting">
                                  Merhaba, {user.name || "Kullanıcı"}
                                </span>
                                {user.role === "admin" && (
                                  <span className="user-badge">Admin</span>
                                )}
                              </div>
                              <button
                                className="logout-btn"
                                onClick={() => {
                                  handleLogout();
                                  handleMenuLinkClick();
                                }}
                              >
                                <span className="menu-icon">🚪</span>
                                Çıkış Yap
                              </button>
                            </>
                          ) : (
                            <a
                              href="/login"
                              className="signin-btn"
                              onClick={handleMenuLinkClick}
                            >
                              <span className="menu-icon">👤</span>
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
