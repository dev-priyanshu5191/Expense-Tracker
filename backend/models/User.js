const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Duplicate email roki jayegi
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" }, // Admin or User
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);