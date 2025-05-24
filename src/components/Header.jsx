import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";

function Header() {
  const dispatch = useDispatch();
  const { user, authIsLoading, isLoggedIn } = useSelector(
    (store) => store.auth
  );

  const handleLogout = async () => {
    await dispatch(logout());
  };
  console.log(user?.role);
  if (authIsLoading) {
    return <div>Yükleniyor, lütfen bekleyin..</div>;
  }
  return (
    <div>
      <header className="header-area header-sticky background-header">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav className="main-nav">
                {/* <!-- ***** Logo Start ***** --> */}
                <a href="/" className="logo">
                  Boxing<em> 101</em>
                </a>
                {/* <!-- ***** Logo End ***** --> */}
                {/* <!-- ***** Menu Start ***** --> */}
                <ul className="nav">
                  <li className="scroll-to-section">
                    <a href="/" className="active">
                      Home
                    </a>
                  </li>
                  <li className="scroll-to-section">
                    <a href="/#features">About</a>
                  </li>
                  <li className="scroll-to-section">
                    <a href="/#our-classes">Classes</a>
                  </li>
                  <li className="scroll-to-section">
                    <a href="/#schedule">Schedules</a>
                  </li>
                  <li className="scroll-to-section">
                    <a href="/#contact-us">Contact</a>
                  </li>
                  {user ? (
                    <li className="scroll-to-section">
                      <a href="/program/createProgram">Create Program</a>
                    </li>
                  ) : (
                    <></>
                  )}

                  {user !== null && user.role === "admin" && (
                    <li className="scroll-to-section">
                      <a href="/movements/createMovement">Create Movement</a>
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
                        <a href="/login">Sign In</a>
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
