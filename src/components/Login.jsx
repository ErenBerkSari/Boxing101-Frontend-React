import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, clearMessages } from "../redux/slices/authSlice";
import { Alert, Snackbar } from "@mui/material";
import Loader from "./Loader";
import "../css/login.css";
function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { authIsLoading, error, successMessage } = useSelector(
    (state) => state.auth
  );
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showMessage, setShowMessage] = useState(false);

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

  // Component unmount olduğunda mesajları temizle
  useEffect(() => {
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await dispatch(
        login({
          email: loginEmail,
          password: loginPassword,
        })
      );

      if (login.fulfilled.match(result)) {
        // 2 saniye sonra ana sayfaya yönlendir
        setTimeout(() => {
          navigate("/");
          dispatch(clearMessages());

        }, 2000);
      }
    } catch (error) {
      console.error("Error during login process: ", error);
    }
  };

  const handleCloseMessage = () => {
    setShowMessage(false);
  };

  if (authIsLoading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "20px",
        }}
      >
        <Loader />
      </div>
    );
  }

  return (
    <div className="container-scroller">
      <Snackbar
        open={showMessage}
        autoHideDuration={6000}
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
      <a href="/" className="home-icon" id="home-icon">
<i className="mdi mdi-home"></i>
</a>
      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="content-wrapper d-flex align-items-stretch auth auth-img-bg">
          <div className="row flex-grow">
            <div className="col-lg-6 d-flex align-items-center justify-content-center">
              <div className="auth-form-transparent text-left p-3">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "2px solid #ed563b",
                    margin:"15px 15px 20px 0px",

                  }}
                  className="brand-logo"
                >
                  <img
                    src="assets/images/register_box_icon.png"
                    style={{
                      width: "40px",
                    }}
                    alt="logo"
                  />
                  <a href="/" className="auth-logo">
                  Boxing<em>101</em>
                </a>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <h4>Welcome back!</h4>
                  <h6 className="font-weight-light">Happy to see you again!</h6>
                </div>

                <form className="pt-3" onSubmit={handleLogin}>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <div className="input-group">
                      <div className="input-group-prepend bg-transparent">
                        <span className="input-group-text bg-transparent border-right-0">
                          <i
                            style={{
                              fontSize: "15px",
                              color: "#ed563b",
                            }}
                            className="mdi mdi-email-outline"
                          ></i>
                        </span>
                      </div>
                      <input
                        type="email"
                        className="form-control form-control-lg border-left-0"
                        id="email"
                        placeholder="Email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                       
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-group">
                      <div className="input-group-prepend bg-transparent">
                        <span className="input-group-text bg-transparent border-right-0">
                          <i
                            style={{
                              fontSize: "15px",
                              color: "#ed563b",
                            }}
                            className="mdi mdi-lock-outline"
                          ></i>
                        </span>
                      </div>
                      <input
                        type="password"
                        className="form-control form-control-lg border-left-0"
                        id="password"
                        placeholder="Password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="my-3">
                    <button
                      type="submit"
                      id="form-submit"
                      className="btn btn-block btn-info btn-lg font-weight-medium auth-form-btn"
                      disabled={authIsLoading}
                    >
                      {authIsLoading ? "LOADING..." : "LOGIN"}
                    </button>
                  </div>

                  <div className="text-center mt-4 font-weight-light">
                    Don't have an account?{" "}
                    <a style={{ color: "#ed563b" }} href="/register">
                      Create
                    </a>
                  </div>
                  <div className="text-center mt-2">
                    <a href="/" className="form-home-link">
                      <i className="mdi mdi-home"></i> Home
                    </a>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-lg-6 login-half-bg d-flex flex-row">
              <img src="assets/images/contact-bg.jpg" alt="background" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
