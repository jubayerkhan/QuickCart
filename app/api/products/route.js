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

export async function POST(req) {
  try {
    const { sessionClaims } = await auth();
    const role = sessionClaims?.publicMetadata?.role;

    if (role !== "seller" && role !== "admin") {
      return Response.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const formData = await req.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const category = formData.get("category");
    const price = formData.get("price");
    const offerPrice = formData.get("offerPrice");

    const files = formData.getAll("images");

    const imageUrls = [];

    for (const file of files) {
      if (!file || file.size === 0) continue; // ✅ important fix

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({}, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }).end(buffer);
      });

      imageUrls.push({
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      });
    }

    const product = await Product.create({
      name,
      description,
      category,
      price: Number(price),
      offerPrice: Number(offerPrice),
      images: imageUrls,
    });

    return Response.json({ success: true, product });

  } catch (error) {
    console.log("POST ERROR:", error);

    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();

    const products = await Product.find().sort({ createdAt: -1 });

    return Response.json({ success: true, products });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
