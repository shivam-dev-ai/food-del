import express from "express";
import authMiddlewear from "../middlewear/Auth.js";
import {
  placeOrder,
  getAllOrders,
  verifyPayment,
  deleteOrder,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// orders endpoint

orderRouter.post("/place", placeOrder);
orderRouter.post("/verify", verifyPayment);
// orderRouter.get("/orderusers", authMiddlewear, userOrder);
// ✅ Admin route (can protect with admin auth if needed)
orderRouter.get("/all", getAllOrders);
orderRouter.delete("/delete/:id", deleteOrder);

export default orderRouter;
