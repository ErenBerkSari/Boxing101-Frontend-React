import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/slices/authSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { authIsLoading } = useSelector((state) => state.auth);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // Sayfanın yenilenmesini engeller
    try {
      console.log("Login işlemi başlatılıyor..");
      const result = await dispatch(
        login({
          email: loginEmail,
          password: loginPassword,
        })
      );
      if (login.fulfilled.match(result)) {
        console.log("Giriş başarılı: ", result);
        navigate("/");
      } else {
        console.log("Giriş başarısız: ", result);
        alert(
          result.payload || "Bilinmeyen bir hata oluştu. Lütfen tekrar deneyin."
        );
      }
    } catch (error) {
      console.error("Login işlemi sırasında hata: ", error);
      alert("An error occurred during the login process. Please try again.");
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
    <section className="section" id="login">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 offset-lg-2">
            <div
              style={{ marginTop: "15px", marginBottom: "0" }}
              className="section-heading text-center"
            >
              <h2>
                <em>Login</em>
              </h2>
              <img
                style={{ margin: "0" }}
                width={50}
                src="assets/images/register_box_icon.png"
                alt="waves"
              />
              <p>
                Welcome back! Please login to access your Training Studio
                account.
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-8 offset-lg-2">
            <div
              className="login-form-container"
              style={{
                backgroundColor: "#f8f8f8",
                border: "1px solid #ddd",
                borderRadius: "15px",
                padding: "30px",
                marginTop: "20px",
                boxShadow: "0px 0px 15px rgba(0,0,0,0.1)",
              }}
            >
              <form id="login-form" onSubmit={handleLogin}>
                <div className="row">
                  <div className="col-lg-12">
                    <fieldset>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email Address*"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        style={{
                          width: "100%",
                          height: "50px",
                          marginBottom: "20px",
                          borderRadius: "5px",
                          border: "1px solid #ddd",
                          padding: "0 15px",
                          fontSize: "14px",
                        }}
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-12">
                    <fieldset>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password*"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        style={{
                          width: "100%",
                          height: "50px",
                          marginBottom: "20px",
                          borderRadius: "5px",
                          border: "1px solid #ddd",
                          padding: "0 15px",
                          fontSize: "14px",
                        }}
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-12 text-center">
                    <fieldset>
                      <button
                        type="submit"
                        id="form-submit"
                        className="main-button"
                        style={{
                          backgroundColor: "#ed563b",
                          color: "#fff",
                          fontSize: "14px",
                          border: "none",
                          padding: "12px 30px",
                          borderRadius: "5px",
                          cursor: "pointer",
                          textTransform: "uppercase",
                          fontWeight: "500",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Login
                      </button>
                    </fieldset>
                  </div>
                  <div className="col-lg-12 text-center mt-4">
                    <p>
                      Don't have an account?{" "}
                      <a
                        href="/register"
                        className="text-button"
                        style={{ color: "#ed563b" }}
                      >
                        Register Now
                      </a>
                    </p>
                    <p>
                      <a
                        href="/forgot-password"
                        className="text-button"
                        style={{ color: "#ed563b" }}
                      >
                        Forgot Password?
                      </a>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
