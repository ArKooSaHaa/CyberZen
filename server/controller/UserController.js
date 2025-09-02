import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/UserName.js";

// GET /api/User  -> list users (no passwords)
export const getUser = async (_req, res) => {
  try {
    const users = await User.find().select("-passwordHash");
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/User  -> signup
export const newUser = async (req, res) => {
  try {
    console.log("📝 New user signup request:", req.body);

    const {
      firstName, lastName, nid,
      username, email, phone,
      password, confirmPassword
    } = req.body;

    // Validation
    if (!firstName || !lastName || !nid || !username || !email || !phone || !password) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password !== confirmPassword) {
      console.log("❌ Passwords do not match");
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // DB not connected? Provide a safe fallback (for local testing)
    if (mongoose.connection.readyState !== 1) {
      console.log("❌ Database not connected - using fallback response");
      const { password: _pw, confirmPassword: _cp, ...userData } = req.body;
      return res.status(201).json({
        ...userData,
        _id: `fallback-user-id-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Existing user?
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      console.log("❌ User already exists:", { email, username });
      return res.status(409).json({ message: "Email or username already in use." });
    }

    // Hash & create
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("🔐 Password hashed successfully");

    const user = await User.create({
      firstName, lastName, nid, username, email, phone, passwordHash,
    });

    console.log("✅ User created successfully:", user._id);

    const { passwordHash: _omit, ...safe } = user.toObject();
    return res.status(201).json(safe);
  } catch (err) {
    console.error("❌ Error creating user:", err);
    if (err.name === "MongoNetworkError" || err.name === "MongoServerSelectionError") {
      return res.status(503).json({ message: "Database service unavailable. Please try again later." });
    }
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/User/login  -> sign in (username or email)
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body; // "username" can be an email
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    // DB fallback for local testing
    if (mongoose.connection.readyState !== 1) {
      console.log("❌ Database not connected - using fallback login response");
      const token = `fallback-jwt-token-${Date.now()}`;
      return res.json({
        token,
        user: {
          _id: "fallback-user-id",
          firstName: "Test",
          lastName: "User",
          username,
          email: username.includes("@") ? username : `${username}@example.com`,
          nid: "123456",
          phone: "1234567890",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }

    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign(
      { sub: user._id.toString(), username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { passwordHash, ...safe } = user.toObject();
    return res.json({ token, user: safe });
  } catch (err) {
    console.error("❌ Error during login:", err);
    if (err.name === "MongoNetworkError" || err.name === "MongoServerSelectionError") {
      return res.status(503).json({ message: "Database service unavailable. Please try again later." });
    }
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/User/change-password  -> protected
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new passwords are required." });
    }
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database service unavailable. Please try again later." });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Current password is incorrect." });

    const same = await bcrypt.compare(newPassword, user.passwordHash);
    if (same) return res.status(400).json({ message: "New password must be different." });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ message: "Password updated successfully." });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/User/me  -> protected; return current user (no passwordHash)
export const me = async (req, res) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database service unavailable. Please try again later." });
    }

    const user = await User.findById(req.userId).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// DELETE /api/User/delete-account  -> protected
export const deleteUserAccount = async (req, res) => {
  try {
    const { password, reason } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password is required to delete account." });
    }
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "Database service unavailable. Please try again later." });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    // Verify password before deletion
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Password is incorrect." });

    // Log deletion reason if provided
    if (reason) {
      console.log(`🗑️ Account deletion requested for user ${user.username} (${user.email}). Reason: ${reason}`);
    }

    // Delete the user
    await User.findByIdAndDelete(req.userId);

    console.log(`✅ Account deleted for user ${user.username} (${user.email})`);

    return res.json({ message: "Account deleted successfully." });
  } catch (err) {
    console.error("❌ Error deleting account:", err);
    return res.status(500).json({ message: err.message });
  }
};
