"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setChecking(false);
  }, [router]);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)]">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-[var(--color-primary)]" />
      </main>
    );
  }

  return children;
}

