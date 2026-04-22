import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true },
  items: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  address: {
    fullName: String,
    area: String,
    city: String,
    state: String,
    phone: String,
    pincode: String,
  },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  paymentMethod: { type: String, default: "COD" },
  isPaid: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", orderSchema);