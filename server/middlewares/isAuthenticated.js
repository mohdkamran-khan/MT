import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    req.id = decode.userId; // Attach user ID to request object
    next(); // Call the next middleware or route handler
  } catch (error) {
    console.error("Error verifying token:", error);
  }
};
export default isAuthenticated;
