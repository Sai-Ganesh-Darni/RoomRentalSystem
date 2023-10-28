const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  room_type: { type: String, require: true },
  building_type: { type: String, require: true },
  utilities_included: String,
  pets_allowed: String,
  rent: Number,
  village: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  zip: { type: Number },
  country: { type: String, trim: true },
  description: String,
  first_date_available: Date,
  email: { type: String, required: true },
  phone: { type: Number, minlength: 10, required: true },
  images: [String],
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Room", roomSchema);
