import foodModel from "../models/FoodModels.js";
import fs from "fs";

// add food item
const addFood = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    if (!req.body.price || isNaN(req.body.price)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or missing price" });
    }

    const image_filename = req.file.filename;

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price), // safe conversion
      category: req.body.category,
      image: image_filename,
    });

    await food.save();
    res.json({ success: true, message: "Food item added successfully", food });
  } catch (error) {
    console.error("Error saving food:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// all fodd list
const foodList = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch food items" });
  }
};

// remove food items
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food item removed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to remove food item" });
  }
};

export { addFood, foodList, removeFood };
