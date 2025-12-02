const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// middlewares
app.use(cors());
app.use(bodyParser.json());

// (optional) static serve if you keep public folder later
app.use(express.static(path.join(__dirname, "public")));

let bookings = [];

// ✅ Book table
app.post("/api/book-table", (req, res) => {
  const { name, phone, date, time, guests } = req.body;

  if (!name || !phone || !date || !time || !guests) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  const booking = {
    id: bookings.length + 1,
    name,
    phone,
    date,
    time,
    guests,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  bookings.push(booking);

  res.json({
    success: true,
    message: "Table booked successfully!",
    booking,
  });
});

// ✅ Get all bookings (for admin)
app.get("/api/bookings", (req, res) => {
  res.json(bookings);
});

// ✅ Update booking status via PATCH (id in URL)
app.patch("/api/bookings/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body;

  const booking = bookings.find((b) => b.id === id);
  if (!booking) {
    return res
      .status(404)
      .json({ success: false, message: "Booking not found" });
  }

  if (!["pending", "confirmed", "rejected"].includes(status)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid status" });
  }

  booking.status = status;

  res.json({ success: true, message: "Status updated", booking });
});

// ✅ Extra: Update status via POST /api/update-status (id in body)
// (frontend agar kabhi ye route use kare tab bhi chale)
app.post("/api/update-status", (req, res) => {
  const { id, status } = req.body;

  const booking = bookings.find((b) => b.id === id);
  if (!booking) {
    return res
      .status(404)
      .json({ success: false, message: "Booking not found" });
  }

  if (!["pending", "confirmed", "rejected"].includes(status)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid status" });
  }

  booking.status = status;
  res.json({ success: true, message: "Status updated", booking });
});

// ✅ PORT for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
