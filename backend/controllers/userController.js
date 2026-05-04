const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  // process.env.JWT_SECRET ke aage humne backup string laga di hai
  return jwt.sign({ id }, process.env.JWT_SECRET || "mybackupsecretkey", { expiresIn: "30d" });
};
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check duplicate email
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already registered. Please login." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword, role: role || "user" });

    res.status(201).json({ _id: user.id, name: user.name, role: user.role, token: generateToken(user._id) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({ _id: user.id, name: user.name, role: user.role, token: generateToken(user._id) });
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};