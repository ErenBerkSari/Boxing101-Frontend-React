import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, clearMessages } from "../redux/slices/authSlice";
import { Alert, Snackbar } from "@mui/material";
import Loader from "./Loader";

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
      console.log("Message state changed:", { error, successMessage });
      setShowMessage(true);
    }
  }, [error, successMessage]);

  // Component unmount olduğunda mesajları temizle
  useEffect(() => {
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login attempt started");
    
    try {
      const result = await dispatch(
        login({
          email: loginEmail,
          password: loginPassword,
        })
      );
      
      console.log("Login result:", result);
      
      if (login.fulfilled.match(result)) {
        console.log("Login successful");
        // 2 saniye sonra ana sayfaya yönlendir
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        console.log("Login failed:", result.payload);
      }
    } catch (error) {
      console.error("Login işlemi sırasında hata: ", error);
    }
  };

  const handleCloseMessage = () => {
    console.log("Closing message");
    setShowMessage(false);
    // Mesajı kapatırken Redux state'ini de temizle
    dispatch(clearMessages());
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
          <div>Loading, please wait...</div>
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

      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="content-wrapper d-flex align-items-stretch auth auth-img-bg">
          <div className="row flex-grow">
            <div className="col-lg-6 d-flex align-items-center justify-content-center">
              <div className="auth-form-transparent text-left p-3">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
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
                  <span
                    style={{
                      fontSize: "25px",
                      fontWeight: "bold",
                      color: "black",
                      marginLeft: "3px",
                    }}
                  >
                    Boxing101
                  </span>
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
                              position: "absolute",
                              color: "#ed563b",
                            }}
                            className="mdi mdi-account-outline"
                          ></i>
                        </span>
                      </div>
                      <input
                        type="email"
                        className="form-control form-control-lg border-left-0"
                        id="email"
                        required
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
                              position: "absolute",
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
                        required
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