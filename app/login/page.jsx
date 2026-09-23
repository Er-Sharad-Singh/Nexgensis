"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiLogIn,
  FiPackage,
  FiAlertCircle,
} from "react-icons/fi";

import { loginUser } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await loginUser(
        username,
        password
      );

      localStorage.setItem(
        "token",
        response.data.accessToken
      );

      router.replace("/products");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Invalid username or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-light)]">
            <FiPackage
              size={24}
              className="text-[var(--color-primary)]"
            />
          </div>

          <h1 className="mt-4 text-2xl font-bold text-[var(--color-text)]">
            Product Admin
          </h1>

          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Manage your products from one place
          </p>
        </div>

        {/* Login card */}
        <form
          onSubmit={handleLogin}
          className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)] sm:p-8"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              Welcome back
            </h2>

            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Sign in to continue to your dashboard.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-2 rounded-lg border border-red-100 bg-[var(--color-danger-light)] p-3 text-sm text-[var(--color-danger)]">
              <FiAlertCircle
                size={17}
                className="mt-0.5 shrink-0"
              />

              <span>{error}</span>
            </div>
          )}

          {/* Username */}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-[var(--color-text)]"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              placeholder="Enter username"
              autoComplete="username"
              className="w-full rounded-[var(--radius-button)] border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-orange-100"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[var(--color-text)]"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter password"
              autoComplete="current-password"
              className="w-full rounded-[var(--radius-button)] border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-orange-100"
              required
            />
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--color-primary)] py-2.5 text-sm font-medium text-white transition hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiLogIn size={17} />

            {loading ? "Signing in..." : "Sign In"}
          </button>

          
        </form>

        <p className="mt-5 text-center text-xs text-[var(--color-text-muted)]">
          Product Admin Dashboard
        </p>
      </div>
    </main>
  );
}
