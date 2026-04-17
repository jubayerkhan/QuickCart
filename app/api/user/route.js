import dbConnect from "@/config/db";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    await dbConnect();

    const { userId, sesstionClaims } = await auth();

    if (!userId) {
      return Response.json({ success: false }, { status: 401 });
    }
    const email = sesstionClaims?.email;
    const name = sesstionClaims?.name || "User";

    let user = await User.findOne({ clerkUserId: userId });

    if (!user) {
      user = await User.create({
        clerkUserId: userId,
        email,
        name,
      });
    }
    return Response.json({ success: true, user });
  } catch (error) {
    return Response.json({ success: false, message: error.message });
  }
}
