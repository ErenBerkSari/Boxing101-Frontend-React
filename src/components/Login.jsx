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
    <div className="container-scroller">
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
                  {/* <span>Your boxing journey starts here</span> */}
                </div>
                <div
                  style={{
                    display: "flex",

                    flexDirection: "column",
                  }}
                >
                  <h4 style={{}}>Welcome back!</h4>
                  <h6 className="font-weight-light">Happy to see you again!</h6>
                </div>

                <form className="pt-3" onSubmit={handleLogin}>
                  <div className="form-group">
                    <label for="exampleInputEmail">Email</label>
                    <div className="input-group">
                      <div className="input-group-prepend bg-transparent">
                        <span className="input-group-text bg-transparent border-right-0">
                          <i
                            style={{
                              fontSize: "15px",
                              position: "absolute",
                              color: "#ed563b",
                            }}
                            className="mdi mdi-account-outline "
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
                    <label for="exampleInputPassword">Password</label>
                    <div className="input-group">
                      <div className="input-group-prepend bg-transparent">
                        <span className="input-group-text bg-transparent border-right-0">
                          <i
                            style={{
                              fontSize: "15px",
                              position: "absolute",
                              color: "#ed563b",
                            }}
                            className="mdi mdi-lock-outline "
                          ></i>
                        </span>
                      </div>
                      <input
                        type="password"
                        className="form-control form-control-lg border-left-0"
                        id="exampleInputPassword"
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
                    >
                      LOGIN
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
              <img src="assets/images/contact-bg.jpg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
