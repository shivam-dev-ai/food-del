
import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets.js";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../context/StoreContext.jsx";

const Navbar = ({ setShowLoginPopup }) => {
  const [menu, setmenu] = useState("home");
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);

  //  State to control dropdown visibility
  const [showDropdown, setShowDropdown] = useState(false);

  //  Toggle dropdown on profile click
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  return (
    <div className="navbar ">
      <Link to={"/"}>
        <img src={assets.logo} alt="" className="logo" />
      </Link>
      <ul className="navbar-menu  ">
        <Link
          to={"/"}
          onClick={() => setmenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </Link>
        <a
          href="#explore-menu"
          onClick={() => setmenu("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          Menu
        </a>
        <a
          href="#app-download"
          onClick={() => setmenu("mobile-app")}
          className={menu === "mobile-app" ? "active" : ""}
        >
          Mobile App
        </a>
        <a
          href="#footer"
          onClick={() => setmenu("contact-Us")}
          className={menu === "contact-Us" ? "active" : ""}
        >
          Contact Us
        </a>
      </ul>
      <div className="navbar-right ">
        <img src={assets.search_icon} alt="" className="search-icon-img" />
        <div className="navbar-search-icon">
          <Link to={"/cart"}>
            <img src={assets.basket_icon} alt="" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token ? (
          <button
            onClick={() => setShowLoginPopup(true)}
            className="Navbar-btn "
          >
            Sign in
          </button>
        ) : (
          <div className="navbar-profile">
            {/* ✅ Click event to toggle dropdown */}
            <img src={assets.profile_icon} alt="" onClick={toggleDropdown} />

            {/* ✅ Dropdown shows only when state is true */}
            {showDropdown && (
              <ul className="nav-profile-dropdown">
                <li>
                  <img src={assets.bag_icon} alt="" />
                  <p>Orders</p>
                </li>
                <hr />
                <li onClick={logout}>
                  <img src={assets.bag_icon} alt="" />
                  <p>Logout</p>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
