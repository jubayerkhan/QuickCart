'use client'

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from '@/components/seller/Navbar'
import Sidebar from '@/components/seller/Sidebar'

export default function Layout({ children }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const role = user?.publicMetadata?.role;

    if (role !== "seller" && role !== "admin") {
      router.push("/unauthorized");
    }
  }, [isLoaded, user]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="flex w-full">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}