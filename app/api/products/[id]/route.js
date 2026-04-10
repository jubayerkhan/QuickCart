import dbConnect from "@/config/db";
import Product from "@/models/Product";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";

// config cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    const product = await Product.findById(id);

    if (!product) {
      return Response.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, product });

  } catch (error) {
    console.log("GET BY ID ERROR:", error);

    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { sessionClaims } = await auth();
    const role = sessionClaims?.publicMetadata?.role;

    if (role !== "seller" && role !== "admin") {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 403 },
      );
    }

    await dbConnect();

    // FIX HERE
    const { id } = await params;

    const product = await Product.findById(id);

    if (!product) {
      return Response.json(
        { success: false, message: "Product not found" },
        { status: 404 },
      );
    }

    // delete images from Cloudinary
    for (const img of product.images) {
      if (typeof img === "string") continue;

      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await Product.findByIdAndDelete(id);

    return Response.json({ success: true });
  } catch (error) {
    console.log("DELETE ERROR:", error);

    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
