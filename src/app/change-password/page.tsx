'use client';


import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '../dashboard/components/Sidebar';
import Topbar from '../dashboard/components/Topbar';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessageType("error");
      setMessage("New passwords do not match.");
      return;
    }

    const userId = localStorage.getItem("userId");

    if (!userId) {
      setMessageType("error");
      setMessage("User ID not found.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, oldPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setMessageType("success");
      setMessage("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      router.push('/dashboard');

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message || "Failed to change password.");
      } else {
        setMessage("Failed to change password.");
      }
      setMessageType("error");

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-white text-black overflow-auto">
        <Topbar />
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] p-4">
          <div className="bg-gray-100 p-6 rounded-lg w-full max-w-md space-y-6 shadow">
            <h2 className="text-xl font-bold text-black">Change Password</h2>

            {message && (
              <div className={`p-2 rounded text-sm text-white ${messageType === "success" ? "bg-green-600" : "bg-red-600"}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              {[
                { label: "Old Password", value: oldPassword, setter: setOldPassword },
                { label: "New Password", value: newPassword, setter: setNewPassword },
                { label: "Confirm New Password", value: confirmPassword, setter: setConfirmPassword },
              ].map(({ label, value, setter }, idx) => (
                <div key={idx}>
                  <label className="text-sm block mb-1">{label}</label>
                  <div className="relative">
                    <input
                      type={showPassword && idx !== 0 ? "text" : "password"}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="w-full px-10 py-2 bg-white rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="********"
                      required
                    />
                    <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    {idx === 1 && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-400"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="submit"
                className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 text-black font-bold rounded-md transition"
                disabled={loading}
              >
                {loading ? "Processing..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
