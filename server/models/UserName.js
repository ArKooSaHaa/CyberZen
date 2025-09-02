import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName:   { type: String, required: true, trim: true },
    lastName:    { type: String, required: true, trim: true },
    nid:         { type: String, required: true, trim: true },
    username:    { type: String, required: true, unique: true, trim: true },
    email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone:       { type: String, required: true, trim: true },
    passwordHash:{ type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
