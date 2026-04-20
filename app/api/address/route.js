// app/api/address/route.js
import dbConnect from "@/config/db";
import Address from "@/models/Address";
import { auth } from "@clerk/nextjs/server";

// ✅ GET → get all addresses for user
export async function GET() {
  try {
    await dbConnect();
    const { userId } = await auth();

    const addresses = await Address.find({ clerkUserId: userId });

    return Response.json({ success: true, addresses });
  } catch (error) {
    return Response.json({ success: false, message: error.message });
  }
}

// ✅ POST → save new address
export async function POST(req) {
  try {
    await dbConnect();
    const { userId } = await auth();

    const body = await req.json();

    const newAddress = await Address.create({
      clerkUserId: userId,
      ...body,
    });

    return Response.json({ success: true, address: newAddress });
  } catch (error) {
    return Response.json({ success: false, message: error.message });
  }
}

// ✅ PUT → update existing address
export async function PUT(req) {
  try {
    await dbConnect();
    const { userId } = await auth();
    const body = await req.json();

    const updatedAddress = await Address.findOneAndUpdate(
      { clerkUserId: userId, _id: body._id },
      { ...body },
      { new: true },
    );

    return Response.json({ success: true, address: updatedAddress });
  } catch (error) {
    return Response.json({ success: false, message: error.message });
  }
}

// ✅ DELETE → delete an address
export async function DELETE(req) {
  try {
    await dbConnect();
    const { userId } = await auth();
    const { _id } = await req.json();

    await Address.findOneAndDelete({ clerkUserId: userId, _id });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, message: error.message });
  }
}
