import dbConnect from "@/config/db";
import Cart from "@/models/Cart";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    await dbConnect();
    const { userId } = await auth();

    const cart = await Cart.findOne({ clerkUserId: userId });

    return Response.json({ success: true, cart: cart || { items: [] } });
  } catch (error) {
    return Response.json({ success: false, message: error.message });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const { userId } = await auth();
    const { productId } = await req.json();
    let cart = await Cart.findOne({ clerkUserId: userId });

    if (!cart) {
      cart = await Cart.create({
        clerkUserId: userId,
        items: [{ productId, quantity: 1 }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId === productId,
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1 });
      }

      await cart.save();
    }
    return Response.json({ success: true, cart });
  } catch (error) {
    return Response.json({ success: false, message: error.message });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const { userId } = await auth();
    const { productId, quantity } = await req.json();

    const cart = await Cart.findOne({ clerkUserId: userId });

    if (!cart) return Response.json({ success: false });

    cart.items = cart.items.map((item) =>
      item.productId === productId ? { ...item.toObject(), quantity } : item,
    );

    cart.items = cart.items.filter((item) => item.quantity > 0);

    await cart.save();

    return Response.json({ success: true, cart });
  } catch (error) {
    return Response.json({ success: false, message: error.message });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const { userId } = await auth();
    const { productId } = await req.json();

    const cart = await Cart.findOne({ clerkUserId: userId });

    if (!cart) return Response.json({ success: false });

    cart.items = cart.items.filter((item) => item.productId !== productId);

    await cart.save();

    return Response.json({ success: true, cart });
  } catch (error) {
    return Response.json({ success: false, message: error.message });
  }
}
