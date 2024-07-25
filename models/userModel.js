import { Schema, model } from "mongoose";
import crypto from "crypto";

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ["user", "admin", "staff"],
    required: true,
  },
  secretKey: {
    type: String,
    default: function () {
      return crypto.randomBytes(16).toString("hex");
    },
  },
});

const User = model("User", userSchema);

export default User;
