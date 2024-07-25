import { Schema, model } from "mongoose";
import crypto from "crypto";
import base32 from "hi-base32";

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
      const bytes = crypto.randomBytes(16);
      // Convert bytes to Base32
      return base32.encode(bytes).toUpperCase();
    },
  },
});

const User = model("User", userSchema);

export default User;
