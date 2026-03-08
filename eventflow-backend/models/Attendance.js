const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  attendeeName: { type: String, required: true },
  attendeeEmail: { type: String, required: true },
  eventName: { type: String, required: true },
  markedBy: { type: String, required: true },
  markedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Attendance", attendanceSchema);