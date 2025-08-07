// export default Fdisplay;
import React, { useContext } from "react";
import "./Fdisplay.css";
import { StoreContext } from "../context/StoreContext.jsx";
import Fooditem from "../Fooditem/Fooditem.jsx";

function Fdisplay({ category }) {
  const { food_list } = useContext(StoreContext);

  return (
    <div className="food-display" id="food-display">
      <h2>Top Dishes</h2>
      <div className="food-display-list">
        {food_list.map((item, index) => {
          console.log("Selected:", category, "| Item:", item.Category);

          if (category === "All" || category === item.category) {
            return (
              <Fooditem
                key={index}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            );
          }
        })}
      </div>
    </div>
  );
}

export default Fdisplay;
