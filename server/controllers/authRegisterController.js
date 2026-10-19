
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({
        message: "Name, username, email and password are required",
      });
    }

    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[a-z0-9_]{3,30}$/.test(normalizedUsername)) {
      return res.status(400).json({
        message:
          "Username must be 3–30 characters and contain only letters, numbers and underscores",
      });
    }

    const existingUser = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { username: normalizedUsername },
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        message:
          existingUser.email === normalizedEmail
            ? "Email already registered"
            : "Username already taken",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
      },
    });
  } catch (error) {
    // Handle duplicate-key errors, including concurrent registrations.
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email or username already exists",
      });
    }

    console.error("Registration error:", error.message);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = { registerUser };
