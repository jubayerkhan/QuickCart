"use client";

import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

const AllProducts = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ get page from URL
  const currentPage = Number(searchParams.get("page")) || 1;

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        `/api/products?page=${currentPage}&limit=${limit}`
      );

      const data = await res.json();

      if (data.success) {
        setProducts(data.products);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  // ✅ update URL
  const changePage = (newPage) => {
    router.push(`/all-products?page=${newPage}`);
  };

  return (
    <>
      <Navbar />

      <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
        <div className="flex flex-col items-end pt-12">
          <p className="text-2xl font-medium">All products</p>
          <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-12 pb-14 w-full">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10 mx-auto mb-10">
            <button
              disabled={currentPage === 1}
              onClick={() => changePage(currentPage - 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => changePage(i + 1)}
                className={`px-4 py-2 border rounded ${
                  currentPage === i + 1
                    ? "bg-orange-500 text-white"
                    : ""
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => changePage(currentPage + 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default AllProducts;