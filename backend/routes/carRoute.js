import express from "express";
import {
  addToCart,
  removeFromCart,
  getCart,
} from "../controllers/cartController.js";

import authMiddlewear from "../middlewear/Auth.js";

const cartRouter = express.Router();

cartRouter.post("/add", authMiddlewear, addToCart);
cartRouter.post("/remove", authMiddlewear, removeFromCart);
cartRouter.post("/get", authMiddlewear, getCart);

export default cartRouter;
