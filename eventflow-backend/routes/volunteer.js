const express = require("express");
const User = require("../models/User");
const Attendance = require("../models/Attendance");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/pending", protect, adminOnly, async (req, res) => {
  try {
    const volunteers = await User.find({ role: "volunteer" }).select("-password");
    res.status(200).json(volunteers);
  } catch (_err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/approve/:userId", protect, adminOnly, async (req, res) => {
  try {
    const { assignedEvent } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.approved = true;
    user.assignedEvent = assignedEvent;
    await user.save();
    res.status(200).json({ message: `${user.fullName} approved and assigned to ${assignedEvent}` });
  } catch (_err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (_err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/mark-attendance", protect, async (req, res) => {
  try {
    const { attendeeName, attendeeEmail, eventName } = req.body;
    if (!attendeeName || !attendeeEmail || !eventName) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existing = await Attendance.findOne({ attendeeEmail, eventName });
    if (existing) {
      return res.status(400).json({ message: "Attendance already marked for this attendee" });
    }
    const record = await Attendance.create({
      attendeeName, attendeeEmail, eventName,
      markedBy: req.user.fullName,
    });
    res.status(201).json({ message: "Attendance marked successfully", record });
  } catch (_err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/attendance/all", protect, adminOnly, async (req, res) => {
  try {
    const all = await Attendance.find().sort({ markedAt: -1 });
    res.status(200).json(all);
  } catch (_err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/attendance/:eventName", protect, async (req, res) => {
  try {
    const records = await Attendance.find({ eventName: req.params.eventName });
    res.status(200).json(records);
  } catch (_err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;