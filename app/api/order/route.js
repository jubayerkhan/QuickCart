import dbConnect from "@/config/db";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { auth } from "@clerk/nextjs/server";

// Customer: Place order
export async function POST(req) {
  try {
    await dbConnect();
    const { userId } = await auth();
    if (!userId) return Response.json({ success: false, message: "Unauthorized" });

    const { addressId, paymentMethod = "COD" } = await req.json();

    // Get cart
    const cart = await Cart.findOne({ clerkUserId: userId });
    if (!cart || cart.items.length === 0)
      return Response.json({ success: false, message: "Cart is empty" });

    // Get address
    const Address = (await import("@/models/Address")).default;
    const address = await Address.findOne({ _id: addressId, clerkUserId: userId });
    if (!address)
      return Response.json({ success: false, message: "Address not found" });

    // Build order items with current prices
    let totalAmount = 0;
    const orderItems = [];

    for (const cartItem of cart.items) {
      const product = await Product.findById(cartItem.productId);
      if (!product) continue;
      orderItems.push({
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        price: product.offerPrice,
      });
      totalAmount += product.offerPrice * cartItem.quantity;
    }

    // Add tax
    const tax = Math.floor(totalAmount * 0.02);
    totalAmount = totalAmount + tax;

    const order = await Order.create({
      clerkUserId: userId,
      items: orderItems,
      address: {
        fullName: address.fullName,
        area: address.area,
        city: address.city,
        state: address.state,
        phone: address.phone,
        pincode: address.pincode,
      },
      totalAmount,
      paymentMethod,
    });

    // Clear cart after order
    await Cart.findOneAndUpdate(
      { clerkUserId: userId },
      { items: [] }
    );

    return Response.json({ success: true, order });
  } catch (error) {
    return Response.json({ success: false, message: error.message });
  }
}

// Customer: Get their orders
export async function GET() {
  try {
    await dbConnect();
    const { userId } = await auth();
    if (!userId) return Response.json({ success: false, message: "Unauthorized" });

    const orders = await Order.find({ clerkUserId: userId }).sort({ createdAt: -1 });
    return Response.json({ success: true, orders });
  } catch (error) {
    return Response.json({ success: false, message: error.message });
  }
}