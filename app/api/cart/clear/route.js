import dbConnect from "@/config/db";
import Cart from "@/models/Cart";
import { auth } from "@clerk/nextjs/server";

export async function DELETE() {
  try {
    await dbConnect();

    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await Cart.findOneAndUpdate(
      { clerkUserId: userId },
      { items: [] }
    );

    return Response.json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: error.message,
    });
  }
}