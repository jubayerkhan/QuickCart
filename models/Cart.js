import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    clerkUserId: {type: String, required: true},
    items: [
        {
        productId: String,
        quantity: Number,
    },],
}, {timestamps: true});

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);