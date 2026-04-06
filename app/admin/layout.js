'use client'

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const role = user?.publicMetadata?.role;

    if (role !== "admin") {
      router.push("/unauthorized");
    }
  }, [isLoaded, user]);

  if (!isLoaded) return <div>Loading...</div>;

  return <>{children}</>;
}