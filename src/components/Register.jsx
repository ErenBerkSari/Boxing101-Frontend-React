import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../redux/slices/authSlice";
import { Box, Button, Modal, Typography } from "@mui/material";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { authIsLoading } = useSelector((state) => state.auth);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [open, setOpen] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault(); // Sayfanın yenilenmesini engeller
    try {
      const result = await dispatch(
        register({
          username: registerUsername,
          email: registerEmail,
          password: registerPassword,
        })
      );

      if (register.fulfilled.match(result)) {
        navigate("/");
      } else {
        alert(result.payload || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Kayıt işlemi sırasında hata: ", error);
      alert(
        "An error occurred during the registration process. Please try again."
      );
    }
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
        <div>Loading, please wait...</div>
      </div>
    );
  }
  return (
    <div class="container-scroller">
      <div class="container-fluid page-body-wrapper full-page-wrapper">
        <div class="content-wrapper d-flex align-items-stretch auth auth-img-bg">
          <div class="row flex-grow">
            <div class="col-lg-6 d-flex align-items-center justify-content-center">
              <div class="auth-form-transparent text-left p-3">
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
                <h4>New here?</h4>
                <h6 class="font-weight-light">
                  Join us today! It takes only few steps
                </h6>
                <form onSubmit={handleRegister} class="pt-3">
                  <div class="form-group">
                    <label>Username</label>
                    <div class="input-group">
                      <div class="input-group-prepend bg-transparent">
                        <span class="input-group-text bg-transparent border-right-0">
                          <i
                            style={{
                              fontSize: "15px",
                              color: "#ed563b",
                              position: "absolute",
                            }}
                            class="mdi mdi-account-outline "
                          ></i>
                        </span>
                      </div>
                      <input
                        type="text"
                        class="form-control form-control-lg border-left-0"
                        placeholder="Username"
                        required
                        value={registerUsername}
                        onChange={(e) => setRegisterUsername(e.target.value)}
                      />
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Email</label>
                    <div class="input-group">
                      <div class="input-group-prepend bg-transparent">
                        <span class="input-group-text bg-transparent border-right-0">
                          <i
                            style={{
                              fontSize: "15px",
                              color: "#ed563b",
                              position: "absolute",
                            }}
                            class="mdi mdi-email-outline "
                          ></i>
                        </span>
                      </div>
                      <input
                        type="email"
                        class="form-control form-control-lg border-left-0"
                        placeholder="Email"
                        required
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Password</label>
                    <div class="input-group">
                      <div class="input-group-prepend bg-transparent">
                        <span class="input-group-text bg-transparent border-right-0">
                          <i
                            style={{
                              fontSize: "15px",
                              color: "#ed563b",
                              position: "absolute",
                            }}
                            class="mdi mdi-lock-outline "
                          ></i>
                        </span>
                      </div>
                      <input
                        type="password"
                        class="form-control form-control-lg border-left-0"
                        id="exampleInputPassword"
                        placeholder="Password"
                        required
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div class="mb-4">
                    <div class="form-check">
                      <label class="form-check-label text-muted">
                        <input
                          type="checkbox"
                          class="form-check-input"
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
                          style={{ color: "blue", cursor: "pointer" }}
                        >
                          Terms & Conditions
                        </a>
                      </label>
                    </div>
                  </div>
                  <div class="mt-3">
                    <button
                      type="submit"
                      id="form-submit"
                      class="btn btn-block btn-info btn-lg font-weight-medium auth-form-btn"
                    >
                      SIGN UP
                    </button>
                  </div>
                  <div class="text-center mt-3 font-weight-light">
                    Already have an account?{" "}
                    <a style={{ color: "#ed563b" }} href="/login">
                      Login
                    </a>
                  </div>
                </form>
              </div>
            </div>
            <div class="col-lg-6 register-half-bg d-flex flex-row">
              <img src="assets/images/contact-bg.jpg" />
            </div>
          </div>
        </div>
      </div>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: "auto",
            height: "fit-content",
            width: "90%",
            maxWidth: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: "12px", // Daha yumuşak köşeler
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
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
              py: 1.5,
              backgroundColor: "#ed563b",
            }}
          >
            Kapat
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default Register;
