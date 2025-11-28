import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserRsvps, createRsvp, cancelRsvp } from "../controllers/rsvpController.js";

const router = express.Router();

router.get("/:userId", protect, getUserRsvps);
router.post("/", protect, createRsvp);
router.delete("/", protect, cancelRsvp);

export default router;
