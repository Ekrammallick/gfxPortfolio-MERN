import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { generateToken } from "../libs/utils.js";
export const login = async (req, res) => {
    const { email, password } = req.body;
      console.log(email)
      console.log(password)
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const user = await User.findOne({ email });
          console.log(user)
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // For plaintext password (not recommended)
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        console.log(user._id);
        // Generate JWT
         const token =  generateToken(user._id, res);
         console.log(token);
         return res.status(200).json({
            _id: user._id,
            email: user.email,
            token
          });
          

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const logout = (req,res)=>{
    try{
     res.cookie("jwt", "", { maxAge: 0 });
     res.status(200).json({ message: "Logged out successfully" });
    }catch(error){
     console.error("Error in logout controller", error.message);
     res.status(500).json({ message: "Internal Server Error" });
    }
}
export const checkAuth = async (req, res) => {
    
    try {
      return  res.status(200).json(req.user);
      } catch (error) {
        console.error("Error in checkAuth controller", error.message);
      return  res.status(500).json({ message: "Internal Server Error" });
      }
};
