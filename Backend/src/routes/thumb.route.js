import express from "express";
import {addThumb,deleteThumb,fetchThumbnails} from "../controllers/thumb.controller.js"

const router = express.Router();

router.post("/add",addThumb)
router.post("/delete",deleteThumb)
router.get("/fetch",fetchThumbnails)

export default router;