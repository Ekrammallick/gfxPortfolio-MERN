import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        // Check if token is provided in cookies
        const token = req.cookies.jwt; // Ensure the cookie name matches the one in login

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }

        // Find user in database
        const user = await User.findById(decoded.userId).select("-password"); // Exclude password field

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Attach user to request
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
