import express from "express";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";
import { getEvents, createEvent, getEvent, updateEvent } from "../controllers/eventController.js";

const router = express.Router();

router.get("/", getEvents);
router.post("/", protect, upload.single("image"), createEvent);
router.get("/:id", getEvent);
router.put("/:id", protect, upload.single("image"), updateEvent);

export default router;
