import express from "express";
import {login,checkAuth,logout} from "../controllers/auth.controller.js"
import {protectRoute}  from "../middlewares/protect.middleware.js"

const router = express.Router();

router.post("/login",login)
router.get("/check",protectRoute,checkAuth)
router.post("/logout",logout)

export default router;