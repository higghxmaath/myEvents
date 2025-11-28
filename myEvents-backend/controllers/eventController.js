import fs from "fs";
import path from "path";
import Event from "../models/Event.js";
import { cloudinary, cloud } from "../utils/cloudinary.js";
import multer from "multer";

// helper: upload buffer to cloudinary using upload_stream wrapped in a promise
const uploadBufferToCloudinary = (buffer, filename, folder = "myevents") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: path.parse(filename).name },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error("getEvents error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    console.error("getEvent error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createEvent = async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file && req.file.buffer && cloud.ready) {
      // upload to cloudinary
      const filename = req.file.originalname;
      const result = await uploadBufferToCloudinary(req.file.buffer, filename, "myevents");
      imageUrl = result.secure_url || result.url || "";
    } else if (req.file && req.file.buffer && !cloud.ready) {
      // fallback: save to uploads folder
      const uploadsDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
      const ext = path.extname(req.file.originalname);
      const filename = `${Date.now()}${ext}`;
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, req.file.buffer);
      imageUrl = `/uploads/${filename}`;
    } else if (req.body.image) {
      imageUrl = req.body.image; // accept a URL string
    }

    const newEvent = new Event({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      location: req.body.location,
      image: imageUrl,
      creator: req.user ? req.user._id : null,
      views: 0,
      rsvpCount: 0,
      attendees: []
    });

    const saved = await newEvent.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("createEvent error:", error);
    res.status(500).json({ message: "Failed to create event" });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.file && req.file.buffer && cloud.ready) {
      const filename = req.file.originalname;
      const result = await uploadBufferToCloudinary(req.file.buffer, filename, "myevents");
      update.image = result.secure_url || result.url || "";
    } else if (req.file && req.file.buffer && !cloud.ready) {
      // save locally
      const uploadsDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
      const ext = path.extname(req.file.originalname);
      const filename = `${Date.now()}${ext}`;
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, req.file.buffer);
      update.image = `/uploads/${filename}`;
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updatedEvent) return res.status(404).json({ message: "Event not found" });
    res.json(updatedEvent);
  } catch (error) {
    console.error("updateEvent error:", error);
    res.status(500).json({ message: "Failed to update event" });
  }
};
