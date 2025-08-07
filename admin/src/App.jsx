import React from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add/Add.jsx";
import List from "./pages/List/List.jsx";
import Orders from "./pages/Orders/Orders.jsx";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-container">
        <Sidebar />
        <Routes>
          <Route path="/add" element={<Add />}></Route>
          <Route path="/list" element={<List />}></Route>
          <Route path="/order" element={<Orders />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
