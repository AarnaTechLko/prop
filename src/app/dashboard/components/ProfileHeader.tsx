'use client';
import Image from 'next/image';
import Link from 'next/link';

const ProfileHeader = () => (
  <div className="bg-white text-white p-6 rounded-lg">
    <div className="flex items-center space-x-6">
      <Image
        src="/image/download.jpg"
        alt="Profile"
        width={80}
        height={80}
        className="rounded-full border-4 border-white"
        priority
      />
      <div className="flex-1">
        <h2 className="text-2xl font-semibold">info</h2>
        <p className="text-sm text-gray-400">Land Investor • Phoenix, Arizona</p>
        <div className="flex space-x-4 text-sm mt-2">
          <span>✔️ 54 Deals Closed</span>
          <span>🏠 32 Listings</span>
          <span>💬 87 Posts</span>
        </div>
      </div>
      <Link
        href="#"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Message
      </Link>
    </div>
  </div>
);

export default ProfileHeader;
