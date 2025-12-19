// UserController.js
// Full controller file based on the user's provided code, cleaned up and consistent.
// Uses ES modules (import / export). Assumes User model exists at ../models/UserName.js
// and process.env.JWT_SECRET is set in your environment.

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/UserName.js";

/**
 * Helper - check DB connection
 * readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
 */
const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * List users (omit passwordHash)
 */
export const getUser = async (_req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ message: "Database service unavailable." });
    }

    const users = await User.find().select("-passwordHash");
    return res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ message: err.message || "Failed to fetch users." });
  }
};

/**
 * Create new user (signup)
 */
export const newUser = async (req, res) => {
  try {
    console.log("📝 New user signup request:", req.body);

    const {
      firstName,
      lastName,
      nid,
      username,
      email,
      phone,
      password,
      confirmPassword,
      firebaseUid,
      emailVerified,
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !(nid || req.body.nidNumber) || !username || !email || !(phone || req.body.phoneNumber) || !password) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
      console.log("❌ Passwords do not match");
      return res.status(400).json({ message: "Passwords do not match." });
    }

    if (!isDbConnected()) {
      console.log("⚠️ Database not connected - cannot store user data");
      return res.status(503).json({
        message: "Database service unavailable. Cannot create account. Please try again later.",
      });
    }

    // Normalize inputs
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = String(username).trim();

    // Check for existing user by email, username, or firebaseUid
    const existingUser = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { username: normalizedUsername },
        ...(firebaseUid ? [{ firebaseUid }] : []),
      ],
    });

    if (existingUser) {
      console.log("❌ User already exists:", {
        email: normalizedEmail,
        username: normalizedUsername,
        firebaseUid,
        existingId: existingUser._id,
      });

      if (existingUser.email === normalizedEmail) {
        return res.status(409).json({ message: "Email already in use." });
      }
      if (existingUser.username === normalizedUsername) {
        return res.status(409).json({ message: "Username already in use." });
      }
      if (firebaseUid && existingUser.firebaseUid === firebaseUid) {
        return res.status(409).json({ message: "Account already exists with this Firebase ID." });
      }

      return res.status(409).json({ message: "Email or username already in use." });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("✅ Password hashed successfully");

    // Prepare user document
    const userData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      nid: nid || req.body.nidNumber,
      username: normalizedUsername,
      email: normalizedEmail,
      phone: phone || req.body.phoneNumber,
      passwordHash,
      emailVerified: emailVerified === true || false, // default false unless explicitly true
      ...(firebaseUid && { firebaseUid }),
    };

    console.log("💾 Saving user to MongoDB...");
    const user = await User.create(userData);
    console.log("✅ User created successfully in MongoDB:", user._id);

    // Omit passwordHash from response
    const { passwordHash: _omit, ...safe } = user.toObject();
    return res.status(201).json(safe);
  } catch (err) {
    console.error("❌ Error creating user:", err);

    // Duplicate key error
    if (err && err.code === 11000) {
      const duplicateField = Object.keys(err.keyPattern || {})[0] || "field";
      return res.status(409).json({
        message: `${duplicateField} already in use.`,
      });
    }

    // Network / server issues
    if (err && (err.name === "MongoNetworkError" || err.name === "MongoServerSelectionError")) {
      return res.status(503).json({ message: "Database service unavailable. Please try again later." });
    }

    return res.status(500).json({ message: err.message || "Failed to create user." });
  }
};

/**
 * Login user (username or email)
 * Accepts: { username, password, emailVerified } where username can be email
 * If emailVerified:true is provided (from Firebase) it will update MongoDB.
 */
export const loginUser = async (req, res) => {
  try {
    const { username, password, emailVerified } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    // DB fallback for local testing if DB not connected
    if (!isDbConnected()) {
      console.log("Database not connected - using fallback login response");
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

    // Determine if input is email
    const isEmail = String(username).includes("@");
    const normalizedInput = isEmail ? String(username).toLowerCase().trim() : String(username).trim();

    console.log(`🔐 Login attempt for: ${normalizedInput} (original: ${username}, isEmail: ${isEmail})`);

    const user = await User.findOne(
      isEmail
        ? { email: normalizedInput }
        : {
            $or: [{ username: normalizedInput }, { email: normalizedInput }],
          }
    );

    if (!user) {
      console.log(`❌ User not found: ${normalizedInput}`);
      return res.status(401).json({ message: "Invalid credentials." });
    }

    console.log(`✅ User found: ${user.username} (ID: ${user._id})`);

    // Compare password
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      console.log(`❌ Password mismatch for user: ${user.username}`);
      return res.status(401).json({ message: "Invalid credentials." });
    }

    console.log(`✅ Password verified for user: ${user.username}`);

    // Sync emailVerified from Firebase if provided
    if (emailVerified !== undefined && emailVerified === true && user.emailVerified !== true) {
      console.log(`📧 Syncing emailVerified status to MongoDB for user: ${user.username}`);
      try {
        await User.findOneAndUpdate({ _id: user._id }, { emailVerified: true }, { new: true });
        user.emailVerified = true;
        console.log(`✅ Email verification status updated in MongoDB`);
      } catch (syncErr) {
        console.warn("⚠️ Failed to sync emailVerified to MongoDB:", syncErr);
        // don't fail the login just because sync failed
      }
    }

    // Sign JWT
    const secret = process.env.JWT_SECRET || "default_jwt_secret_change_me";
    const token = jwt.sign({ sub: user._id.toString(), username: user.username }, secret, {
      expiresIn: "7d",
    });

    const { passwordHash, ...safe } = user.toObject();
    console.log(`✅ Login successful for user: ${user.username}`);
    return res.json({ token, user: safe });
  } catch (err) {
    console.error("❌ Error during login:", err);
    if (err && (err.name === "MongoNetworkError" || err.name === "MongoServerSelectionError")) {
      return res.status(503).json({ message: "Database service unavailable. Please try again later." });
    }
    return res.status(500).json({ message: err.message || "Login failed." });
  }
};

