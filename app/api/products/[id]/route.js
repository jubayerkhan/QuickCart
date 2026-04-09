import dbConnect from "@/config/db";
import Product from "@/models/Product";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(req, { params }) {
  try {
    const { sessionClaims } = await auth();
    const role = sessionClaims?.publicMetadata?.role;

    if (role !== "seller" && role !== "admin") {
      return new Response("Unauthorized", { status: 403 });
    }

    await dbConnect();

    await Product.findByIdAndDelete(params.id);

    return Response.json({ success: true });

  } catch (error) {
    return new Response("Error", { status: 500 });
  }
}