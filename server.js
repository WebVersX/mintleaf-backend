
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, "public")));

let bookings = [];

// Book table
app.post("/api/book-table", (req, res) => {
  const { name, phone, date, time, guests } = req.body;

  if (!name || !phone || !date || !time || !guests) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  const booking = {
    id: bookings.length + 1,
    name,
    phone,
    date,
    time,
    guests,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  bookings.push(booking);

  res.json({
    success: true,
    message: "Table booked successfully!",
    booking
  });
});

// Get all bookings (for admin)
app.get("/api/bookings", (req, res) => {
  res.json(bookings);
});

// Update booking status
app.patch("/api/bookings/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body;

  const booking = bookings.find(b => b.id === id);
  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found" });
  }

  if (!["pending", "confirmed", "rejected"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  booking.status = status;
  res.json({ success: true, booking });
});

// Fallback to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
