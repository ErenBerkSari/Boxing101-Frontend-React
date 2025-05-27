import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useLocation } from "react-router-dom";
import ScrollToHash from "./ScrollToHash";

function Header() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("");
  const { user, authIsLoading, isLoggedIn } = useSelector(
    (store) => store.auth
  );

  const handleLogout = async () => {
    await dispatch(logout());
  };

  // Sayfa içi bölümleri izle
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY;

      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    // Ana sayfa kontrolü
    if (path === "/" && location.pathname === "/" && !location.hash) return true;
    
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
     <ScrollToHash/> 
      <header className="header-area header-sticky background-header">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav className="main-nav">
                {/* <!-- ***** Logo Start ***** --> */}
                <a href="/" className="logo">
                  Boxing<em>101</em>
                </a>
                {/* <!-- ***** Logo End ***** --> */}
                {/* <!-- ***** Menu Start ***** --> */}
                <ul className="nav">
                  <li className="scroll-to-section">
                    <a href="/#home" className={isActive("/#home") ? "active" : ""}>
                      Home
                    </a>
                  </li>
                  <li className="scroll-to-section">
                    <a href="/#about-us" className={isActive("/#about-us") ? "active" : ""}>
                      About
                    </a>
                  </li>
                  <li className="scroll-to-section">
                    <a href="/#our-programs" className={isActive("/#our-programs") ? "active" : ""}>
                      Our Programs
                    </a>
                  </li>
                  <li className="scroll-to-section">
                    <a href="/#movements" className={isActive("/#movements") ? "active" : ""}>
                      Movements
                    </a>
                  </li>
                  {user ? (
                    <li className="scroll-to-section">
                      <a href="/program/createProgram" className={isActive("/program/createProgram") ? "active" : ""}>
                        Create Program
                      </a>
                    </li>
                  ) : (
                    <></>
                  )}

                  {user !== null && user.role === "admin" && (
                    <li className="scroll-to-section">
                      <a href="/movements/createMovement" className={isActive("/movements/createMovement") ? "active" : ""}>
                        Create Movement
                      </a>
                    </li>
                  )}

                  {user ? (
                    <li className="main-button">
                      <a style={{ cursor: "pointer" }} onClick={handleLogout}>
                        Çıkış Yap
                      </a>
                    </li>
                  ) : (
                    <div>
                      <li className="main-button">
                        <a href="/login" className={isActive("/login") ? "active" : ""}>
                          Sign In
                        </a>
                      </li>
                    </div>
                  )}
                </ul>
                <a className="menu-trigger">
                  <span>Menu</span>
                </a>
                {/* <!-- ***** Menu End ***** --> */}
              </nav>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