/**
 * Change password (requires username, currentPassword, newPassword)
 */
export const changePassword = async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body;
    if (!username || !currentPassword || !newPassword) {
      return res.status(400).json({ message: "Username, current password, and new password are required." });
    }

    if (!isDbConnected()) {
      return res.status(503).json({ message: "Database service unavailable. Please try again later." });
    }

    const user = await User.findOne({ username: String(username).trim() });
    if (!user) return res.status(404).json({ message: "User not found." });

    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Current password is incorrect." });

    const same = await bcrypt.compare(newPassword, user.passwordHash);
    if (same) return res.status(400).json({ message: "New password must be different." });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("❌ Error changing password:", err);
    return res.status(500).json({ message: err.message || "Failed to change password." });
  }
};

/**
 * Get current user (protected route - expects req.userId set by auth middleware)
 */
export const me = async (req, res) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    if (!isDbConnected()) {
      return res.status(503).json({ message: "Database service unavailable. Please try again later." });
    }

    const user = await User.findById(req.userId).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(user);
  } catch (err) {
    console.error("❌ Error fetching current user:", err);
    return res.status(500).json({ message: err.message || "Failed to fetch user." });
  }
};

/**
 * Update emailVerified status in MongoDB using email (body: { email, emailVerified })
 */
export const updateEmailVerified = async (req, res) => {
  try {
    const { email, emailVerified } = req.body;

    if (!email || emailVerified === undefined) {
      return res.status(400).json({ message: "Email and emailVerified status are required." });
    }

    if (!isDbConnected()) {
      return res.status(503).json({ message: "Database service unavailable. Please try again later." });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log(`❌ User not found for email: ${normalizedEmail}`);
      return res.status(404).json({ message: "User not found." });
    }

    console.log(`🔄 Updating emailVerified for user: ${normalizedEmail} (ID: ${user._id}) to ${emailVerified}`);

    const updatedUser = await User.findOneAndUpdate(
      { email: normalizedEmail },
      { emailVerified: emailVerified === true },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      console.error(`❌ Failed to update emailVerified for user: ${normalizedEmail}`);
      return res.status(500).json({ message: "Failed to update email verification status. Please try again." });
    }

    console.log(`✅ Email verification status updated for user: ${normalizedEmail} (ID: ${updatedUser._id}) to ${updatedUser.emailVerified}`);
    return res.json({
      message: "Email verification status updated successfully.",
      emailVerified: updatedUser.emailVerified,
    });
  } catch (err) {
    console.error("❌ Error updating email verification status:", err);

    if (err && err.name === "ValidationError") {
      return res.status(400).json({ message: `Validation error: ${err.message}` });
    }

    return res.status(500).json({ message: err.message || "An error occurred while updating email verification status." });
  }
};

/**
 * Reset password (by email) - expects { email, newPassword, firebaseVerified? }
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, firebaseVerified } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required." });
    }

    if (!isDbConnected()) {
      return res.status(503).json({ message: "Database service unavailable. Please try again later." });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log(`❌ User not found for email: ${normalizedEmail}`);
      return res.status(404).json({ message: "User not found." });
    }

    console.log(`🔄 Resetting password for user: ${normalizedEmail} (ID: ${user._id})`);
    if (firebaseVerified) {
      console.log(`📧 Firebase password reset verified - syncing to MongoDB...`);
    }

    // Hash and save
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    console.log(`✅ Password hashed successfully`);
    await user.save();
    console.log(`✅ Password saved to MongoDB successfully`);

    // Verify hash by comparing
    const verifyHash = await bcrypt.compare(newPassword, user.passwordHash);
    if (!verifyHash) {
      console.error(`❌ Password verification failed after MongoDB update for user: ${normalizedEmail}`);
      return res.status(500).json({ message: "Password update verification failed. Please try again." });
    }

    console.log(`✅ Password reset successfully in MongoDB for user: ${normalizedEmail} (ID: ${user._id})`);
    if (firebaseVerified) {
      console.log(`✅ Password synchronized: Firebase ✅ | MongoDB ✅`);
    }

    return res.json({ message: "Password reset successfully. You can now login with your new password." });
  } catch (err) {
    console.error("❌ Error resetting password:", err);

    if (err && err.name === "ValidationError") {
      return res.status(400).json({ message: `Validation error: ${err.message}` });
    }

    if (err && err.code === 11000) {
      return res.status(409).json({ message: "A user with this email already exists." });
    }

    return res.status(500).json({ message: err.message || "An error occurred while resetting your password." });
  }
};

/**
 * Delete account (protected route; req.userId expected)
 * Expects { password, reason? } in body
 */
export const deleteUserAccount = async (req, res) => {
  try {
    const { password, reason } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password is required to delete account." });
    }
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    if (!isDbConnected()) {
      return res.status(503).json({ message: "Database service unavailable. Please try again later." });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Password is incorrect." });

    if (reason) {
      console.log(`Account deletion requested for user ${user.username} (${user.email}). Reason: ${reason}`);
    }

    await User.findByIdAndDelete(req.userId);

    console.log(`Account deleted for user ${user.username} (${user.email})`);

    return res.json({ message: "Account deleted successfully." });
  } catch (err) {
    console.error("Error deleting account:", err);
    return res.status(500).json({ message: err.message || "Failed to delete account." });
  }
};
