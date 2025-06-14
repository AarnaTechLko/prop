"use client";

import { useEffect, useState } from "react";
import { HiPencil } from "react-icons/hi";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "../dashboard/components/Sidebar";
import Topbar from "../dashboard/components/Topbar";

interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  location?: string;
  address?: string;
  image?: string;
  bio?: string;
  dealsClosed?: number;
  listings?: number;
  posts?: number;
}

export default function ProfilePage() {
  const [userId, setUserId] = useState("");
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) setUserId(id);
  }, []);

  useEffect(() => {
    async function fetchUser() {
      if (!userId) return;

      const res = await fetch("/api/profile", {
        headers: { "x-user-id": userId },
      });

      if (!res.ok) {
        console.error("Failed to fetch profile:", res.status);
        return;
      }

      const data = await res.json();
      setUser(data);
    }
    fetchUser();
  }, [userId]);

  const handleEdit = () => {
    if (userId) {
      router.push(`/profile-settings/${userId}`);
    }
  };

  if (!user) {
    return (
      <div className="flex h-screen bg-white text-black font-sans">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <p>Loading profile...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white text-black font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1">
                   <Topbar />
     
      <main className="flex-1 p-6 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Profile</h1>
          <button
            onClick={handleEdit}
            className="bg-gray-200 hover:bg-gray-200 transition rounded px-4 py-2 flex items-center gap-1"
          >
            <HiPencil className="h-4 w-4" />
            Edit Profile
          </button>
        </header>

        <section className="bg-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-6 mb-4">
            <Image
              src={user.image || "/image/download.jpg"}
              alt="Profile"
              width={96}
              height={96}
              className="rounded-full object-cover"
              priority
            />
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-700">
                ID: {user.id}
                {user.address && <> &bull; {user.address}</>}
              </p>
              <div className="flex items-center gap-6 mt-2 text-gray-700 text-sm">
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {user.dealsClosed ?? 0} Deals Closed
                </div>
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 7h18M3 12h18M3 17h18" />
                  </svg>
                  {user.listings ?? 0} Listings
                </div>
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 8h10M7 12h4m1 8v-6" />
                  </svg>
                  {user.posts ?? 0} Posts
                </div>
              </div>
            </div>
            <div className="ml-auto flex flex-col items-center gap-2">
              <button className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-black font-semibold">
                Message
              </button>
            </div>
          </div>
        </section>
      </main>
      </div>
    </div>
  );
}
