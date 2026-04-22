'use client';
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  pending:   "bg-yellow-100 text-yellow-700 border-yellow-300",
  confirmed: "bg-blue-100 text-blue-700 border-blue-300",
  shipped:   "bg-purple-100 text-purple-700 border-purple-300",
  delivered: "bg-green-100 text-green-700 border-green-300",
  cancelled: "bg-red-100 text-red-700 border-red-300",
};

const Orders = () => {
  const { currency } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerOrders = async () => {
    try {
      const res = await fetch("/api/seller/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const res = await fetch("/api/seller/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Status updated");
        // update locally without refetching
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status } : order
          )
        );
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      {loading ? (
        <Loading />
      ) : (
        <div className="md:p-10 p-4 space-y-5">
          <h2 className="text-lg font-medium">
            Orders{" "}
            <span className="text-gray-400 font-normal">({orders.length})</span>
          </h2>

          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-20">No orders yet.</p>
          ) : (
            <div className="max-w-4xl rounded-md">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300"
                >
                  {/* Items */}
                  <div className="flex-1 flex gap-5 max-w-80">
                    <Image
                      className="max-w-16 max-h-16 object-cover"
                      src={assets.box_icon}
                      alt="box_icon"
                    />
                    <div className="flex flex-col gap-2">
                      <span className="font-medium leading-snug">
                        {order.items
                          .map((item) => `${item.product?.name ?? item.productId} x ${item.quantity}`)
                          .join(", ")}
                      </span>
                      <span className="text-gray-500">
                        Items: {order.items.length}
                      </span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="text-gray-600 leading-6">
                    <p className="font-medium text-gray-800">
                      {order.address.fullName}
                    </p>
                    <p>{order.address.area}</p>
                    <p>{`${order.address.city}, ${order.address.state}`}</p>
                    <p>{order.address.phone}</p>
                  </div>

                  {/* Amount */}
                  <p className="font-medium my-auto text-gray-800">
                    {currency}{order.totalAmount}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-col gap-1 text-gray-600 my-auto">
                    <span>Method: {order.paymentMethod}</span>
                    <span>
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      Payment:{" "}
                      <span
                        className={order.isPaid ? "text-green-600" : "text-red-500"}
                      >
                        {order.isPaid ? "Paid" : "Pending"}
                      </span>
                    </span>
                  </div>

                  {/* Status */}
                  <div className="flex flex-col gap-2 my-auto min-w-[130px]">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium border text-center ${STATUS_COLORS[order.status] || STATUS_COLORS.pending}`}
                    >
                      {order.status?.toUpperCase()}
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="text-xs border border-gray-300 rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-orange-400 cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Orders;