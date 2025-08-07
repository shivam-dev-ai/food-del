import React from "react";
import "./Appdownload.css";
import { assets } from "../../assets/assets.js";

function Appdownload() {
  return (
    <div className="app-download" id="app-download">
      <p>
        For better experience download <br /> Tomato App
      </p>
      <div className="app-download-platform">
        <img src={assets.play_store} alt="" />
        <img src={assets.app_store} alt="" />
      </div>
    </div>
  );
}

export default Appdownload;
