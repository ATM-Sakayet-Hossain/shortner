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
      return res.status(400).send("Name are required");
    }
    if (!isValidUsername(userName)) {
      return res.status(400).json({
        message:
          "Username must be 3-16 characters long and can only contain letters, numbers, and underscores.",
      });
    }
    // const existingUserName = await userSchema.findOne({ userName });
    // if (existingUserName) return res.status(400).send("User Name already exists");

    if (!email) {
      return res.status(400).send("Email are required");
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    const existingUser = await userSchema.findOne({ email, userName });
    if (existingUser) return res.status(400).send("Email already exists");
    if (!password) {
      return res.status(400).send("Password are required");
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }
    const userData = new userSchema({
      userName,
      email,
      password,
    });
    userData.save();
    res.status(201).json({ message: "User registation successful" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send("Duplicate User Name");
    }
    res.status(500).send("Server error");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      return res.status(400).send("Email are required");
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    if (!password) {
      return res.status(400).send("Password are required");
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }
    const userData = await userSchema.findOne({ email });
    if (!userData) return res.status(400).send("User does not exist");
    const match = await userData.comparePassword(password);
    if (!match) return res.status(401).send("Unauthorized user");
    const token = generateAccTkn({ id: userData._id, email: userData.email });
    res.cookie("acc_token", token);
    res.status(200).json({ message: "User login successful" });
  } catch (error) {
    res.status(500).send("Server error");
    console.log(error);
  }
};

module.exports = { registration, login };
