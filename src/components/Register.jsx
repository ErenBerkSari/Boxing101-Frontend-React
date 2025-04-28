import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../redux/slices/authSlice";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { authIsLoading } = useSelector((state) => state.auth);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");

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
    <section
      className="register-section"
      style={{
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="text-center mb-4">
              <h2
                style={{
                  color: "#ed563b",
                  fontWeight: "700",
                  fontSize: "32px",
                  textTransform: "uppercase",
                  marginBottom: "15px",
                }}
              >
                REGISTER
              </h2>
            </div>

            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "15px",
                padding: "35px 30px",
                boxShadow: "0 5px 20px rgba(0, 0, 0, 0.1)",
                border: "1px solid #eaeaea",
              }}
            >
              <form onSubmit={handleRegister}>
                <div className="form-group" style={{ marginBottom: "20px" }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Full Name*"
                    required
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    style={{
                      height: "55px",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      padding: "0 15px",
                      fontSize: "15px",
                      transition: "border-color 0.3s",
                    }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "20px" }}>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email Address*"
                    required
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    style={{
                      height: "55px",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      padding: "0 15px",
                      fontSize: "15px",
                      transition: "border-color 0.3s",
                    }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "20px" }}>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password*"
                    required
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    style={{
                      height: "55px",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      padding: "0 15px",
                      fontSize: "15px",
                      transition: "border-color 0.3s",
                    }}
                  />
                </div>

                <div className="form-group text-center">
                  <button
                    type="submit"
                    className="register-button"
                    style={{
                      backgroundColor: "#ed563b",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "15px 0",
                      fontSize: "16px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      width: "100%",
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                      letterSpacing: "1px",
                    }}
                  >
                    REGISTER NOW
                  </button>
                </div>

                <div className="text-center mt-4">
                  <p style={{ fontSize: "15px", color: "#7a7a7a" }}>
                    Already have an account?{" "}
                    <a
                      href="/login"
                      style={{
                        color: "#ed563b",
                        textDecoration: "none",
                        fontWeight: "600",
                        transition: "color 0.3s",
                      }}
                    >
                      Login
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
