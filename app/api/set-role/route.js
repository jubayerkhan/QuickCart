import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req) {
  const { userId, role } = await req.json();

  await clerkClient.users.updateUser(userId, {
    publicMetadata: {
      role: role, // "admin" | "seller" | "user"
    },
  });

  return Response.json({ message: "Role updated" });
}