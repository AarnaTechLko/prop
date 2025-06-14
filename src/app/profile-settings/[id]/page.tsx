"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../dashboard/components/Sidebar";
import Topbar from "../../dashboard/components/Topbar";

const initialUserData = {
  name: "",
  mobile: "",
  email: "",
  address: "",
};

export default function EditProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState(initialUserData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userId = localStorage.getItem("userId");
        console.log("Fetching user with ID:", userId);
        const res = await fetch("/api/profile", {
          headers: { "x-user-id": userId || "" },
        });
        console.log("Response status:", res.status);
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setFormData(data);
      } catch (err) {
        console.error("Error loading user data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId || "",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        router.push("/profile-settings");
      } else {
        const errorData = await response.json();
        alert("Error: " + errorData.error);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to update profile.");
    }
  };

  if (loading) return <div className="text-black p-4">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-200 text-black">
      <div className="w-64 fixed h-full bg-white z-10">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 ml-64">
        <Topbar />
        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto  rounded-md">
            <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="name" className="block mb-1 font-semibold">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded border border-black bg-white p-2"
                    type="text"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block mb-1 font-semibold">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="w-full rounded border border border-black bg-white  p-2 cursor-not-allowed"
                    type="email"
                  />
                </div>

                <div>
                  <label htmlFor="mobile" className="block mb-1 font-semibold">
                    Mobile
                  </label>
                  <input
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    readOnly
                    className="w-full rounded border border border-black bg-white  p-2 cursor-not-allowed"
                    type="tel"
                  />
                </div>
              </div>

              <div>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  className="w-full rounded border border border-black bg-white  p-2"
                  rows={3}
                />

              </div>

              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
