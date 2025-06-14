'use client';

import React, { useState } from "react";
import Sidebar from "../dashboard/components/Sidebar";
import Topbar from "../dashboard/components/Topbar";
import Image from 'next/image';

export default function MobileNotificationsPage() {
  const [activeTab, setActiveTab] = useState('posts');
  const [activeSection] = useState('profile');

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <Topbar />

        {/* Main body content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main Content */}
          <main className="flex-1 p-6 bg-[#f8f7f5] overflow-y-auto">
            {activeSection === 'profile' && (
              <>
                {/* Profile Card */}
                <div className="flex items-center justify-between mb-6 bg-[#fef8ed] p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full flex items-center justify-center bg-[#e7e7e7] text-2xl text-black">ER</div>
                    <div>
                      <h1 className="text-2xl font-semibold text-black">Eric M</h1>
                      <p className="text-gray-700">Charlotte • Joined April 2025</p>
                      <p className="text-gray-400 text-sm">tets</p>
                    </div>
                  </div>
                  <button className="bg-[#ffa31a] text-white px-4 py-2 rounded hover:bg-[#ff8c00]">
                    Edit Profile
                  </button>
                </div>

                {/* Profile Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
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
                    {['posts', 'listings', 'activity', 'reviews', 'ad-platforms'].map(tab => (
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

                    {/* Ad Platforms Tab */}
                    {activeTab === 'ad-platforms' && (
                      <div className="flex gap-6 py-4 mt-8 ms-6">
                        {/* Facebook Ads Integration Card */}
                        <div className="bg-white p-6 rounded shadow border border-gray-300 w-full max-w-md mt-6 ">
                          <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-semibold">Facebook Ads Integration</h2>
                            <span className="text-xs text-red-500 flex items-center gap-1">❌ Not Connected</span>
                          </div>
                          <p className="text-xs text-gray-500 mb-4">
                            Connect to Facebook Ads to import leads and sync campaigns
                          </p>
                          <div className="flex justify-center mb-1 text-2xl">
                            <Image
                              src="/image/download (1).png"
                              alt="Facebook Ads"
                              width={32}
                              height={32}
                              className="h-8"
                            />
                          </div>
                          <div className="flex justify-center mb-4 text-blue-600 text-4xl">
                            <i className="fab fa-facebook-square"></i>
                          </div>
                          <button className="bg-blue-600 text-white text-xs font-medium px-4 py-2 rounded hover:bg-blue-700 w-full">
                            Connect Facebook Ads
                          </button>
                        </div>

                        {/* Google Ads Integration Card */}
                        <div className="bg-white p-6 rounded shadow border border-gray-300 w-full max-w-md mt-6">
                          <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-semibold">Google Ads Integration</h2>
                            <span className="text-xs text-red-500 flex items-center gap-1">❌ Not Connected</span>
                          </div>
                          <p className="text-xs text-gray-500 mb-4">
                            Connect to Google Ads to import leads and track campaign performance
                          </p>
                          <div className="flex justify-center mb-4 text-2xl">
                            <Image
                              src="/image/download.png"
                              alt="Google Ads"
                              width={32}
                              height={32}
                              className="h-8"
                            />
                          </div>
                          <button className="bg-blue-600 text-white text-xs font-medium px-4 py-2 rounded hover:bg-blue-700 w-full">
                            Connect Google Ads
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile App Info */}
                <div className="bg-white shadow rounded-lg p-6 space-y-4 mt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold">Mobile App</h2>
                      <p className="text-sm text-gray-500">
                        Install LandOS on your device for faster access and offline capabilities
                      </p>
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
                    <p className="text-sm text-gray-500">
                      Get notified about new messages and important updates
                    </p>
                    <button className="mt-2 border border-gray-300 rounded px-4 py-2 text-sm hover:bg-gray-100">
                      Configure Notifications
                    </button>
                  </div>
                </div>

                {/* Twilio Integration */}
                <div className="bg-white shadow rounded-lg p-6 space-y-4 mt-6">
                  <h2 className="text-lg font-semibold">Twilio Integration</h2>
                  <p className="text-sm text-red-500 font-medium">Not Connected</p>

                  <div className="space-y-2">
                    <label htmlFor="accountSid" className="block text-sm font-medium text-gray-700">
                      Account SID
                    </label>
                    <input
                      id="accountSid"
                      value="info@opulentnexus.com"
                      readOnly
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-gray-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="authToken" className="block text-sm font-medium text-gray-700">
                      Auth Token
                    </label>
                    <input
                      id="authToken"
                      type="password"
                      value="••••••••••••"
                      readOnly
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-gray-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="twilioNumber" className="block text-sm font-medium text-gray-700">
                      Twilio Phone Number
                    </label>
                    <input
                      id="twilioNumber"
                      value="+1 (XXX) XXX-XXXX"
                      readOnly
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-gray-100"
                    />
                  </div>

                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Connect Twilio
                  </button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
