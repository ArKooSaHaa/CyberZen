// server/routes/routes.js
import express from "express";
import { getUser, newUser, loginUser, changePassword, me, deleteUserAccount } from "../controller/UserController.js";
import auth from "../middleware/auth.js"; // if you created it
import { createReport } from "../controller/reportController.js"; // Import the createReport controller
import upload from "../middleware/upload.js"; // Import the Multer upload middleware
import { router as reportRoutes } from './reportRoutes.js'; // Import reportRoutes for status update

const router = express.Router();

// User routes
router.get("/users", getUser);
router.post("/users/signup", newUser);
router.post("/users/login", loginUser);
router.post("/users/change-password", changePassword); // removed auth middleware
router.get("/users/me", auth, me);
router.delete("/users/delete-account", auth, deleteUserAccount);

// Report routes
router.post("/reports", upload, createReport); // Handle report submission with image upload
router.use("/reports", reportRoutes); // Use the reportRoutes for fetching and updating report status

export { router };
