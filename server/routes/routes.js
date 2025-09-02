// server/routes/routes.js
import express from "express";
import { getUser, newUser, loginUser, changePassword, me, deleteUserAccount } from "../controller/UserController.js";
import auth from "../middleware/auth.js"; // if you created it

const router = express.Router();

router.get("/", getUser);
router.post("/", newUser);
router.post("/login", loginUser);
router.post("/change-password", auth, changePassword); // protect with auth
router.get("/me", auth, me); // ← NEW
router.delete("/delete-account", auth, deleteUserAccount); // ← NEW


export { router };
