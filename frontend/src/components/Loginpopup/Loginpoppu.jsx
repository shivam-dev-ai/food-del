import React, { useContext, useState } from "react";
import "./Loginpopup.css";
import { StoreContext } from "../context/StoreContext.jsx";
import axios from "axios";

function Loginpopup({ setShowLoginPopup }) {
  const { url, setToken } = useContext(StoreContext);

  const [currState, setCurrentState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (e) => {
    e.preventDefault();
    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    const response = await axios.post(newUrl, data);
    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      setShowLoginPopup(false);
    } else {
      alert(response.data.message);
    }
  };

  return (
    <div className="login-popup-overlay">
      <div className="login-popup-box">
        <h2>{currState}</h2>

        <form onSubmit={onLogin} className="login-form">
          {currState === "Sign Up" && (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Enter Your Full Name"
              required
            />
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Email"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Password"
            required
          />

          {/* ✅ Checkbox is now inside the form so required works */}
          <div className="loginpopup-condition">
            <input type="checkbox" required />
            <p>By Continuing, I agree to the Terms of Use & Privacy Policy</p>
          </div>

          <button type="submit">
            {currState === "Login" ? "Login" : "Create Account"}
          </button>
        </form>

        <button onClick={() => setShowLoginPopup(false)} className="close-btn">
          ✖
        </button>

        {/* ✅ Correct Toggle Messages */}
        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrentState("Sign Up")}>Click Here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrentState("Login")}>Login Here</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default Loginpopup;
