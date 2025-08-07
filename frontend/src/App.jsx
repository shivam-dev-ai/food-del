import React, { useState } from "react";
import Navbar from "./components/navbar/Navbar.jsx";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import Placeorder from "./pages/Placeorder/Placeorder.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Loginpoppu from "./components/Loginpopup/Loginpoppu.jsx";

function App() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  return (
    <>
      {showLoginPopup ? (
        <Loginpoppu setShowLoginPopup={setShowLoginPopup} />
      ) : (
        <></>
      )}
      <div className="app p-5">
        <Navbar setShowLoginPopup={setShowLoginPopup} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<Placeorder />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
