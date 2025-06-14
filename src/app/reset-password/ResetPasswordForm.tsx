"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setMessage("Invalid password reset link.");
      setMessageType("error");
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to reset password");
        setMessageType("error");
      } else {
        setMessage("Password reset successful! Redirecting to login...");
        setMessageType("success");
        setTimeout(() => router.push("/login"), 2000); // Change to your login path
      }
    }  catch {
        setMessage("Something went wrong. Please try again.");
        setMessageType("error");
      }  finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-zinc-800 p-6 rounded space-y-4"
      >
        <h2 className="text-2xl font-bold">Reset Password</h2>

        {message && (
          <div
            className={`p-2 rounded ${
              messageType === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {message}
          </div>
        )}

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-zinc-700 border border-zinc-600"
          required
          minLength={6}
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 rounded bg-zinc-700 border border-zinc-600"
          required
          minLength={6}
        />

        <button
          type="submit"
          disabled={loading || !token || !email}
          className="w-full py-2 bg-green-600 hover:bg-green-700 rounded font-bold disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
