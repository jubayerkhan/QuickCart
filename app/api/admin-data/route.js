import { auth } from "@clerk/nextjs/server";

export async function GET(req) {
  const { sessionClaims } = await auth();

  const role = sessionClaims?.publicMetadata?.role;

  if (role !== "admin") {
    return new Response("Unauthorized", { status: 403 });
  }

  return Response.json({
    message: "This is protected admin data",
  });
}