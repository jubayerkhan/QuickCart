import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="flex items-center justify-center h-screen text-xl">
      🚫 You are not authorized to access this page
      <Link href="/" className="ml-2 text-blue-500 hover:underline">
        Go back home
      </Link>
    </div>
  );
}