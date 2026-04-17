import dbConnect from "@/config/db";
import User from "@/models/User";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST() {
  try {
    await dbConnect();

    const { userId } = await auth();

    if (!userId) {
      return Response.json({ success: false }, { status: 401 });
    }

    // get full user data
    const user = await currentUser();

    const email = user?.emailAddresses?.[0]?.emailAddress || "";
    const name =
      user?.firstName || user?.lastName
        ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
        : "User";

    const role = user?.publicMetadata?.role || "user";
    let existingUser = await User.findOne({ clerkUserId: userId });

    if (!existingUser) {
      existingUser = await User.create({
        clerkUserId: userId,
        email,
        name,
        role,
      });
    } else {
      // update existing user
      existingUser.email = email;
      existingUser.name = name;
      existingUser.role = role;
      await existingUser.save();
    }
    console.log("Clerk role:", user?.publicMetadata?.role);
    return Response.json({ success: true, user: existingUser });
  } catch (error) {
    return Response.json({ success: false, message: error.message });
  }
}
