import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function Login(props) {
  let history = useNavigate();
  const [inputEmailValue, setInputEmailValue] = useState("");
  const [inputPasswordValue, setInputPasswordValue] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);

  useEffect(() => {
    props.setNav("none");
  }, []);

  const handleLogin = () => {
    if (inputEmailValue === "" || inputPasswordValue === "") {
      console.log("email is: ", inputEmailValue);
      console.log("password is: ", inputPasswordValue);
      alert("Please fill all the fields");
      return;
    }
    if (!isValidEmail) {
      alert("Please enter a valid email");
      console.log("email is: ", inputEmailValue);
      console.log("password is: ", inputPasswordValue);
      return;
    } else {
      localStorage.setItem("token", inputEmailValue);
      history("/main");
    }
  };

  const handleEmailOnChange = (e) => {
    setInputEmailValue(e.target.value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(inputEmailValue));
  };
  const handlePasswordOnChange = (e) => {
    setInputPasswordValue(e.target.value);
  };

  return (
    <div className="loginbody">
      <div className="box">
        <div className="wave -one"></div>
        <div className="wave -two"></div>
        <div className="wave -three"></div>
        <div className="LoginInputBox">
          <h1>Login</h1>
          <div className="logininputholders">
            <div className="form-floating mb-3">
              <input
                type="email"
                id="loginID"
                value={inputEmailValue}
                className="form-control loginInputs"
                placeholder="name@example.com"
                onChange={handleEmailOnChange}
                required
              />
              <label htmlFor="loginID">Email address</label>
            </div>
            <i className="bx bxs-user"></i>
          </div>
          <div className="logininputholders">
            <div className="form-floating">
              <input
                type="password"
                value={inputPasswordValue}
                className="form-control loginInputs"
                id="floatingPassword"
                placeholder="Password"
                onChange={handlePasswordOnChange}
                required
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>
            <i className="bx bxs-lock-alt"></i>
          </div>

          <button className="btn btn-primary" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
