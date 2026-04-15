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
        { status: 404 },
      );
    }

    return Response.json({ success: true, product });
  } catch (error) {
    console.log("GET BY ID ERROR:", error);

    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(req, { params }) {
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

    const { id } = await params;

    // formData is a web API, not supported in Node by default
    const formData = await req.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const category = formData.get("category");
    const price = formData.get("price");
    const offerPrice = formData.get("offerPrice");

    const files = formData.getAll("images");

    // 1. Find old product
    const product = await Product.findById(id);

    if (!product) {
      return Response.json(
        { success: false, message: "Product not found" },
        { status: 404 },
      );
    }

    let imageUrls = product.images;

    // 2. If new images uploaded → replace old ones
    if (files.length > 0 && files[0].size > 0) {
      // delete old images
      for (const img of product.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }

      // upload new images
      imageUrls = [];

      for (const file of files) {
        if (!file || typeof file === "string" || !file.arrayBuffer) continue;
        
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({}, (err, result) => {
              if (err) reject(err);
              else resolve(result);
            })
            .end(buffer);
        });

        imageUrls.push({
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        });
      }
    }

    // 3. Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        category,
        price: Number(price),
        offerPrice: Number(offerPrice),
        images: imageUrls,
      },
      { new: true },
    );

    return Response.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.log("UPDATE ERROR:", error);

    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
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
