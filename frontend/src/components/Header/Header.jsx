import React from "react";
import "./Header.css"; // Assuming you have a CSS file for Header component styles

function Header() {
  return (
    <>
      <div className="header">
        <div className="header-content">
          <h2 className="text-2xl font-bold">Order your favourite Food here</h2>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. A
            doloribus voluptates itaque incidunt.
          </p>
          <button>Explore</button>
        </div>
      </div>
    </>
  );
}

export default Header;
