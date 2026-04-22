"use client";
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import parcel_icon from "@/assets/parcel_icon.svg";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";

const ProductList = () => {
  const { router } = useAppContext();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchSellerProduct = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products?page=${page}&limit=${limit}`);
      const data = await res.json();

      setProducts(data.products);
      setTotalPages(data.totalPages);
      setTotal(data.total);
      setCurrentPage(page);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Delete failed ❌");
        return;
      }

      // if last item on page, go to previous page
      const newTotal = total - 1;
      const maxPage = Math.ceil(newTotal / limit);
      const targetPage = currentPage > maxPage ? maxPage : currentPage;

      fetchSellerProduct(targetPage || 1);
      alert("Deleted successfully ✅");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSellerProduct(1);
  }, []);

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full md:p-10 p-4">
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-lg font-medium">
              All Products{" "}
              <span className="text-gray-400 font-normal text-sm">
                ({total})
              </span>
            </h2>
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>
          </div>

          <div className="flex flex-col items-center max-w-full w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className="table-fixed w-full overflow-hidden">
              <thead className="text-gray-900 text-sm text-left">
                <tr>
                  <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">Product</th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">Category</th>
                  <th className="px-4 py-3 font-medium truncate">Price</th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">Action</th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">Edit</th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">Delete</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {products.map((product, index) => (
                  <tr key={index} className="border-t border-gray-500/20">
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <div className="bg-gray-500/10 rounded p-2">
                        <Image
                          src={product.images[0]?.url || parcel_icon}
                          alt="product Image"
                          className="w-16"
                          width={1280}
                          height={720}
                        />
                      </div>
                      <span className="truncate w-full">{product.name}</span>
                    </td>
                    <td className="px-4 py-3 max-sm:hidden">{product.category}</td>
                    <td className="px-4 py-3">${product.offerPrice}</td>
                    <td className="px-4 py-3 max-sm:hidden">
                      <button
                        onClick={() => router.push(`/product/${product._id}`)}
                        className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-orange-600 text-white rounded-md"
                      >
                        <span className="hidden md:block">Visit</span>
                        <Image className="h-3.5" src={assets.redirect_icon} alt="redirect_icon" />
                      </button>
                    </td>
                    <td className="px-4 py-3 max-sm:hidden">
                      <button
                        onClick={() => router.push(`/seller/edit/${product._id}`)}
                        className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-orange-600 text-white rounded-md"
                      >
                        <span className="hidden md:block">Edit</span>
                        <Image className="h-3.5" src={assets.redirect_icon} alt="redirect_icon" />
                      </button>
                    </td>
                    <td className="px-4 py-3 max-sm:hidden">
                      <button
                        className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-orange-600 text-white rounded-md"
                        onClick={() => handleDelete(product._id)}
                      >
                        <span className="hidden md:block">Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => fetchSellerProduct(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => fetchSellerProduct(page)}
                  className={`px-3 py-1.5 text-sm border rounded-md ${
                    currentPage === page
                      ? "bg-orange-600 text-white border-orange-600"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => fetchSellerProduct(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductList;