import mongoose from "mongoose";

const rsvpSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("RSVP", rsvpSchema);
