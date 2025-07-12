import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register, clearMessages } from "../redux/slices/authSlice";
import { Box, Button, Modal, Typography, Alert, Snackbar } from "@mui/material";
import Loader from "./Loader";
import "../css/register.css";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { authIsLoading, error, successMessage } = useSelector(
    (state) => state.auth
  );
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [open, setOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  // Redux state değişikliklerini izle
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

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(
        register({
          username: registerUsername,
          email: registerEmail,
          password: registerPassword,
        })
      );

      if (register.fulfilled.match(result)) {
        // Başarılı kayıtta successMessage zaten Redux'ta olacak
        setTimeout(() => {
          navigate("/");
          dispatch(clearMessages());

        }, 2000);
      }
    } catch (error) {
      console.error("Registration error: ", error);
    }
  };

  const handleCloseMessage = () => {
    setShowMessage(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
    <div  className="container-scroller" >
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
      <a href="/" className="home-icon">
<i className="mdi mdi-home"></i>
</a>
      <div  className="container-fluid page-body-wrapper full-page-wrapper" >
        <div   className="content-wrapper d-flex align-items-stretch auth auth-img-bg">
          <div  className="row flex-grow">
            <div  className="col-lg-6 d-flex align-items-center justify-content-center">
            <div
              className="auth-form-transparent text-left"
              style={{
                paddingLeft: "1rem",
                paddingRight: "1rem",
                paddingBottom: "1rem",
                maxWidth: "400px",
                width: "100%",
              }}
            >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "2px solid #ed563b",
                    margin:"15px 15px 15px 0px",
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
                  <a href="/" className="auth-logo-register">
                  Boxing<em>101</em>
                </a>
                </div>
                <h4>New here?</h4>
                <h6 className="font-weight-light">
                  Join us today! It takes only few steps
                </h6>
                <form onSubmit={handleRegister} className="pt-3">
                  <div className="form-group">
                    <label>Username</label>
                    <div className="input-group">
                      <div className="input-group-prepend bg-transparent">
                        <span className="input-group-text bg-transparent border-right-0">
                          <i
                            style={{
                              fontSize: "15px",
                              color: "#ed563b",
                            }}
                            className="mdi mdi-account-outline"
                          ></i>
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control form-control-lg border-left-0"
                        placeholder="Username"
                        value={registerUsername}
                        onChange={(e) => setRegisterUsername(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email</label>
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
                        type="text"
                        className="form-control form-control-lg border-left-0"
                        placeholder="Email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Password</label>
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
                        id="exampleInputPassword"
                        placeholder="Password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="form-check">
                      <label className="form-check-label text-muted">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          disabled
                          checked
                          style={{
                            position: "absolute",
                            width: "18px",
                            height: "18px",
                            opacity: 1,
                            accentColor: "#ed563b",
                          }}
                        />
                        I agree to all{" "}
                        <a
                          onClick={handleOpen}
                          style={{ color: "#ed563b", cursor: "pointer" }}
                        >
                          Terms & Conditions
                        </a>
                      </label>
                    </div>
                  </div>
                  <div className="mt-3">
                    <button
                      type="submit"
                      id="form-submit"
                      className="btn btn-block btn-info btn-lg font-weight-medium auth-form-btn"
                    >
                      SIGN UP
                    </button>
                  </div>
                  <div className="text-center mt-3 font-weight-light">
                    Already have an account?{" "}
                    <a style={{ color: "#ed563b" }} href="/login">
                      Login
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
            <div className="col-lg-6 register-half-bg d-flex flex-row">
              <img src="assets/images/contact-bg.jpg" alt="background" />
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiModal-backdrop": {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: {
              xs: "90%",
              sm: "80%",
              md: "70%",
              lg: "500px",
            },
            maxWidth: "500px",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: {
              xs: 2,
              sm: 3,
            },
            borderRadius: "12px",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              mb: 2,
              fontSize: {
                xs: "1rem",
                sm: "1.25rem",
              },
            }}
          >
            <strong>Terms and Conditions & Liability Disclaimer</strong>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 2,
              fontSize: {
                xs: "0.875rem",
                sm: "1rem",
              },
              lineHeight: 1.6,
            }}
          >
            <strong>1. Application Purpose:</strong><br/>
            Boxing101 is developed by a non-professional developer for hobby purposes in the boxing field. This application is designed to provide general fitness and boxing training guidance only.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 2,
              fontSize: {
                xs: "0.875rem",
                sm: "1rem",
              },
              lineHeight: 1.6,
            }}
          >
            <strong>2. Health and Safety Warning:</strong><br/>
            Before performing any movements or programs, you must properly warm up areas such as waist, shoulders, wrists, and other joints. Consult with a healthcare professional before starting any exercise program, especially if you have pre-existing medical conditions.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 2,
              fontSize: {
                xs: "0.875rem",
                sm: "1rem",
              },
              lineHeight: 1.6,
            }}
          >
            <strong>3. Liability Disclaimer:</strong><br/>
            By using this application, you acknowledge and agree that:
            • The developers and creators of Boxing101 are not responsible for any injuries, accidents, or health issues that may occur during or after using the application
            • You use the application at your own risk
            • You are responsible for your own safety and well-being
            • You will stop exercising immediately if you experience pain or discomfort
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 2,
              fontSize: {
                xs: "0.875rem",
                sm: "1rem",
              },
              lineHeight: 1.6,
            }}
          >
            <strong>4. User Responsibility:</strong><br/>
            You agree to use the application responsibly and to follow proper safety guidelines. If you are under 18 years old, you must have parental consent to use this application.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 2,
              fontSize: {
                xs: "0.875rem",
                sm: "1rem",
              },
              lineHeight: 1.6,
            }}
          >
            By clicking "Close" and continuing with registration, you confirm that you have read, understood, and agree to these terms and conditions, including the liability disclaimer.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={handleClose}
            fullWidth
            sx={{
              mt: 3,
              borderRadius: "8px",
              fontWeight: "bold",
              py: {
                xs: 1,
                sm: 1.5,
              },
              backgroundColor: "#ed563b",
              fontSize: {
                xs: "0.875rem",
                sm: "1rem",
              },
              "&:hover": {
                backgroundColor: "#d4452f",
              },
            }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default Register;
