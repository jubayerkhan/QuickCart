"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function OrderConfirmation() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("id");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Order Placed Successfully 🎉
      </h1>

      <p className="text-gray-600 mb-2">
        Your order has been confirmed.
      </p>

      <p className="text-sm text-gray-500 mb-6">
        Order ID: {orderId}
      </p>

      <Link
        href="/my-orders"
        className="bg-orange-600 text-white px-6 py-3 rounded"
      >
        View My Orders
      </Link>
    </div>
  );
}