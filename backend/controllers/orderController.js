import Razorpay from "razorpay";
import crypto from "crypto";
import orderModel from "../models/orderModel.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create Razorpay order and save to DB
export const placeOrder = async (req, res) => {
  console.log("Incoming Body:", req.body);
  try {
    const { userId, items, amount, address } = req.body;

    if (!userId || !items || !amount || !address) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    // 1️⃣ Create Razorpay order
    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // 2️⃣ Save order in MongoDB
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      status: "pending",
      payment: false,
      date: new Date(),
      razorpayOrderId: razorpayOrder.id,
    });

    await newOrder.save();

    // 3️⃣ Send response
    res.json({ success: true, order: razorpayOrder, dbOrderId: newOrder._id });
  } catch (error) {
    console.error(
      "Razorpay Order Error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      message: "Order creation failed",
      error: error.message,
    });
  }
};

// ✅ Verify payment and update DB status
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Missing payment details" });
    }

    // 1️⃣ Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }

    // 2️⃣ Update DB order status to paid
    await orderModel.findByIdAndUpdate(dbOrderId, {
      payment: true,
      status: "paid",
    });

    res.json({ success: true, message: "Payment verified & order updated" });
  } catch (error) {
    console.error("Payment Verification Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error during payment verification",
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find().sort({ date: -1 }); // latest first
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Admin Get Orders Error:", error);
    res.status(500).json({ success: false, message: "Cannot fetch orders" });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const deletedOrder = await orderModel.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ success: false, message: "Failed to delete order" });
  }
};
