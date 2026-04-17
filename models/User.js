import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkUserId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // role: { type: String, enum: ["buyer", "seller"], default: "buyer" },
  },
  { timestamps: true
  }
);

export default mongoose.model.User || mongoose.model("User", userSchema);