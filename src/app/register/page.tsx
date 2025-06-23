"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from 'sweetalert2';
import {
  Eye, EyeOff, Mail, Lock, Phone, User
} from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [loading, setLoading] = useState(false);

  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotType, setForgotType] = useState<"success" | "error" | "">("");
  const [forgotLoading, setForgotLoading] = useState(false);


  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (forgotMessage) {
      const timer = setTimeout(() => {
        setForgotMessage("");
        setForgotType("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [forgotMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (tab === "register") {
      if (password !== confirmPassword) {
        setMessage("Passwords do not match");
        setMessageType("error");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("mobile", mobile);

     try {
  const res = await fetch("/api/register", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();

  if (!res.ok) {
    await Swal.fire({
      icon: "error",
      title: "Registration Failed",
      text: data.error || "Please try again.",
    });
  } else {
    await Swal.fire({
      icon: "success",
      title: "Registration Successful!",
      text: "Please login with your credentials.",
      timer: 2000,
      showConfirmButton: false,
    });

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setMobile("");

    setTab("login"); // ⬅️ Go to login tab
  }
} catch (err) {
  console.error("Registration error:", err);
  await Swal.fire({
    icon: "error",
    title: "Oops!",
    text: "Something went wrong. Please try again.",
  });
} finally {
  setLoading(false);
}

    } else {
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setMessage(data.error || "Login failed");
          setMessageType("error");
        } else {
          setMessage("Login successful!");
          setMessageType("success");
          localStorage.setItem("token", data.token);
          localStorage.setItem("userName", data.user.name);
          localStorage.setItem("userId", data.user.id);
          localStorage.setItem("userEmail", data.user.email);
          router.push("/dashboard");
        }
      } catch {
        setMessage("Something went wrong. Please try again.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      setForgotMessage("Please enter your email");
      setForgotType("error");
      return;
    }
    setForgotLoading(true);
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        setForgotMessage(data.error || "This Email is not registered on our Platform!");
        setForgotType("error");
      } else {
        setForgotMessage(data.message);
        setForgotType("success");

        setTimeout(() => {
          setShowForgot(false);
          //router.push("/dashboard"); // 🔁 redirect instead of reload
        }, 1000);
      }
    } catch {
      setForgotMessage("Something went wrong.");
      setForgotType("error");
    } finally {
      setForgotLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="mb-6">
        <Image src="/image/logo.jpg" alt="Logo" width={140} height={140} className="rounded-full" />
      </div>

      <div className="w-full max-w-md bg-zinc-900 text-white p-6 rounded-xl shadow-xl space-y-6">
        <div>
          <h2 className="text-xl font-bold">Welcome to Land OS</h2>
          <p className="text-sm text-zinc-400">
            The intelligent land investment platform with AI-powered analysis
          </p>
        </div>

        {message && (
          <div className={`p-2 rounded text-white ${messageType === "success" ? "bg-green-600" : "bg-red-600"}`}>
            {message}
          </div>
        )}

        <div className="flex space-x-2">
          <button
            className={`w-full py-2 rounded-md font-medium ${tab === "login" ? "bg-green-500 text-black" : "bg-zinc-800 text-gray-400"}`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={`w-full py-2 rounded-md font-medium ${tab === "register" ? "bg-green-500 text-black" : "bg-zinc-800 text-gray-400"}`}
            onClick={() => setTab("register")}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === "register" && (
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-sm mb-1 block">Name</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-10 py-2 bg-zinc-800 rounded border border-zinc-700"
                  />
                  <User className="absolute left-3 top-2.5 text-zinc-400" size={18} />
                </div>
              </div>
              <div className="w-1/2">
                <label className="text-sm mb-1 block">Mobile</label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="+91XXXXXXXXXX"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full px-10 py-2 bg-zinc-800 rounded border border-zinc-700"
                  />
                  <Phone className="absolute left-3 top-2.5 text-zinc-400" size={18} />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="text-sm mb-1 block">Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-10 py-2 bg-zinc-800 rounded border border-zinc-700"
              />
              <Mail className="absolute left-3 top-2.5 text-zinc-400" size={18} />
            </div>
          </div>

          <div className={`${tab === "register" ? "flex gap-4" : ""}`}>
            <div className={tab === "register" ? "w-1/2" : "w-full"}>
              <label className="text-sm mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-10 py-2 bg-zinc-800 rounded border border-zinc-700"
                />
                <Lock className="absolute left-3 top-2.5 text-zinc-400" size={18} />
                <button type="button" className="absolute right-3 top-2.5 text-zinc-400" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {tab === "register" && (
              <div className="w-1/2">
                <label className="text-sm mb-1 block">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-10 py-2 bg-zinc-800 rounded border border-zinc-700"
                  />
                  <Lock className="absolute left-3 top-2.5 text-zinc-400" size={18} />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-green-600 hover:bg-green-700 text-black font-bold rounded-md transition"
            disabled={loading}
          >
            {loading ? "Processing..." : tab === "login" ? "Sign In" : "Register"}
          </button>

          {tab === "login" && (
            <div className="text-right text-sm text-green-500 hover:underline cursor-pointer" onClick={() => setShowForgot(true)}>
              Forgot password?
            </div>
          )}
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm text-black space-y-4">
            <h3 className="text-lg font-semibold">Forgot Password</h3>

            {forgotMessage && (
              <div className={`p-2 rounded text-white text-sm ${forgotType === "success" ? "bg-green-600" : "bg-red-600"}`}>
                {forgotMessage}
              </div>
            )}

            <input
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowForgot(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleForgotPassword}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={forgotLoading}
              >
                {forgotLoading ? "Sending..." : "Reset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
