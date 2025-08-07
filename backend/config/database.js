import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://hungryhub:hungry55@cluster0.oahjv2k.mongodb.net/food-del"
    )
    .then(() => {
      console.log("MongoDB connected successfully");
    });
};
