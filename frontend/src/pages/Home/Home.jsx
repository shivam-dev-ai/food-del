import React, { useState } from "react";
import "./Home.css"; // Assuming you have a CSS file for Home component styles
import Header from "../../components/Header/Header.jsx";
import Explore from "../../components/Exploremenu/Explore.jsx";
import Fdisplay from "../../components/Fooddisplay/Fdisplay.jsx";
import Appdownload from "../../components/Appdownload/Appdownload.jsx";

function Home() {
  const [category, setCategory] = useState("All");

  return (
    <div>
      <Header />
      <Explore category={category} setCategory={setCategory} />
      <Fdisplay category={category} />
      <Appdownload />
    </div>
  );
}

export default Home;
