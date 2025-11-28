import mongoose from "mongoose";

const attendeeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  image: { type: String, default: "" }, 
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  views: { type: Number, default: 0 },
  rsvpCount: { type: Number, default: 0 },
  attendees: [attendeeSchema]
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);
