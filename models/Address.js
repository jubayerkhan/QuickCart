// models/Address.js
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    clerkUserId: { type: String, required: true },

    fullName: String,
    phoneNumber: String,
    pincode: String,
    area: String,
    city: String,
    state: String,
  },
  { timestamps: true }
);

export default mongoose.models.Address || mongoose.model("Address", addressSchema);