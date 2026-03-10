const userSchema = require("../models/userSchema");
const { generateAccTkn } = require("../utils/token");
const {
  isValidEmail,
  isValidUsername,
  isStrongPassword,
} = require("../utils/validation");

const registration = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    if (!userName) {
      return res.status(400).json({ message: "Name are required" });
    }

    if (!isValidUsername(userName)) {
      return res.status(400).json({
        message:
          "Username must be 3-16 characters long and can only contain letters, numbers, and underscores.",
      });
    }
    if (!email) {
      return res.status(400).json({ message: "Email are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    if (!password) {
      return res.status(400).json({ message: "Password are required" });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }
    const existingUser = await userSchema.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });
    const userData = new userSchema({
      userName,
      email,
      password,
    });
    userData.save();
    res.status(201).json({ message: "User registation successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: "Email are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    if (!password) {
      return res.status(400).json({ message: "Password are required" });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }
    const userData = await userSchema.findOne({ email });
    if (!userData)
      return res.status(400).json({ message: "User does not exist" });
    const match = await userData.comparePassword(password);
    if (!match) return res.status(401).json({ message: "Unauthorized user" });
    const token = generateAccTkn({ id: userData._id, email: userData.email });
    res.cookie("acc_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: "User login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
const logout = (req, res) => {
  res.cookie("acc_token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logout successful" });
};
const getProfile = async (req, res) => {
  try {
    const user = req.user;
    const userData = await userSchema.findById(user.id);
    if (!userData)
      return res.status(404).json({ message: "User Profile Not Found" });
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: "internal Server Error" });
  }
};

module.exports = { registration, login, logout, getProfile };
