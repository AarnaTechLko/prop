'use client';
import React, { useState, useEffect } from "react";
import Sidebar from "../dashboard/components/Sidebar";
import Topbar from "../dashboard/components/Topbar";
import { useRouter } from 'next/navigation';

// Icons
import {
  User,
} from 'lucide-react';

// ✅ Define User type (adjust fields as per your DB schema)
interface User {
  id: string;
  name: string;
  address?: string;
  dealsClosed?: number;
  listings?: number;
  posts?: number;
}

export default function MobileNotificationsPage() {
  const [activeTab, setActiveTab] = useState('posts');
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Get userId from localStorage
  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) setUserId(id);
  }, []);

  // Fetch user profile by ID
  useEffect(() => {
    async function fetchUser() {
      if (!userId) return;

      try {
        const res = await fetch("/api/profile", {
          headers: { "x-user-id": userId },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          console.error("Failed to fetch profile:", res.status);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }

    fetchUser();
  }, [userId]);

  const handleEdit = () => {
    if (userId) {
      router.push(`/profile-settings/${userId}`);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="flex-1 p-6 bg-[#f8f7f5] overflow-y-auto">
          {!user ? (
            <p className="text-gray-500">Loading user data...</p>
          ) : (
            <>
              {/* Header Info */}
              {/* <div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-gray-700">
                  ID: {user.id}
                  {user.address && <> &bull; {user.address}</>}
                </p>
                <div className="flex items-center gap-6 mt-2 text-gray-700 text-sm">
                  <span className="flex items-center gap-1 text-green-500">
                    ✅ {user.dealsClosed ?? 0} Deals Closed
                  </span>
                  <span className="flex items-center gap-1 text-blue-500">
                    📦 {user.listings ?? 0} Listings
                  </span>
                  <span className="flex items-center gap-1 text-purple-500">
                    📝 {user.posts ?? 0} Posts
                  </span>
                </div>
              </div> */}

             

              {/* Profile Section */}
              <div className="flex items-center justify-between my-6 bg-[#fef8ed] p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center bg-[#e7e7e7] text-2xl text-black">
                    {user.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-black">{user.name}</h1>
                    <p className="text-gray-700 text-sm">Charlotte • Joined April 2025</p>
                    <p className="text-gray-400 text-xs">User Bio or role</p>
                  </div>
                </div>
                <button
                  onClick={handleEdit}
                  className="bg-[#ffa31a] text-white px-4 py-2 rounded hover:bg-[#ff8c00] text-sm"
                >
                  Edit Profile
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4 mb-6 text-sm">
                {['7 Posts', '2 Listings', '42 Followers', '12 Deals Closed'].map((item, idx) => (
                  <div key={idx} className="text-center py-6 bg-white shadow-sm rounded">
                    <p className="text-2xl font-bold text-black">{item.split(' ')[0]}</p>
                    <p className="text-gray-600">{item.split(' ').slice(1).join(' ')}</p>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="flex space-x-4 border-b px-6 pt-4">
                  {['posts', 'listings', 'activity', 'reviews'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2 border-b-2 ${activeTab === tab ? 'border-[#ffa31a]' : 'border-transparent'} text-gray-700 capitalize`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {activeTab === 'posts' && (
                    <div className="bg-white border border-gray-200 shadow-sm rounded p-6">
                      <p className="font-semibold text-lg text-black">I got it</p>
                      <p className="text-sm text-gray-500">Apr 11, 2025 • general</p>
                      <p className="mt-3 text-gray-800">whats good everyone</p>
                      <p className="text-sm text-gray-400 mt-3">12 likes • 5 comments</p>
                      <button className="text-red-500 mt-3 hover:underline">Delete</button>
                    </div>
                  )}
                  {activeTab === 'listings' && <div className="text-gray-600">Listings content...</div>}
                  {activeTab === 'activity' && <div className="text-gray-600">Activity content...</div>}
                  {activeTab === 'reviews' && <div className="text-gray-600">Reviews content...</div>}
                </div>
              </div>

              {/* Mobile App Info */}
              <div className="bg-white shadow rounded-lg p-6 space-y-4 mt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">Mobile App</h2>
                    <p className="text-sm text-gray-500">Install LandOS on your device for faster access and offline capabilities</p>
                    <ul className="text-sm list-disc list-inside mt-2 text-gray-500">
                      <li>Faster access to your leads</li>
                      <li>Instant lead notifications</li>
                      <li>Works offline</li>
                      <li>No app store required</li>
                    </ul>
                  </div>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-sm">
                    Install Mobile App
                  </button>
                </div>

                <div className="pt-4 border-t">
                  <h2 className="text-lg font-semibold">Push Notifications</h2>
                  <p className="text-sm text-gray-500">Get notified about new messages and important updates</p>
                  <button className="mt-2 border border-gray-300 rounded px-4 py-2 text-sm hover:bg-gray-100">
                    Configure Notifications
                  </button>
                </div>
              </div>

              {/* Twilio Section */}
              <div className="bg-white shadow rounded-lg p-6 space-y-4 mt-6">
                <h2 className="text-lg font-semibold">Twilio Integration</h2>
                <p className="text-sm text-red-500 font-medium">Not Connected</p>
                <div className="space-y-2">
                  <label htmlFor="accountSid" className="block text-sm font-medium text-gray-700">Account SID</label>
                  <input id="accountSid" value="info@opulentnexus.com" readOnly className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-gray-100" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="authToken" className="block text-sm font-medium text-gray-700">Auth Token</label>
                  <input id="authToken" type="password" value="••••••••••••" readOnly className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-gray-100" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="twilioNumber" className="block text-sm font-medium text-gray-700">Twilio Phone Number</label>
                  <input id="twilioNumber" value="+1 (XXX) XXX-XXXX" readOnly className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-gray-100" />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
