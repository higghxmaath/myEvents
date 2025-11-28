import RSVP from "../models/RSVP.js";
import Event from "../models/Event.js";

export const getUserRsvps = async (req, res) => {
  try {
    const rsvps = await RSVP.find({ userId: req.params.userId });
    res.json(rsvps);
  } catch (err) {
    console.error("getUserRsvps error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createRsvp = async (req, res) => {
  try {
    const { userId, eventId } = req.body;
    if (!userId || !eventId) return res.status(400).json({ message: "Missing fields" });

    const exists = await RSVP.findOne({ userId, eventId });
    if (exists) return res.status(400).json({ message: "Already RSVP’d" });

    const newRSVP = await RSVP.create({ userId, eventId });

    const event = await Event.findById(eventId);
    if (event) {
      event.rsvpCount = (event.rsvpCount || 0) + 1;
      event.attendees = event.attendees || [];
      event.attendees.push({ userId });
      await event.save();
    }

    res.json(newRSVP);
  } catch (err) {
    console.error("createRsvp error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const cancelRsvp = async (req, res) => {
  try {
    const { userId, eventId } = req.body;
    await RSVP.findOneAndDelete({ userId, eventId });

    const event = await Event.findById(eventId);
    if (event) {
      event.rsvpCount = Math.max(0, (event.rsvpCount || 0) - 1);
      event.attendees = (event.attendees || []).filter(a => String(a.userId || a) !== String(userId));
      await event.save();
    }

    res.json({ success: true });
  } catch (err) {
    console.error("cancelRsvp error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
