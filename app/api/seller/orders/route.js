import dbConnect from "@/config/db";
import Order from "@/models/Order";
import { auth } from "@clerk/nextjs/server";
import Product from "@/models/Product";

// Seller: Get ALL orders
export async function GET() {
  try {
    await dbConnect();
    const { userId } = await auth();
    if (!userId)
      return Response.json({ success: false, message: "Unauthorized" });

    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();

    const enriched = await Promise.all(
      orders.map(async (order) => {
        const items = await Promise.all(
          order.items.map(async (item) => {
            const product = await Product.findById(item.productId)
              .select("name images")
              .lean();
            return { ...item, product };
          }),
        );
        return { ...order, items };
      }),
    );

    return Response.json({ success: true, orders: enriched });
  } catch (error) {
    return Response.json({ success: false, message: error.message });
  }
}

// Seller: Update order status
export async function PUT(req) {
  try {
    await dbConnect();

    const { orderId, status } = await req.json();

    // ✅ update object
    const updateData = {
      status,
    };

    // ✅ payment auto change
    if (status === "delivered") {
      updateData.isPaid = true;
    } else {
      updateData.isPaid = false;
    }

    // ✅ update order
    const order = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
    });

    return Response.json({
      success: true,
      order,
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: error.message,
    });
  }
}

// delete order
export async function DELETE(req) {
  try {
    await dbConnect();
    const { orderId } = await req.json();

    await Order.findByIdAndDelete(orderId);

    return Response.json({
      success: true,
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: error.message,
    });
  }
}
