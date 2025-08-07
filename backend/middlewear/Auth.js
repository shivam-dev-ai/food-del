import jwt from "jsonwebtoken";

const authMiddlewear = async (req, res, next) => {
  try {
    // ✅ Check for token in different ways
    const token =
      req.headers["token"] ||
      (req.headers["authorization"] &&
        req.headers["authorization"].split(" ")[1]);

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized, Login Again" });
    }

    // ✅ Verify token
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = token_decode.id; // attach userId to req
    next();
  } catch (error) {
    console.error("JWT Error:", error);
    res
      .status(401)
      .json({ success: false, message: "Invalid or Expired Token" });
  }
};

export default authMiddlewear;
