"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ isAllowed = true, fallback = "/", children }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAllowed) {
      router.replace(fallback);
    }
  }, [isAllowed, fallback, router]);

  if (!isAllowed) {
    return null;
  }

  return children;
}
