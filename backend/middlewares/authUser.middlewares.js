import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
const authUser = async (req, res, next) => {
  try {
    if (!req.cookies.jwt) {
      return res
        .status(401)
        .json({ message: "Please login to access this route" });
    }
    const token = req.cookies.jwt;
    if (!token) {
      console.log("No token found");
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userid).select("-password");
    // req.user = decoded;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Please login to access this route" });
  }
};

export default authUser;
